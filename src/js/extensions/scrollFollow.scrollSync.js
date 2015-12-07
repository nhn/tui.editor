/**
 * @fileoverview Implements Scroll Follow Extension ScrollSync Module
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var SCROLL_TOP_PADDING = 20;

/**
 * ScrollSync
 * manage scroll sync between markdown editor and preview
 * @exports ScrollSync
 * @constructor
 * @class
 * @param {SectionManager} sectionManager sectionManager
 * @param {CodeMirror} cm codemirror
 * @param {jQuery} $previewContainerEl preview container
 */
function ScrollSync(sectionManager, cm, $previewContainerEl) {
    this.sectionManager = sectionManager;
    this.cm = cm;
    this.$previewContainerEl = $previewContainerEl;
    this.$contents = this.$previewContainerEl.find('.tui-editor-contents');

    /**
     * current timeout id needs animation
     * @type {number}
     */
    this._currentTimeoutId = null;
}

/**
 * _getEditorSectionHeight
 * get section height of editor
 * @param {object} section section be caculated height
 * @return {number} height
 */
ScrollSync.prototype._getEditorSectionHeight = function(section) {
    return this.cm.heightAtLine(section.end, 'local') - this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');
};

/**
 * _getLineHeightGapInSection
 * get height gap between passed line in passed section
 * @param {object} section section be caculated
 * @param {number} line line number
 * @return {number} gap
 */
ScrollSync.prototype._getEditorLineHeightGapInSection = function(section, line) {
    var gap = this.cm.heightAtLine(line, 'local') - this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');
    return Math.max(gap, 0);
};

/**
 * _getSectionScrollRatio
 * get ratio of height between scrollTop line and scrollTop section
 * @param {object} section section be caculated
 * @param {number} line line number
 * @return {number} ratio
 */
ScrollSync.prototype._getEditorSectionScrollRatio = function(section, line) {
    var ratio,
        isOneLine = (section.end === section.start);

    if (isOneLine) {
        ratio = 0;
    } else {
        ratio = this._getEditorLineHeightGapInSection(section, line) / this._getEditorSectionHeight(section);
    }
    return ratio;
};

/**
 * _getScrollFactorsOfEditor
 * get Scroll Information of editor for preivew scroll sync
 * @return {object} scroll factors
 */
ScrollSync.prototype._getScrollFactorsOfEditor = function() {
    var topLine, topSection, ratio, isEditorBottom, factors,
        cm = this.cm,
        scrollInfo = cm.getScrollInfo();

    isEditorBottom = (scrollInfo.height - scrollInfo.top) <= scrollInfo.clientHeight;

    if (isEditorBottom) {
        factors = {
            isEditorBottom : isEditorBottom
        };
    } else {
        topLine = cm.coordsChar({
            left: scrollInfo.left,
            top: scrollInfo.top
        }, 'local').line;

        topSection = this.sectionManager.sectionByLine(topLine);

        ratio = this._getEditorSectionScrollRatio(topSection, topLine);

        factors = {
            section: topSection,
            sectionRatio: ratio
        };
    }

    return factors;
};

/**
 * _getScrollTopForPreview
 * get ScrolTop value for preview
 * @return {number|undefined} scrollTop value, when something wrong then return undefined
 */
ScrollSync.prototype._getScrollTopForPreview = function() {
    var scrollTop, scrollFactors, section, ratio;

    scrollFactors = this._getScrollFactorsOfEditor();
    section = scrollFactors.section,
    ratio = scrollFactors.sectionRatio;

    if (scrollFactors.isEditorBottom) {
        scrollTop = this.$contents.height();
    } else if (section.$previewSectionEl) {
        scrollTop = section.$previewSectionEl[0].offsetTop + (section.$previewSectionEl.height() * ratio) - SCROLL_TOP_PADDING;
    }

    scrollTop = scrollTop && Math.max(scrollTop, 0);

    return scrollTop;
};


/**
 * syncToPreview
 * sync preview with markdown scroll
 */
ScrollSync.prototype.syncToPreview = function() {
    var self = this,
        targetScrollTop = this._getScrollTopForPreview();

    this._animateRun(this.$previewContainerEl.scrollTop(), targetScrollTop, function(deltaScrollTop) {
        self.$previewContainerEl.scrollTop(deltaScrollTop);
    });
};

/**
 * _animateRun
 * animate with passed Callback
 * @param {number} originValue original value
 * @param {number} targetValue target value
 * @param {function} stepCB callback function
 */
ScrollSync.prototype._animateRun = function(originValue, targetValue, stepCB) {
    var valueDiff = targetValue - originValue,
        startTime = Date.now(),
        self = this;

    //if already doing animation
    if (this._currentTimeoutId) {
        clearTimeout(this._currentTimeoutId);
    }

    function step() {
        var deltaValue,
            stepTime = Date.now(),
            progress = (stepTime - startTime) / 200; //200 is animation time

        if (progress < 1) {
            deltaValue = originValue + valueDiff * Math.cos((1 - progress) * Math.PI / 2);
            stepCB(Math.ceil(deltaValue));
            self._currentTimeoutId = setTimeout(step, 1);
        } else {
            stepCB(targetValue);
            self._currentTimeoutId = null;
        }
    }

    step();
};

module.exports = ScrollSync;
