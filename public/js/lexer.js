"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("./errors"),
    getUnclosedTagException = _require.getUnclosedTagException,
    getUnopenedTagException = _require.getUnopenedTagException,
    getDuplicateOpenTagException = _require.getDuplicateOpenTagException,
    getDuplicateCloseTagException = _require.getDuplicateCloseTagException,
    throwMalformedXml = _require.throwMalformedXml,
    throwXmlInvalid = _require.throwXmlInvalid;

var _require2 = require("./doc-utils"),
    concatArrays = _require2.concatArrays,
    isTextStart = _require2.isTextStart,
    isTextEnd = _require2.isTextEnd;

var NONE = -2;
var EQUAL = 0;
var START = -1;
var END = 1;

function inRange(range, match) {
  return range[0] <= match.offset && match.offset < range[1];
}

function updateInTextTag(part, inTextTag) {
  if (isTextStart(part)) {
    if (inTextTag) {
      throwMalformedXml(part);
    }

    return true;
  }

  if (isTextEnd(part)) {
    if (!inTextTag) {
      throwMalformedXml(part);
    }

    return false;
  }

  return inTextTag;
}

function getTag(tag) {
  var position = "";
  var start = 1;
  var end = tag.indexOf(" ");

  if (tag[tag.length - 2] === "/") {
    position = "selfclosing";

    if (end === -1) {
      end = tag.length - 2;
    }
  } else if (tag[1] === "/") {
    start = 2;
    position = "end";

    if (end === -1) {
      end = tag.length - 1;
    }
  } else {
    position = "start";

    if (end === -1) {
      end = tag.length - 1;
    }
  }

  return {
    tag: tag.slice(start, end),
    position: position
  };
}

function tagMatcher(content, textMatchArray, othersMatchArray) {
  var cursor = 0;
  var contentLength = content.length;
  var allMatches = concatArrays([textMatchArray.map(function (tag) {
    return {
      tag: tag,
      text: true
    };
  }), othersMatchArray.map(function (tag) {
    return {
      tag: tag,
      text: false
    };
  })]).reduce(function (allMatches, t) {
    allMatches[t.tag] = t.text;
    return allMatches;
  }, {});
  var totalMatches = [];

  while (cursor < contentLength) {
    cursor = content.indexOf("<", cursor);

    if (cursor === -1) {
      break;
    }

    var offset = cursor;
    var nextOpening = content.indexOf("<", cursor + 1);
    cursor = content.indexOf(">", cursor);

    if (cursor === -1 || nextOpening !== -1 && cursor > nextOpening) {
      throwXmlInvalid(content, offset);
    }

    var tagText = content.slice(offset, cursor + 1);

    var _getTag = getTag(tagText),
        tag = _getTag.tag,
        position = _getTag.position;

    var text = allMatches[tag];

    if (text == null) {
      continue;
    }

    totalMatches.push({
      type: "tag",
      position: position,
      text: text,
      offset: offset,
      value: tagText,
      tag: tag
    });
  }

  return totalMatches;
}

