/**
 * @fileoverview Implements Scroll Follow Extension SectionManager Module
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

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
    this.$previewContent = preview.$el.find('.previewContent');

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
}

/**
 * getSectionList
 * return section list
 * @return {object[]} section object list
 */
SectionManager.prototype.getSectionList = function() {
    return this._sectionList;
};

/**
 * _makeSectionData
 * make default section object
 * @param {number} start initial start line number
 * @param {number} end initial end line number
 * @return {object} section object
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
    var type, state, i;

    for (i = 0; i < this.cm.getDoc().lineCount(); i+=1) {
        state = this.cm.getStateAfter(i);

        if (this.cm.getLine(i) && state.base.header) {
            type = 'header';
        } else {
            type = 'etc';
        }

        iteratee(type, i);
    }
};

/**
 * makeSectionList
 * make section list
 */
SectionManager.prototype.makeSectionList = function() {
    var self = this;

    this._sectionList = [];

    this._eachLineState(function(type, lineNumber) {
        if (lineNumber === 0 || type === 'header') {
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

    if (!this._sectionList) {
        return;
    }

    sections = this._getPreviewSections();
    this._matchPreviewSectionsWithSectionlist(sections);
};

/**
 * _matchPreviewSectionsWithSectionlist
 * match section list with preview section element
 * @param {HTMLNode[]} sections section nodes
 */
SectionManager.prototype._matchPreviewSectionsWithSectionlist = function(sections) {
    var self = this;

    sections.forEach(function(childs, index) {
        var $sectionDiv = $('<div class="content-id-'+ index + '"></div>');

        if (self._sectionList[index]) {
            self._sectionList[index].$previewSectionEl = $(childs).wrapAll($sectionDiv).parent();
        }
    });
};

/**
 * _getPreviewSections
 * get preview html section group to make section
 * @return {array[]} element node array
 */
SectionManager.prototype._getPreviewSections = function() {
    var sections = [];

    sections[0] = [];

    this.$previewContent.contents().filter(function() {
        return this.nodeType === Node.ELEMENT_NODE;
    }).each(function(index, el) {
        if (el.tagName.match(/H1|H2|H3|H4|H5|H6/)) {
            if (sections[sections.length - 1].length) {
                sections.push([]);
            }
        }

        sections[sections.length - 1].push(el);
    });

    return sections;
};

/**
 * _sectionByLine
 * get section by markdown line
 * @param {number} line markdown editor line number
 * @return {object} section
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
