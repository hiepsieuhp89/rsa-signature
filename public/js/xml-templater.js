"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("./doc-utils"),
    wordToUtf8 = _require.wordToUtf8,
    convertSpaces = _require.convertSpaces,
    defaults = _require.defaults;

var xmlMatcher = require("./xml-matcher");

var _require2 = require("./errors"),
    throwContentMustBeString = _require2.throwContentMustBeString;

var Lexer = require("./lexer");

var Parser = require("./parser.js");

var _render = require("./render.js");

var postrender = require("./postrender.js");

var resolve = require("./resolve.js");

var joinUncorrupt = require("./join-uncorrupt");

function _getFullText(content, tagsXmlArray) {
  var matcher = xmlMatcher(content, tagsXmlArray);
  var result = matcher.matches.map(function (match) {
    return match.array[2];
  });
  return wordToUtf8(convertSpaces(result.join("")));
}

module.exports = /*#__PURE__*/function () {
  function XmlTemplater(content, options) {
    _classCallCheck(this, XmlTemplater);

    this.filePath = options.filePath;
    this.cachedParsers = {};
    this.modules = options.modules;
    this.fileTypeConfig = options.fileTypeConfig;
    this.contentType = options.contentType;
    Object.keys(defaults).map(function (key) {
      this[key] = options[key] != null ? options[key] : defaults[key];
    }, this);
    this.setModules({
      inspect: {
        filePath: this.filePath
      }
    });
    this.load(content);
  }

  _createClass(XmlTemplater, [{
    key: "load",
    value: function load(content) {
      if (typeof content !== "string") {
        throwContentMustBeString(_typeof(content));
      }

      this.content = content;
    }
  }, {
    key: "setTags",
    value: function setTags(tags) {
      this.tags = tags != null ? tags : {};
      return this;
    }
  }, {
    key: "resolveTags",
    value: function resolveTags(tags) {
      var _this = this;

      this.tags = tags != null ? tags : {};
      var options = this.getOptions();
      options.scopeManager = this.scopeManager;
      options.resolve = resolve;
      return resolve(options).then(function (_ref) {
        var resolved = _ref.resolved,
            errors = _ref.errors;
        errors.forEach(function (error) {
          // error properties might not be defined if some foreign
          // (unhandled error not throw by docxtemplater willingly) is
          // thrown.
          error.properties = error.properties || {};
          error.properties.file = _this.filePath;
        });

        if (errors.length !== 0) {
          throw errors;
        }

        return Promise.all(resolved).then(function (resolved) {
          options.scopeManager.finishedResolving = true;
          options.scopeManager.resolved = resolved;

          _this.setModules({
            inspect: {
              resolved: resolved
            }
          });

          return resolved;
        });
      });
    }
  }, {
    key: "getFullText",
    value: function getFullText() {
      return _getFullText(this.content, this.fileTypeConfig.tagsXmlTextArray);
    }
  }, {
    key: "setModules",
    value: function setModules(obj) {
      this.modules.forEach(function (module) {
        module.set(obj);
      });
    }
  }, {
    key: "preparse",
    value: function preparse() {
      this.allErrors = [];
      this.xmllexed = Lexer.xmlparse(this.content, {
        text: this.fileTypeConfig.tagsXmlTextArray,
        other: this.fileTypeConfig.tagsXmlLexedArray
      });
      this.setModules({
        inspect: {
          xmllexed: this.xmllexed
        }
      });

      var _Lexer$parse = Lexer.parse(this.xmllexed, this.delimiters),
          lexed = _Lexer$parse.lexed,
          lexerErrors = _Lexer$parse.errors;

      this.allErrors = this.allErrors.concat(lexerErrors);
      this.lexed = lexed;
      this.setModules({
        inspect: {
          lexed: this.lexed
        }
      });
      var options = this.getOptions();
      Parser.preparse(this.lexed, this.modules, options);
    }
  }, {
    key: "parse",
    value: function parse() {
      this.setModules({
        inspect: {
          filePath: this.filePath
        }
      });
      var options = this.getOptions();
      this.parsed = Parser.parse(this.lexed, this.modules, options);
      this.setModules({
        inspect: {
          parsed: this.parsed
        }
      });

      var _Parser$postparse = Parser.postparse(this.parsed, this.modules, options),
          postparsed = _Parser$postparse.postparsed,
          postparsedErrors = _Parser$postparse.errors;

      this.postparsed = postparsed;
      this.setModules({
        inspect: {
          postparsed: this.postparsed
        }
      });
      this.allErrors = this.allErrors.concat(postparsedErrors);
      this.errorChecker(this.allErrors);
      return this;
    }
  }, {
    key: "errorChecker",
    value: function errorChecker(errors) {
      var _this2 = this;

      if (errors.length) {
        errors.forEach(function (error) {
          // error properties might not be defined if some foreign
          // (unhandled error not thrown by docxtemplater willingly) is
          // thrown.
          error.properties = error.properties || {};
          error.properties.file = _this2.filePath;
        });
        this.modules.forEach(function (module) {
          errors = module.errorsTransformer(errors);
        });
      }
    }
  }, {
    key: "baseNullGetter",
    value: function baseNullGetter(part, sm) {
      var _this3 = this;

      var value = this.modules.reduce(function (value, module) {
        if (value != null) {
          return value;
        }

        return module.nullGetter(part, sm, _this3);
      }, null);

      if (value != null) {
        return value;
      }

      return this.nullGetter(part, sm);
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      return {
        compiled: this.postparsed,
        cachedParsers: this.cachedParsers,
        tags: this.tags,
        modules: this.modules,
        parser: this.parser,
        contentType: this.contentType,
        baseNullGetter: this.baseNullGetter.bind(this),
        filePath: this.filePath,
        fileTypeConfig: this.fileTypeConfig,
        linebreaks: this.linebreaks
      };
    }
  }, {
    key: "render",
    value: function render(to) {
      this.filePath = to;
      var options = this.getOptions();
      options.resolved = this.scopeManager.resolved;
      options.scopeManager = this.scopeManager;
      options.render = _render;
      options.joinUncorrupt = joinUncorrupt;

      var _render2 = _render(options),
          errors = _render2.errors,
          parts = _render2.parts;

      this.allErrors = errors;
      this.errorChecker(errors);

      if (errors.length > 0) {
        return this;
      }

      this.content = postrender(parts, options);
      this.setModules({
        inspect: {
          content: this.content
        }
      });
      return this;
    }
  }]);

  return XmlTemplater;
}();