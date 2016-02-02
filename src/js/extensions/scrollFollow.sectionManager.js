/**
 * @fileoverview Implements Scroll Follow Extension SectionManager Module
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var FIND_HEADER_RX = /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/,
    FIND_SETEXT_HEADER_RX = /^ *(?:\={1,}|-{1,})\s*$/,
    FIND_CODEBLOCK_END_RX = /^ *(`{3,}|~{3,})[ ]*$/,
    FIND_CODEBLOCK_START_RX = /^ *(`{3,}|~{3,})[ \.]*(\S+)? */,
    FIND_SPACE = /\s/g;

/*
 * SectionManager
 * manage logical markdown content sections
 * @exports SectionManager
 * @constructor
 * @class
 * @param {CodeMirror} cm codemirror
 * @param {Preview} preview preview
 */
function SectionManager(cm, preview) {
    this.cm = cm;
    this.preview = preview;
    this.$previewContent = preview.$el.find('.tui-editor-contents');

    /**
     *  section list
     * @type {object[]}
     */
    this._sectionList = null;

    /**
     * current working section needs making section list
     * @type {object}
     */
    this._currentSection = null;
}

/**
 * _addNewSection
 * add new section
 * @param {number} start initial start line number
 * @param {number} end initial end line number
 */
SectionManager.prototype._addNewSection = function(start, end) {
    var newSection = this._makeSectionData(start, end);
    this._sectionList.push(newSection);
    this._currentSection = newSection;
};

/**
 * getSectionList
 * return section list
 * @returns {object[]} section object list
 */
SectionManager.prototype.getSectionList = function() {
    return this._sectionList;
};

/**
 * _makeSectionData
 * make default section object
 * @param {number} start initial start line number
 * @param {number} end initial end line number
 * @returns {object} section object
 */
SectionManager.prototype._makeSectionData = function(start, end) {
    return {
        start: start,
        end: end,
        $previewSectionEl: null
    };
};

/**
 * _updateCurrentSectionEnd
 * update current section's end line number
 * @param {number} end end value to update
 */
SectionManager.prototype._updateCurrentSectionEnd = function(end) {
    this._currentSection.end = end;
};

/**
 * _eachLineState
 * iterate codemiror lines, callback function parameter pass line type and line number
 * @param {function} iteratee callback function
 */
SectionManager.prototype._eachLineState = function(iteratee) {
    var isSection, i, lineLength, lineString, nextLineString, prevLineString,
        isTrimming = true,
        onTable = false,
        onCodeBlock = false,
        trimCapture = '';

    lineLength = this.cm.getDoc().lineCount();

    for (i = 0; i < lineLength; i+=1) {
        isSection = false;
        lineString = this.cm.getLine(i);
        nextLineString = this.cm.getLine(i+1) || '';
        prevLineString = this.cm.getLine(i-1) || '';

        if (onTable && (!lineString || !this._isTableCode(lineString))) {
            onTable = false;
        } else if (!onTable && this._isTable(lineString, nextLineString)) {
            onTable = true;
        }

        if (onCodeBlock && this._isCodeBlockEnd(prevLineString)) {
            onCodeBlock = false;
        } else if (!onCodeBlock && this._isCodeBlockStart(lineString)) {
            onCodeBlock = this._doFollowedLinesHaveCodeBlockEnd(i, lineLength);
        }

        //atx header
        if (this._isAtxHeader(lineString)) {
            isSection = true;
        //setext header
        } else if (!onCodeBlock && !onTable && this._isSeTextHeader(lineString, nextLineString)) {
            isSection = true;
        }

        //빈공간으로 시작되다다가 헤더를 만난경우 섹션은 두개가 생성되는데
        //프리뷰에서는 빈공간이 트리밍되어 섹션 한개 밖에 생성되지 않아 매칭이 되지 않는 문제 해결
        if (isTrimming) {
            trimCapture += lineString.trim();

            if (trimCapture) {
                isTrimming = false;
            } else {
                continue;
            }
        }

        iteratee(isSection, i);
    }
};

/**
 * _doFollowedLinesHaveCodeBlockEnd
 * Check if follow lines have codeblock end
 * @param {number} lineIndex current index
 * @param {number} lineLength line length
 * @returns {boolean} result
 */
SectionManager.prototype._doFollowedLinesHaveCodeBlockEnd = function(lineIndex, lineLength) {
    var i,
        doLineHaveCodeBlockEnd = false;

    for (i = lineIndex + 1; i < lineLength; i+=1) {
        if (this._isCodeBlockEnd(this.cm.getLine(i))) {
            doLineHaveCodeBlockEnd = true;
            break;
        }
    }

    return doLineHaveCodeBlockEnd;
};