function getDelimiterErrors(delimiterMatches, fullText, ranges) {
  if (delimiterMatches.length === 0) {
    return [];
  }

  var errors = [];
  var inDelimiter = false;
  var lastDelimiterMatch = {
    offset: 0
  };
  var xtag;
  var rangeIndex = 0;
  delimiterMatches.forEach(function (delimiterMatch) {
    while (ranges[rangeIndex + 1]) {
      if (ranges[rangeIndex + 1].offset > delimiterMatch.offset) {
        break;
      }

      rangeIndex++;
    }

    xtag = fullText.substr(lastDelimiterMatch.offset, delimiterMatch.offset - lastDelimiterMatch.offset);

    if (delimiterMatch.position === "start" && inDelimiter || delimiterMatch.position === "end" && !inDelimiter) {
      if (delimiterMatch.position === "start") {
        if (lastDelimiterMatch.offset + lastDelimiterMatch.length === delimiterMatch.offset) {
          xtag = fullText.substr(lastDelimiterMatch.offset, delimiterMatch.offset - lastDelimiterMatch.offset + lastDelimiterMatch.length + 4);
          errors.push(getDuplicateOpenTagException({
            xtag: xtag,
            offset: lastDelimiterMatch.offset
          }));
        } else {
          errors.push(getUnclosedTagException({
            xtag: xtag,
            offset: lastDelimiterMatch.offset
          }));
        }

        delimiterMatch.error = true;
      } else {
        if (lastDelimiterMatch.offset + lastDelimiterMatch.length === delimiterMatch.offset) {
          xtag = fullText.substr(lastDelimiterMatch.offset - 4, delimiterMatch.offset - lastDelimiterMatch.offset + 4 + lastDelimiterMatch.length);
          errors.push(getDuplicateCloseTagException({
            xtag: xtag,
            offset: lastDelimiterMatch.offset
          }));
        } else {
          errors.push(getUnopenedTagException({
            xtag: xtag,
            offset: delimiterMatch.offset
          }));
        }

        delimiterMatch.error = true;
      }
    } else {
      inDelimiter = !inDelimiter;
    }

    lastDelimiterMatch = delimiterMatch;
  });
  var delimiterMatch = {
    offset: fullText.length
  };
  xtag = fullText.substr(lastDelimiterMatch.offset, delimiterMatch.offset - lastDelimiterMatch.offset);

  if (inDelimiter) {
    errors.push(getUnclosedTagException({
      xtag: xtag,
      offset: lastDelimiterMatch.offset
    }));
    delimiterMatch.error = true;
  }

  return errors;
}

function compareOffsets(startOffset, endOffset) {
  if (startOffset === -1 && endOffset === -1) {
    return NONE;
  }

  if (startOffset === endOffset) {
    return EQUAL;
  }

  if (startOffset === -1 || endOffset === -1) {
    return endOffset < startOffset ? START : END;
  }

  return startOffset < endOffset ? START : END;
}

function splitDelimiters(inside) {
  var newDelimiters = inside.split(" ");

  if (newDelimiters.length !== 2) {
    throw new Error("New Delimiters cannot be parsed");
  }

  var _newDelimiters = _slicedToArray(newDelimiters, 2),
      start = _newDelimiters[0],
      end = _newDelimiters[1];

  if (start.length === 0 || end.length === 0) {
    throw new Error("New Delimiters cannot be parsed");
  }

  return [start, end];
}

function getAllIndexes(fullText, delimiters) {
  var indexes = [];
  var start = delimiters.start,
      end = delimiters.end;
  var offset = -1;
  var insideTag = false;

  while (true) {
    var startOffset = fullText.indexOf(start, offset + 1);
    var endOffset = fullText.indexOf(end, offset + 1);
    var position = null;
    var len = void 0;
    var compareResult = compareOffsets(startOffset, endOffset);

    if (compareResult === NONE) {
      return indexes;
    }

    if (compareResult === EQUAL) {
      if (!insideTag) {
        compareResult = START;
      } else {
        compareResult = END;
      }
    }

    if (compareResult === END) {
      insideTag = false;
      offset = endOffset;
      position = "end";
      len = end.length;
    }

    if (compareResult === START) {
      insideTag = true;
      offset = startOffset;
      position = "start";
      len = start.length;
    }

    if (position === "start" && fullText[offset + start.length] === "=") {
      indexes.push({
        offset: startOffset,
        position: "start",
        length: start.length,
        changedelimiter: true
      });
      var nextEqual = fullText.indexOf("=", offset + start.length + 1);

      var _endOffset = fullText.indexOf(end, nextEqual + 1);

      indexes.push({
        offset: _endOffset,
        position: "end",
        length: end.length,
        changedelimiter: true
      });

      var _insideTag = fullText.substr(offset + start.length + 1, nextEqual - offset - start.length - 1);

      var _splitDelimiters = splitDelimiters(_insideTag);

      var _splitDelimiters2 = _slicedToArray(_splitDelimiters, 2);

      start = _splitDelimiters2[0];
      end = _splitDelimiters2[1];
      offset = _endOffset;
      continue;
    }

    indexes.push({
      offset: offset,
      position: position,
      length: len
    });
  }
}

