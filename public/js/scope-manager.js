"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("./errors"),
    getScopeParserExecutionError = _require.getScopeParserExecutionError;

var _require2 = require("./utils"),
    last = _require2.last;

var _require3 = require("./doc-utils"),
    concatArrays = _require3.concatArrays;

function find(list, fn) {
  var length = list.length >>> 0;
  var value;

  for (var i = 0; i < length; i++) {
    value = list[i];

    if (fn.call(this, value, i, list)) {
      return value;
    }
  }

  return undefined;
}

function _getValue(tag, meta, num) {
  var _this = this;

  var scope = this.scopeList[num];

  if (this.root.finishedResolving) {
    var w = this.resolved;
    this.scopePath.forEach(function (p, index) {
      var lIndex = _this.scopeLindex[index];
      w = find(w, function (r) {
        return r.lIndex === lIndex;
      });
      w = w.value[_this.scopePathItem[index]];
    });
    return [this.scopePath.length - 1, find(w, function (r) {
      return meta.part.lIndex === r.lIndex;
    }).value];
  } // search in the scopes (in reverse order) and keep the first defined value


  var result;
  var parser;

  if (!this.cachedParsers || !meta.part) {
    parser = this.parser(tag, {
      scopePath: this.scopePath
    });
  } else if (this.cachedParsers[meta.part.lIndex]) {
    parser = this.cachedParsers[meta.part.lIndex];
  } else {
    parser = this.cachedParsers[meta.part.lIndex] = this.parser(tag, {
      scopePath: this.scopePath
    });
  }

  try {
    result = parser.get(scope, this.getContext(meta, num));
  } catch (error) {
    throw getScopeParserExecutionError({
      tag: tag,
      scope: scope,
      error: error,
      offset: meta.part.offset
    });
  }

  if (result == null && num > 0) {
    return _getValue.call(this, tag, meta, num - 1);
  }

  return [num, result];
}

function _getValueAsync(tag, meta, num) {
  var _this2 = this;

  var scope = this.scopeList[num]; // search in the scopes (in reverse order) and keep the first defined value

  var parser;

  if (!this.cachedParsers || !meta.part) {
    parser = this.parser(tag, {
      scopePath: this.scopePath
    });
  } else if (this.cachedParsers[meta.part.lIndex]) {
    parser = this.cachedParsers[meta.part.lIndex];
  } else {
    parser = this.cachedParsers[meta.part.lIndex] = this.parser(tag, {
      scopePath: this.scopePath
    });
  }

  return Promise.resolve().then(function () {
    return parser.get(scope, _this2.getContext(meta, num));
  })["catch"](function (error) {
    throw getScopeParserExecutionError({
      tag: tag,
      scope: scope,
      error: error,
      offset: meta.part.offset
    });
  }).then(function (result) {
    if (result == null && num > 0) {
      return _getValueAsync.call(_this2, tag, meta, num - 1);
    }

    return result;
  });
} // This class responsibility is to manage the scope


var ScopeManager = /*#__PURE__*/function () {
  function ScopeManager(options) {
    _classCallCheck(this, ScopeManager);

    this.root = options.root || this;
    this.scopePath = options.scopePath;
    this.scopePathItem = options.scopePathItem;
    this.scopePathLength = options.scopePathLength;
    this.scopeList = options.scopeList;
    this.scopeLindex = options.scopeLindex;
    this.parser = options.parser;
    this.resolved = options.resolved;
    this.cachedParsers = options.cachedParsers;
  }

  _createClass(ScopeManager, [{
    key: "loopOver",
    value: function loopOver(tag, functor, inverted, meta) {
      return this.loopOverValue(this.getValue(tag, meta), functor, inverted);
    }
  }, {
    key: "functorIfInverted",
    value: function functorIfInverted(inverted, functor, value, i, length) {
      if (inverted) {
        functor(value, i, length);
      }

      return inverted;
    }
  }, {
    key: "isValueFalsy",
    value: function isValueFalsy(value, type) {
      return value == null || !value || type === "[object Array]" && value.length === 0;
    }
  }, {
    key: "loopOverValue",
    value: function loopOverValue(value, functor, inverted) {
      if (this.root.finishedResolving) {
        inverted = false;
      }

      var type = Object.prototype.toString.call(value);

      if (this.isValueFalsy(value, type)) {
        return this.functorIfInverted(inverted, functor, last(this.scopeList), 0, 1);
      }

      if (type === "[object Array]") {
        for (var i = 0; i < value.length; i++) {
          this.functorIfInverted(!inverted, functor, value[i], i, value.length);
        }

        return true;
      }

      if (type === "[object Object]") {
        return this.functorIfInverted(!inverted, functor, value, 0, 1);
      }

      return this.functorIfInverted(!inverted, functor, last(this.scopeList), 0, 1);
    }
  }, {
    key: "getValue",
    value: function getValue(tag, meta) {
      var _getValue$call = _getValue.call(this, tag, meta, this.scopeList.length - 1),
          _getValue$call2 = _slicedToArray(_getValue$call, 2),
          num = _getValue$call2[0],
          result = _getValue$call2[1];

      this.num = num;
      return result;
    }
  }, {
    key: "getValueAsync",
    value: function getValueAsync(tag, meta) {
      return _getValueAsync.call(this, tag, meta, this.scopeList.length - 1);
    }
  }, {
    key: "getContext",
    value: function getContext(meta, num) {
      return {
        num: num,
        meta: meta,
        scopeList: this.scopeList,
        resolved: this.resolved,
        scopePath: this.scopePath,
        scopePathItem: this.scopePathItem,
        scopePathLength: this.scopePathLength
      };
    }
  }, {
    key: "createSubScopeManager",
    value: function createSubScopeManager(scope, tag, i, part, length) {
      return new ScopeManager({
        root: this.root,
        resolved: this.resolved,
        parser: this.parser,
        cachedParsers: this.cachedParsers,
        scopeList: concatArrays([this.scopeList, [scope]]),
        scopePath: concatArrays([this.scopePath, [tag]]),
        scopePathItem: concatArrays([this.scopePathItem, [i]]),
        scopePathLength: concatArrays([this.scopePathLength, [length]]),
        scopeLindex: concatArrays([this.scopeLindex, [part.lIndex]])
      });
    }
  }]);

  return ScopeManager;
}();

module.exports = function (options) {
  options.scopePath = [];
  options.scopePathItem = [];
  options.scopePathLength = [];
  options.scopeLindex = [];
  options.scopeList = [options.tags];
  return new ScopeManager(options);
};