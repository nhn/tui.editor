/**
 * @fileoverview Implements Scroll Follow Extension ScrollSync Module
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


const SCROLL_TOP_PADDING = 20;

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
class ScrollSync {
    constructor(sectionManager, cm, $previewContainerEl) {
        this.sectionManager = sectionManager;
        this.cm = cm;
        this.$previewContainerEl = $previewContainerEl;
        this.$contents = this.$previewContainerEl.find('.tui-editor-contents');

        /**
         * current timeout id needs animation
         * @type {number}
         */
        this._currentTimeoutId = null;

        /**
         * Saved scrollInfo object of codemirror
         * @type {object}
         */
        this._savedScrollInfo = null;
    }

    /**
     * _getEditorSectionHeight
     * get section height of editor
     * @param {object} section section be caculated height
     * @returns {number} height
     */
    _getEditorSectionHeight(section) {
        let height = this.cm.heightAtLine(section.end, 'local');
        height -= this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');

        return height;
    }

    /**
     * _getLineHeightGapInSection
     * get height gap between passed line in passed section
     * @param {object} section section be caculated
     * @param {number} line line number
     * @returns {number} gap
     */
    _getEditorLineHeightGapInSection(section, line) {
        let gap = this.cm.heightAtLine(line, 'local');
        gap -= this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');

        return Math.max(gap, 0);
    }

    /**
     * _getSectionScrollRatio
     * get ratio of height between scrollTop line and scrollTop section
     * @param {object} section section be caculated
     * @param {number} line line number
     * @returns {number} ratio
     */
    _getEditorSectionScrollRatio(section, line) {
        const isOneLine = (section.end === section.start);
        let ratio;

        if (isOneLine) {
            ratio = 0;
        } else {
            ratio = this._getEditorLineHeightGapInSection(section, line) / this._getEditorSectionHeight(section);
        }

        return ratio;
    }

    /**
     * _getScrollFactorsOfEditor
     * get Scroll Information of editor for preivew scroll sync
     * @returns {object} scroll factors
     */
    _getScrollFactorsOfEditor() {
        const cm = this.cm;
        let scrollInfo = cm.getScrollInfo();
        let topLine, topSection, ratio, factors;

        //if codemirror has not visible scrollInfo have incorrect value
        //so we use saved scroll info for alternative
        scrollInfo = this._fallbackScrollInfoIfIncorrect(scrollInfo);

        const isEditorBottom = (scrollInfo.height - scrollInfo.top) <= scrollInfo.clientHeight;

        if (isEditorBottom) {
            factors = {
                isEditorBottom
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
    }

    /**
     * _getScrollTopForPreview
     * get ScrolTop value for preview
     * @returns {number|undefined} scrollTop value, when something wrong then return undefined
     */
    _getScrollTopForPreview() {
        let scrollTop;

        const scrollFactors = this._getScrollFactorsOfEditor();
        const section = scrollFactors.section;
        const ratio = scrollFactors.sectionRatio;

        if (scrollFactors.isEditorBottom) {
            scrollTop = this.$contents.height();
        } else if (section.$previewSectionEl) {
            scrollTop = section.$previewSectionEl[0].offsetTop;
            scrollTop += (section.$previewSectionEl.height() * ratio) - SCROLL_TOP_PADDING;
        }

        scrollTop = scrollTop && Math.max(scrollTop, 0);

        return scrollTop;
    }

    /**
     * syncToPreview
     * sync preview with markdown scroll
     */
    syncToPreview() {
        const self = this,
            targetScrollTop = this._getScrollTopForPreview();

        this._animateRun(this.$previewContainerEl.scrollTop(), targetScrollTop, deltaScrollTop => {
            self.$previewContainerEl.scrollTop(deltaScrollTop);
        });
    }

    /**
     * _animateRun
     * animate with passed Callback
     * @param {number} originValue original value
     * @param {number} targetValue target value
     * @param {function} stepCB callback function
     */
    _animateRun(originValue, targetValue, stepCB) {
        const valueDiff = targetValue - originValue,
            startTime = Date.now(),
            self = this;

        //if already doing animation
        if (this._currentTimeoutId) {
            clearTimeout(this._currentTimeoutId);
        }

        /**
         * Each animation step
         */
        function step() {
            const stepTime = Date.now();
            const progress = (stepTime - startTime) / 200; //200 is animation time
            let deltaValue;

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
    }

    /**
     * Fallback to saved scrolInfo if incorrect scrollInfo passed
     * this because incorrect codemirror returns scrollInfo if codemirror is invisible
     * @param {object} scrollInfo scrollInfo
     * @returns {object} scrollInfo
     */
    _fallbackScrollInfoIfIncorrect(scrollInfo) {
        return scrollInfo.height < 0 && this._savedScrollInfo ? this._savedScrollInfo : scrollInfo;
    }

    /**
     * Save Codemirror's scrollInfo for alternative use
     */
    saveScrollInfo() {
        this._savedScrollInfo = this.cm.getScrollInfo();
    }
}
module.exports = ScrollSync;
