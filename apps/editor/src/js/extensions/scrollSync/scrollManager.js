/**
* @fileoverview Implements Scroll Sync Extension ScrollManager Module
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import util from 'tui-code-snippet';

const PREVIEW_MARGIN_TOP = 57;
const SCROLL_TOP_PADDING = 20;
const SCROLL_BOCKING_RESET_DELAY = 15;

/**
 * Class ScrollManager
 * manage scroll sync between markdown editor and preview
 */
class ScrollManager {
  /**
   * Creates an instance of ScrollManager.
   * @param {SectionManager} sectionManager - sectionManager
   * @param {CodeMirror} cm - CodeMirror
   * @param {jQuery} $previewContainerEl - preview container
   * @memberof ScrollManager
   */
  constructor(sectionManager, cm, $previewContainerEl) {
    this.sectionManager = sectionManager;
    this.cm = cm;
    this.$previewContainerEl = $previewContainerEl;
    this.$contents = this.$previewContainerEl.find('.tui-editor-contents');
    this.releaseTimer = null;
    /**
     * current timeout id needs animation
     * @type {number}
     */
    this._currentTimeoutId = null;

    /**
     * Saved scrollInfo object of CodeMirror
     * @type {object}
     */
    this._savedScrollInfo = null;
  }

  /**
   * _getEditorSectionHeight
   * Return section height of editor
   * @param {object} section section be calculated height
   * @returns {number} height
   * @private
   */
  _getEditorSectionHeight(section) {
    let height = this.cm.heightAtLine(section.end, 'local');
    height -= this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');

    return height;
  }

  /**
   * _getLineHeightGapInSection
   * Return height gap between passed line in passed section
   * @param {object} section section be calculated
   * @param {number} line line number
   * @returns {number} gap
   * @private
   */
  _getEditorLineHeightGapInSection(section, line) {
    let gap = this.cm.heightAtLine(line, 'local');
    gap -= this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');

    return Math.max(gap, 0);
  }