/**
 * _isCodeBlockStart
 * Check if passed string have code block start
 * @param {string} string string to check
 * @returns {boolean} result
 */
SectionManager.prototype._isCodeBlockStart = function(string) {
    return FIND_CODEBLOCK_START_RX.test(string);
};

/**
 * _isCodeBlockEnd
 * Check if passed string have code block end
 * @param {string} string string to check
 * @returns {boolean} result
 */
SectionManager.prototype._isCodeBlockEnd = function(string) {
    return FIND_CODEBLOCK_END_RX.test(string);
};

/**
 * _isTable
 * Check if passed string have table
 * @param {string} lineString current line string
 * @param {string} nextLineString next line string
 * @returns {boolean} result
 */
SectionManager.prototype._isTable = function(lineString, nextLineString) {
    return (this._isTableCode(lineString) && this._isTableAligner(nextLineString));
};

/**
 * _isTableCode
 * Check if passed string have table code
 * @param {string} string string to check
 * @returns {boolean} result
 */
SectionManager.prototype._isTableCode = function(string) {
    return /(^\S?.*\|.*)/.test(string);
};

/**
 * _isTableAligner
 * Check if passed string have table align code
 * @param {string} string string to check
 * @returns {boolean} result
 */
SectionManager.prototype._isTableAligner = function(string) {
    return /(\s*[-:]+\s*\|)+/.test(string);
};

/**
 * _isAtxHeader
 * Check if passed string have atx header
 * @param {string} string string to check
 * @returns {boolean} result
 */
SectionManager.prototype._isAtxHeader = function(string) {
    return FIND_HEADER_RX.test(string);
};

/**
 * _isSeTextHeader
 * @param {string} lineString current line string
 * @param {string} nextLineString next line string
 * @returns {boolean} result
 */
SectionManager.prototype._isSeTextHeader = function(lineString, nextLineString) {
    return lineString.replace(FIND_SPACE, '') !== '' && nextLineString && FIND_SETEXT_HEADER_RX.test(nextLineString);
};

/**
 * makeSectionList
 * make section list
 */
SectionManager.prototype.makeSectionList = function() {
    var self = this;

    this._sectionList = [];

    this._eachLineState(function(isSection, lineNumber) {
        if (isSection || !self._sectionList.length) {
            self._addNewSection(lineNumber, lineNumber);
        } else {
            self._updateCurrentSectionEnd(lineNumber);
        }
    });
};


/**
 * sectionMatch
 * make preview sections then match section list with preview section element
 */
SectionManager.prototype.sectionMatch = function() {
    var sections;

    if (this._sectionList) {
        sections = this._getPreviewSections();
        this._matchPreviewSectionsWithSectionlist(sections);
    }
};

/**
 * _matchPreviewSectionsWithSectionlist
 * match section list with preview section element
 * @param {HTMLNode[]} sections section nodes
 */
SectionManager.prototype._matchPreviewSectionsWithSectionlist = function(sections) {
    var self = this;

    sections.forEach(function(childs, index) {
        var $sectionDiv;

        if (self._sectionList[index]) {
            $sectionDiv = $('<div class="content-id-'+ index + '"></div>');
            self._sectionList[index].$previewSectionEl = $(childs).wrapAll($sectionDiv).parent();
        }
    });
};

/**
 * findElementNodeFilter
 * @this Node
 * @returns {boolean} true or not
 */
function findElementNodeFilter() {
    return this.nodeType === Node.ELEMENT_NODE;
}

/**
 * _getPreviewSections
 * get preview html section group to make section
 * @returns {array[]} element node array
 */
SectionManager.prototype._getPreviewSections = function() {
    var lastSection = 0,
        sections = [];

    sections[0] = [];

    this.$previewContent.contents().filter(findElementNodeFilter).each(function(index, el) {
        if (el.tagName.match(/H1|H2|H3|H4|H5|H6/)) {
            if (sections[lastSection].length) {
                sections.push([]);
                lastSection += 1;
            }
        }

        sections[lastSection].push(el);
    });

    return sections;
};

/**
 * _sectionByLine
 * get section by markdown line
 * @param {number} line markdown editor line number
 * @returns {object} section
 */
SectionManager.prototype.sectionByLine = function(line) {
    var sectionIndex,
        sectionList = this._sectionList,
        sectionLength = sectionList.length;

    for (sectionIndex = 0; sectionIndex < sectionLength; sectionIndex+=1) {
        if (line <= sectionList[sectionIndex].end) {
            break;
        }
    }

    if (sectionIndex === sectionLength) {
        sectionIndex = sectionLength - 1;
    }

    return sectionList[sectionIndex];
};

module.exports = SectionManager;