function parseDelimiters(innerContentParts, delimiters) {
  var full = innerContentParts.map(function (p) {
    return p.value;
  }).join("");
  var delimiterMatches = getAllIndexes(full, delimiters);
  var offset = 0;
  var ranges = innerContentParts.map(function (part) {
    offset += part.value.length;
    return {
      offset: offset - part.value.length,
      lIndex: part.lIndex
    };
  });
  var errors = getDelimiterErrors(delimiterMatches, full, ranges);
  var cutNext = 0;
  var delimiterIndex = 0;
  var parsed = ranges.map(function (p, i) {
    var offset = p.offset;
    var range = [offset, offset + innerContentParts[i].value.length];
    var partContent = innerContentParts[i].value;
    var delimitersInOffset = [];

    while (delimiterIndex < delimiterMatches.length && inRange(range, delimiterMatches[delimiterIndex])) {
      delimitersInOffset.push(delimiterMatches[delimiterIndex]);
      delimiterIndex++;
    }

    var parts = [];
    var cursor = 0;

    if (cutNext > 0) {
      cursor = cutNext;
      cutNext = 0;
    }

    var insideDelimiterChange;
    delimitersInOffset.forEach(function (delimiterInOffset) {
      var value = partContent.substr(cursor, delimiterInOffset.offset - offset - cursor);

      if (value.length > 0) {
        if (insideDelimiterChange) {
          if (delimiterInOffset.changedelimiter) {
            cursor = delimiterInOffset.offset - offset + delimiterInOffset.length;
            insideDelimiterChange = delimiterInOffset.position === "start";
          }

          return;
        }

        parts.push({
          type: "content",
          value: value,
          offset: cursor + offset
        });
        cursor += value.length;
      }

      var delimiterPart = {
        type: "delimiter",
        position: delimiterInOffset.position,
        offset: cursor + offset
      };

      if (delimiterInOffset.error) {
        delimiterPart.error = delimiterInOffset.error;
      }

      if (delimiterInOffset.changedelimiter) {
        insideDelimiterChange = delimiterInOffset.position === "start";
        cursor = delimiterInOffset.offset - offset + delimiterInOffset.length;
        return;
      }

      parts.push(delimiterPart);
      cursor = delimiterInOffset.offset - offset + delimiterInOffset.length;
    });
    cutNext = cursor - partContent.length;
    var value = partContent.substr(cursor);

    if (value.length > 0) {
      parts.push({
        type: "content",
        value: value,
        offset: offset
      });
    }

    return parts;
  }, this);
  return {
    parsed: parsed,
    errors: errors
  };
}

function getContentParts(xmlparsed) {
  var inTextTag = false;
  var innerContentParts = [];
  xmlparsed.forEach(function (part) {
    inTextTag = updateInTextTag(part, inTextTag);

    if (inTextTag && part.type === "content") {
      innerContentParts.push(part);
    }
  });
  return innerContentParts;
}

module.exports = {
  parseDelimiters: parseDelimiters,
  parse: function parse(xmlparsed, delimiters) {
    var inTextTag = false;

    var _parseDelimiters = parseDelimiters(getContentParts(xmlparsed), delimiters),
        delimiterParsed = _parseDelimiters.parsed,
        errors = _parseDelimiters.errors;

    var lexed = [];
    var index = 0;
    xmlparsed.forEach(function (part) {
      inTextTag = updateInTextTag(part, inTextTag);

      if (part.type === "content") {
        part.position = inTextTag ? "insidetag" : "outsidetag";
      }

      if (inTextTag && part.type === "content") {
        Array.prototype.push.apply(lexed, delimiterParsed[index].map(function (p) {
          if (p.type === "content") {
            p.position = "insidetag";
          }

          return p;
        }));
        index++;
      } else {
        lexed.push(part);
      }
    });
    lexed = lexed.map(function (p, i) {
      p.lIndex = i;
      return p;
    });
    return {
      errors: errors,
      lexed: lexed
    };
  },
  xmlparse: function xmlparse(content, xmltags) {
    var matches = tagMatcher(content, xmltags.text, xmltags.other);
    var cursor = 0;
    var parsed = matches.reduce(function (parsed, match) {
      var value = content.substr(cursor, match.offset - cursor);

      if (value.length > 0) {
        parsed.push({
          type: "content",
          value: value
        });
      }

      cursor = match.offset + match.value.length;
      delete match.offset;

      if (match.value.length > 0) {
        parsed.push(match);
      }

      return parsed;
    }, []);
    var value = content.substr(cursor);

    if (value.length > 0) {
      parsed.push({
        type: "content",
        value: value
      });
    }

    return parsed;
  }
};