"use strict";

var Lexer = require("../lexer.js");

var _require = require("./utils"),
    expect = _require.expect,
    makeDocx = _require.makeDocx,
    cleanRecursive = _require.cleanRecursive,
    errorVerifier = _require.errorVerifier;

var fixtures = require("./fixtures");

var docxconfig = require("../file-type-config").docx();

var inspectModule = require("../inspect-module.js");

var AssertionModule = require("./assertion-module.js");

var tagsDocxConfig = {
  text: docxconfig.tagsXmlTextArray,
  other: docxconfig.tagsXmlLexedArray
};
describe("Algorithm", function () {
  Object.keys(fixtures).forEach(function (key) {
    var fixture = fixtures[key];
    (fixture.onlySync ? it.only : it)(fixture.it, function () {
      var doc = makeDocx(key, fixture.content);
      doc.setOptions(fixture.options);
      var iModule = inspectModule();
      doc.attachModule(iModule).attachModule(new AssertionModule());
      doc.setData(fixture.scope);

      try {
        doc.compile();
      } catch (error) {
        errorVerifier(error, fixture.errorType, fixture.error);
        return;
      }

      cleanRecursive(iModule.inspect.lexed);
      cleanRecursive(iModule.inspect.parsed);
      cleanRecursive(iModule.inspect.postparsed);

      try {
        doc.render();
      } catch (error) {
        errorVerifier(error, fixture.errorType, fixture.error);
      }

      if (fixture.error) {
        throw new Error("Fixture should have failed but did not fail");
      }

      if (fixture.result !== null) {
        expect(iModule.inspect.content).to.be.deep.equal(fixture.result, "Content incorrect");
      }

      if (fixture.lexed !== null) {
        expect(iModule.inspect.lexed).to.be.deep.equal(fixture.lexed, "Lexed incorrect");
      }

      if (fixture.parsed !== null) {
        expect(iModule.inspect.parsed).to.be.deep.equal(fixture.parsed, "Parsed incorrect");
      }

      if (fixture.postparsed !== null) {
        expect(iModule.inspect.postparsed).to.be.deep.equal(fixture.postparsed, "Postparsed incorrect");
      }
    });
  });
  Object.keys(fixtures).forEach(function (key) {
    var fixture = fixtures[key];
    (fixture.only ? it.only : it)("Async ".concat(fixture.it), function () {
      var doc = makeDocx(key, fixture.content);
      doc.setOptions(fixture.options);
      var iModule = inspectModule();
      doc.attachModule(iModule);

      try {
        doc.compile();
      } catch (error) {
        errorVerifier(error, fixture.errorType, fixture.error);
        return;
      }

      cleanRecursive(iModule.inspect.lexed);
      cleanRecursive(iModule.inspect.parsed);
      cleanRecursive(iModule.inspect.postparsed);
      return doc.resolveData(fixture.scope).then(function () {
        try {
          doc.render();
        } catch (error) {
          errorVerifier(error, fixture.errorType, fixture.error);
        }

        if (fixture.error) {
          throw new Error("Fixture should have failed but did not fail");
        }

        cleanRecursive(iModule.inspect.lexed);
        cleanRecursive(iModule.inspect.parsed);
        cleanRecursive(iModule.inspect.postparsed);

        if (fixture.result !== null) {
          expect(iModule.inspect.content).to.be.deep.equal(fixture.result, "Content incorrect");
        }

        if (fixture.resolved) {
          expect(iModule.inspect.resolved).to.be.deep.equal(fixture.resolved, "Resolved incorrect");
        }

        if (fixture.lexed !== null) {
          expect(iModule.inspect.lexed).to.be.deep.equal(fixture.lexed, "Lexed incorrect");
        }

        if (fixture.parsed !== null) {
          expect(iModule.inspect.parsed).to.be.deep.equal(fixture.parsed, "Parsed incorrect");
        }

        if (fixture.postparsed !== null) {
          expect(iModule.inspect.postparsed).to.be.deep.equal(fixture.postparsed, "Postparsed incorrect");
        }
      });
    });
  });
  it("should xmlparse strange tags", function () {
    var xmllexed = Lexer.xmlparse(fixtures.strangetags.content, tagsDocxConfig);
    cleanRecursive(xmllexed);
    expect(xmllexed).to.be.deep.equal(fixtures.strangetags.xmllexed);
  });
  it("should xmlparse selfclosing tag", function () {
    var xmllexed = Lexer.xmlparse("<w:rPr><w:noProof/></w:rPr>", {
      text: [],
      other: ["w:rPr", "w:noProof"]
    });
    expect(xmllexed).to.be.deep.equal([{
      type: "tag",
      position: "start",
      text: false,
      value: "<w:rPr>",
      tag: "w:rPr"
    }, {
      type: "tag",
      position: "selfclosing",
      text: false,
      value: "<w:noProof/>",
      tag: "w:noProof"
    }, {
      type: "tag",
      position: "end",
      text: false,
      value: "</w:rPr>",
      tag: "w:rPr"
    }]);
  });
});