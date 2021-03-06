"use strict";

var traitName = "expandPair";

var mergeSort = require("../mergesort");

var _require = require("../doc-utils"),
    getLeft = _require.getLeft,
    getRight = _require.getRight;

var wrapper = require("../module-wrapper");

var _require2 = require("../traits"),
    getExpandToDefault = _require2.getExpandToDefault;

var _require3 = require("../errors"),
    getUnmatchedLoopException = _require3.getUnmatchedLoopException,
    getClosingTagNotMatchOpeningTag = _require3.getClosingTagNotMatchOpeningTag,
    throwLocationInvalid = _require3.throwLocationInvalid,
    getUnbalancedLoopException = _require3.getUnbalancedLoopException;

function getOpenCountChange(part) {
  switch (part.location) {
    case "start":
      return 1;

    case "end":
      return -1;

    default:
      throwLocationInvalid(part);
  }
}

function match(start, end) {
  return start != null && end != null && (start.part.location === "start" && end.part.location === "end" && start.part.value === end.part.value || end.part.value === "");
}

function transformer(traits) {
  var i = 0;
  var errors = [];

  while (i < traits.length) {
    var part = traits[i].part;

    if (part.location === "end") {
      if (i === 0) {
        traits.splice(0, 1);
        errors.push(getUnmatchedLoopException(part));
        return {
          traits: traits,
          errors: errors
        };
      }

      var endIndex = i;
      var startIndex = i - 1;
      var offseter = 1;

      if (match(traits[startIndex], traits[endIndex])) {
        traits.splice(endIndex, 1);
        traits.splice(startIndex, 1);
        return {
          errors: errors,
          traits: traits
        };
      }

      while (offseter < 50) {
        var startCandidate = traits[startIndex - offseter];
        var endCandidate = traits[endIndex + offseter];

        if (match(startCandidate, traits[endIndex])) {
          traits.splice(endIndex, 1);
          traits.splice(startIndex - offseter, 1);
          return {
            errors: errors,
            traits: traits
          };
        }

        if (match(traits[startIndex], endCandidate)) {
          traits.splice(endIndex + offseter, 1);
          traits.splice(startIndex, 1);
          return {
            errors: errors,
            traits: traits
          };
        }

        offseter++;
      }

      errors.push(getClosingTagNotMatchOpeningTag({
        tags: [traits[startIndex].part, traits[endIndex].part]
      }));
      traits.splice(endIndex, 1);
      traits.splice(startIndex, 1);
      return {
        traits: traits,
        errors: errors
      };
    }

    if (traits[i] == null) {
      break;
    }

    i++;
  }

  traits.forEach(function (_ref) {
    var part = _ref.part;
    errors.push(getUnmatchedLoopException(part));
  });
  return {
    traits: [],
    errors: errors
  };
}

function getPairs(traits) {
  var levelTraits = {};
  var errors = [];
  var pairs = [];
  var countOpen = 0;
  var transformedTraits = [];

  for (var i = 0; i < traits.length; i++) {
    var currentTrait = traits[i];
    var part = currentTrait.part;
    var change = getOpenCountChange(currentTrait.part);
    countOpen += change;
    var level = void 0;

    if (change === 1) {
      level = countOpen - 1;
    } else {
      level = countOpen;
    }

    transformedTraits.push({
      level: level,
      part: part
    });
  }

  while (transformedTraits.length > 0) {
    var result = transformer(transformedTraits);
    errors = errors.concat(result.errors);
    transformedTraits = result.traits;
  }

  if (errors.length > 0) {
    return {
      pairs: pairs,
      errors: errors
    };
  }

  countOpen = 0;

  for (var _i = 0; _i < traits.length; _i++) {
    var _currentTrait = traits[_i];
    var _part = _currentTrait.part;

    var _change = getOpenCountChange(_part);

    countOpen += _change;

    if (_change === 1) {
      levelTraits[countOpen] = _currentTrait;
    } else {
      var startTrait = levelTraits[countOpen + 1];

      if (countOpen === 0) {
        pairs = pairs.concat([[startTrait, _currentTrait]]);
      }
    }

    countOpen = countOpen >= 0 ? countOpen : 0;
  }

  return {
    pairs: pairs,
    errors: errors
  };
}

var expandPairTrait = {
  name: "ExpandPairTrait",
  optionsTransformer: function optionsTransformer(options, docxtemplater) {
    this.expandTags = docxtemplater.fileTypeConfig.expandTags.concat(docxtemplater.options.paragraphLoop ? docxtemplater.fileTypeConfig.onParagraphLoop : []);
    return options;
  },
  postparse: function postparse(postparsed, _ref2) {
    var _this = this;

    var getTraits = _ref2.getTraits,
        postparse = _ref2.postparse;
    var traits = getTraits(traitName, postparsed);
    traits = traits.map(function (trait) {
      return trait || [];
    });
    traits = mergeSort(traits);

    var _getPairs = getPairs(traits),
        pairs = _getPairs.pairs,
        errors = _getPairs.errors;

    var lastRight = 0;
    var lastPair = null;
    var expandedPairs = pairs.map(function (pair) {
      var expandTo = pair[0].part.expandTo;

      if (expandTo === "auto") {
        var result = getExpandToDefault(postparsed, pair, _this.expandTags);

        if (result.error) {
          errors.push(result.error);
        }

        expandTo = result.value;
      }

      if (!expandTo) {
        var _left = pair[0].offset;
        var _right = pair[1].offset;

        if (_left < lastRight) {
          errors.push(getUnbalancedLoopException(pair, lastPair));
        }

        lastPair = pair;
        lastRight = _right;
        return [_left, _right];
      }

      var left, right;

      try {
        left = getLeft(postparsed, expandTo, pair[0].offset);
      } catch (e) {
        errors.push(e);
      }

      try {
        right = getRight(postparsed, expandTo, pair[1].offset);
      } catch (e) {
        errors.push(e);
      }

      if (left < lastRight) {
        errors.push(getUnbalancedLoopException(pair, lastPair));
      }

      lastRight = right;
      lastPair = pair;
      return [left, right];
    });

    if (errors.length > 0) {
      return {
        postparsed: postparsed,
        errors: errors
      };
    }

    var currentPairIndex = 0;
    var innerParts;
    var newParsed = postparsed.reduce(function (newParsed, part, i) {
      var inPair = currentPairIndex < pairs.length && expandedPairs[currentPairIndex][0] <= i && i <= expandedPairs[currentPairIndex][1];
      var pair = pairs[currentPairIndex];
      var expandedPair = expandedPairs[currentPairIndex];

      if (!inPair) {
        newParsed.push(part);
        return newParsed;
      }

      if (expandedPair[0] === i) {
        innerParts = [];
      }

      if (pair[0].offset !== i && pair[1].offset !== i) {
        innerParts.push(part);
      }

      if (expandedPair[1] === i) {
        var basePart = postparsed[pair[0].offset];
        basePart.subparsed = postparse(innerParts, {
          basePart: basePart
        });
        delete basePart.location;
        delete basePart.expandTo;
        newParsed.push(basePart);
        currentPairIndex++;
      }

      return newParsed;
    }, []);
    return {
      postparsed: newParsed,
      errors: errors
    };
  }
};

module.exports = function () {
  return wrapper(expandPairTrait);
};