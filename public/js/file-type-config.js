"use strict";

var loopModule = require("./modules/loop");

var spacePreserveModule = require("./modules/space-preserve");

var rawXmlModule = require("./modules/rawxml");

var expandPairTrait = require("./modules/expand-pair-trait");

var render = require("./modules/render");

function PptXFileTypeConfig() {
  return {
    getTemplatedFiles: function getTemplatedFiles(zip) {
      var slideTemplates = zip.file(/ppt\/(slideMasters)\/(slideMaster)\d+\.xml/).map(function (file) {
        return file.name;
      });
      return slideTemplates.concat(["ppt/presentation.xml", "docProps/app.xml", "docProps/core.xml"]);
    },
    textPath: function textPath() {
      return "ppt/slides/slide1.xml";
    },
    tagsXmlTextArray: ["Company", "HyperlinkBase", "Manager", "cp:category", "cp:keywords", "dc:creator", "dc:description", "dc:subject", "dc:title", "a:t", "m:t", "vt:lpstr"],
    tagsXmlLexedArray: ["p:sp", "a:tc", "a:tr", "a:table", "a:p", "a:r", "a:rPr", "p:txBody", "a:txBody"],
    expandTags: [{
      contains: "a:tc",
      expand: "a:tr"
    }],
    onParagraphLoop: [{
      contains: "a:p",
      expand: "a:p",
      onlyTextInTag: true
    }],
    tagRawXml: "p:sp",
    tagTextXml: "a:t",
    baseModules: [loopModule, expandPairTrait, rawXmlModule, render],
    tagShouldContain: [{
      tag: "p:txBody",
      shouldContain: ["a:p"],
      value: "<a:p></a:p>"
    }, {
      tag: "a:txBody",
      shouldContain: ["a:p"],
      value: "<a:p></a:p>"
    }]
  };
}

function DocXFileTypeConfig() {
  return {
    getTemplatedFiles: function getTemplatedFiles(zip) {
      var baseTags = ["docProps/core.xml", "docProps/app.xml", "word/settings.xml"];
      var headerFooters = zip.file(/word\/(header|footer)\d+\.xml/).map(function (file) {
        return file.name;
      });
      return headerFooters.concat(baseTags);
    },
    textPath: function textPath(doc) {
      return doc.targets[0];
    },
    tagsXmlTextArray: ["Company", "HyperlinkBase", "Manager", "cp:category", "cp:keywords", "dc:creator", "dc:description", "dc:subject", "dc:title", "w:t", "m:t", "vt:lpstr"],
    tagsXmlLexedArray: ["w:proofState", "w:tc", "w:tr", "w:table", "w:p", "w:r", "w:br", "w:rPr", "w:pPr", "w:spacing", "w:sdtContent", "w:sectPr", "w:headerReference", "w:footerReference"],
    expandTags: [{
      contains: "w:tc",
      expand: "w:tr"
    }],
    onParagraphLoop: [{
      contains: "w:p",
      expand: "w:p",
      onlyTextInTag: true
    }],
    tagRawXml: "w:p",
    tagTextXml: "w:t",
    baseModules: [loopModule, spacePreserveModule, expandPairTrait, rawXmlModule, render],
    tagShouldContain: [{
      tag: "w:tc",
      shouldContain: ["w:p"],
      value: "<w:p></w:p>"
    }, {
      tag: "w:sdtContent",
      shouldContain: ["w:p", "w:r"],
      value: "<w:p></w:p>"
    }]
  };
}

module.exports = {
  docx: DocXFileTypeConfig,
  pptx: PptXFileTypeConfig
};