  /**
   * _getSectionScrollRatio
   * Return ratio of height between scrollTop line and scrollTop section
   * @param {object} section section be calculated
   * @param {number} line line number
   * @returns {number} ratio
   * @private
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
   * Return Scroll Information of editor for preview scroll sync
   * @returns {object} scroll factors
   * @private
   */
  _getScrollFactorsOfEditor() {
    const {cm} = this;
    let scrollInfo = cm.getScrollInfo();
    let topLine, topSection, ratio, factors;

    // if codemirror has not visible scrollInfo have incorrect value
    // so we use saved scroll info for alternative
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
   * Return Scroll Information of editor for Markdown scroll sync
   * @returns {object} scroll factors
   * @private
   */
  _getScrollInfoForMarkdown() {
    const sectionList = this.sectionManager.getSectionList();
    let factors;

    util.forEachArray(sectionList, section => {
      const $div = section.$previewSectionEl;
      const $preview = $div.parent().parent();
      const isPreviewBottom = ($preview[0].clientHeight - $preview.scrollTop()) <= $preview[0].height;
      let needNext = true;

      if (isPreviewBottom) {
        factors = {
          isPreviewBottom
        };
        needNext = false;
      } else if (this._isTopSection($preview, $div)) {
        factors = {
          section,
          sectionRatio: this._getMarkdownEditorScrollRatio($preview, $div)
        };
        needNext = false;
      }

      return needNext;
    });

    return factors;
  }

  /**
   * Return ScrollRatio for Markdown scroll value
   * @param {jQuery} $preview jQuery wrapped preview container
   * @param {jQuery} $div jQuery wrapped section div element
   * @returns {number}
   * @private
   */
  _getMarkdownEditorScrollRatio($preview, $div) {
    return ($preview.scrollTop() - $div[0].offsetTop) / $div.height();
  }

  /**
   * _getScrollTopForPreview
   * Return scrollTop value for preview
   * @returns {number|undefined} scrollTop value, when something wrong then return undefined
   * @private
   */
  _getScrollTopForPreview() {
    let scrollTop;

    const scrollFactors = this._getScrollFactorsOfEditor();
    const {section, sectionRatio} = scrollFactors;

    if (scrollFactors.isEditorBottom) {
      scrollTop = this.$contents.height();
    } else if (section.$previewSectionEl) {
      scrollTop = section.$previewSectionEl[0].offsetTop;
      scrollTop += (section.$previewSectionEl.height() * sectionRatio) - SCROLL_TOP_PADDING;
    }

    scrollTop = scrollTop && Math.max(scrollTop, 0);

    return scrollTop;
  }

  /**
   * Return scrollTop value for Markdown editor
   * @returns {number}
   * @private
   */
  _getScrollTopForMarkdown() {
    let scrollTop;
    const scrollFactors = this._getScrollInfoForMarkdown();
    const ratio = scrollFactors.sectionRatio;

    if (scrollFactors.isPreviewBottom) {
      scrollTop = this.cm.getScrollInfo().height;
    } else if (scrollFactors.section) {
      const {section} = scrollFactors;
      const coordsAtStart = this.cm.charCoords({
        line: section.start,
        char: 0
      }, 'local');
      const coordsAtEnd = this.cm.charCoords({
        line: section.end,
        char: 0
      }, 'local');

      scrollTop = coordsAtStart.top;
      scrollTop += ((coordsAtEnd.top - coordsAtStart.top) * ratio);
    }

    scrollTop = scrollTop && Math.max(scrollTop, 0);

    return scrollTop;
  }

  /**
   * syncPreviewScrollTopToMarkdown
   * sync preview scroll to markdown
   */
  syncPreviewScrollTopToMarkdown() {
    const {$previewContainerEl} = this;
    const sourceScrollTop = $previewContainerEl.scrollTop();
    const targetScrollTop = this._getScrollTopForPreview();

    this.isPreviewScrollEventBlocked = true;

    this._animateRun(sourceScrollTop, targetScrollTop, deltaScrollTop => {
      clearTimeout(this.releaseTimer);

      $previewContainerEl.scrollTop(deltaScrollTop);

      this.releaseTimer = setTimeout(() => {
        this.isPreviewScrollEventBlocked = false;
      }, SCROLL_BOCKING_RESET_DELAY);
    });
  }

  /**
   * syncMarkdownScrollTopToPreview
   * sync markdown scroll to preview
   */
  syncMarkdownScrollTopToPreview() {
    const codeMirror = this.cm;
    const codeMirrorScrollInfo = codeMirror.getScrollInfo();
    const sourceScrollTop = codeMirrorScrollInfo.top;
    const targetScrollTop = this._getScrollTopForMarkdown();

    this.isMarkdownScrollEventBlocked = true;

    this._animateRun(sourceScrollTop, targetScrollTop, deltaScrollTop => {
      clearTimeout(this.releaseTimer);

      codeMirror.scrollTo(0, deltaScrollTop);

      this.releaseTimer = setTimeout(() => {
        this.isMarkdownScrollEventBlocked = false;
      }, SCROLL_BOCKING_RESET_DELAY);
    });
  }

  /**
   * _animateRun
   * animate with passed Callback
   * @param {number} originValue original value
   * @param {number} targetValue target value
   * @param {function} stepCB callback function
   * @private
   */
  _animateRun(originValue, targetValue, stepCB) {
    const valueDiff = targetValue - originValue,
      startTime = Date.now(),
      self = this;

    // if already doing animation
    if (this._currentTimeoutId) {
      clearTimeout(this._currentTimeoutId);
    }

    /**
     * Each animation step
     */
    function step() {
      const stepTime = Date.now();
      const progress = (stepTime - startTime) / 200; // 200 is animation time
      let deltaValue;

      if (progress < 1) {
        deltaValue = originValue + (valueDiff * Math.cos((1 - progress) * Math.PI / 2));
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
   * this because incorrect CodeMirror returns scrollInfo if CodeMirror is invisible
   * @param {object} scrollInfo scrollInfo
   * @returns {object} scrollInfo
   * @private
   */
  _fallbackScrollInfoIfIncorrect(scrollInfo) {
    return scrollInfo.height < 0 && this._savedScrollInfo ? this._savedScrollInfo : scrollInfo;
  }

  /**
   * Save Codemirror's scrollInfo for alternative use
   * memberOf ScrollManager
   */
  saveScrollInfo() {
    this._savedScrollInfo = this.cm.getScrollInfo();
  }

  /**
   * Return whether given range is top section of preview contents or not
   * @param {jQuery} $preview jQuery wrapped preview container
   * @param {jQuery} $div jQuery wrapped section div element
   * @returns {boolean}
   * @private
   */
  _isTopSection($preview, $div) {
    const previewScrollTop = $preview.scrollTop();
    const divOffsetTop = $div[0].offsetTop;
    const divHeight = $div.height();
    const isSectionBegin = previewScrollTop >= (divOffsetTop - PREVIEW_MARGIN_TOP);
    const isSectionEnd = previewScrollTop > (divOffsetTop + divHeight);

    return isSectionBegin && !isSectionEnd;
  }
}

export default ScrollManager;
