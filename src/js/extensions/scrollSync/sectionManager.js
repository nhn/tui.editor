/**
* @fileoverview Implements Scroll Sync Extension SectionManager Module
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';

const FIND_HEADER_RX = /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/;
const FIND_LIST_RX = /^ *(\*|-|\d+\.|[*-] \[[ xX]])\s/;
const FIND_QUOTE_RX = /^ {0,3}(> ?)+\s/;
const FIND_IMAGE_RX = /^ {0,3}!\[([^[\]]*)]\(([^)]*)\)/;
const FIND_SETEXT_HEADER_RX = /^ *(?:={1,}|-{1,})\s*$/;
const FIND_CODEBLOCK_END_RX = /^ *(`{3,}|~{3,})[ ]*$/;
const FIND_CODEBLOCK_START_RX = /^ *(`{3,}|~{3,})[ .]*(\S+)? */;
const FIND_SPACE = /\s/g;

/**
 * Class SectionManager
 * manage logical markdown content sections
 */
class SectionManager {
  /**
   * Creates an instance of SectionManager.
   * @param {CodeMirror} cm - codemirror
   * @param {Preview} preview - preview
   * @memberof SectionManager
   */
  constructor(cm, preview) {
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
   * @private
   */
  _addNewSection(start, end) {
    const newSection = this._makeSectionData(start, end);
    this._sectionList.push(newSection);
    this._currentSection = newSection;
  }

  /**
   * getSectionList
   * return section list
   * @returns {object[]} section object list
   */
  getSectionList() {
    if (!this._sectionList) {
      this.makeSectionList();
    }

    return this._sectionList;
  }

  /**
   * _makeSectionData
   * make default section object
   * @param {number} start initial start line number
   * @param {number} end initial end line number
   * @returns {object} section object
   * @private
   */
  _makeSectionData(start, end) {
    return {
      start,
      end,
      $previewSectionEl: null
    };
  }

  /**
   * _updateCurrentSectionEnd
   * update current section's end line number
   * @param {number} end end value to update
   * @private
   */
  _updateCurrentSectionEnd(end) {
    this._currentSection.end = end;
  }

  /**
   * _eachLineState
   * iterate codemiror lines, callback function parameter pass line type and line number
   * @param {function} iteratee callback function
   * @private
   */
  _eachLineState(iteratee) {
    let isSection, i, lineString, nextLineString, prevLineString,
      isTrimming = true,
      onTable = false,
      onCodeBlock = false,
      trimCapture = '';
    let isRightAfterImageSection = false;
    let isEnsuredSection = false;
    let codeblockStartLineIndex;

    const lineLength = this.cm.getDoc().lineCount();

    for (i = 0; i < lineLength; i += 1) {
      isSection = false;
      lineString = this.cm.getLine(i);
      nextLineString = this.cm.getLine(i + 1) || '';
      prevLineString = this.cm.getLine(i - 1) || '';
      const isCodeBlockEnded = this._isCodeBlockEnd(prevLineString) && (codeblockStartLineIndex !== (i - 1));

      if (onTable && (!lineString || !this._isTableCode(lineString))) {
        onTable = false;
      } else if (!onTable && this._isTable(lineString, nextLineString)) {
        onTable = true;
      }

      if (onCodeBlock && isCodeBlockEnded) {
        onCodeBlock = false;
      }
      if (!onCodeBlock && this._isCodeBlockStart(lineString)) {
        onCodeBlock = this._doFollowedLinesHaveCodeBlockEnd(i, lineLength);
        codeblockStartLineIndex = i;
      }

      if (isEnsuredSection && lineString.length !== 0) {
        if (this._isIndependentImage(onCodeBlock, onTable, lineString, prevLineString)) {
          isRightAfterImageSection = true;
          isEnsuredSection = true;
        } else {
          isRightAfterImageSection = false;
          isEnsuredSection = false;
        }

        isSection = true;
      } else if (this._isAtxHeader(lineString)) {
        isRightAfterImageSection = false;
        isSection = true;
        isEnsuredSection = false;
        // setext header
      } else if (!this._isCodeBlockEnd(lineString)
                && !onTable
                && this._isSeTextHeader(lineString, nextLineString)
      ) {
        isRightAfterImageSection = false;
        isSection = true;
        isEnsuredSection = false;
      } else if (this._isIndependentImage(onCodeBlock, onTable, lineString, prevLineString)) {
        isRightAfterImageSection = true;
        isSection = true;
        isEnsuredSection = false;
      } else if (isRightAfterImageSection && lineString.length === 0) {
        isRightAfterImageSection = false;
        isEnsuredSection = true;
      }

      // resolve wrong number of sections mismatch compare to preview
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
  }

  /**
   * Return whether is independent image line with padding lines top and bottom
   * @param {boolean} onCodeBlock Is on codeblock
   * @param {boolean} onTable Is on table
   * @param {string} lineString Current line string
   * @param {string} prevLineString Previous line string
   * @returns {boolean}
   * @private
   */
  _isIndependentImage(onCodeBlock, onTable, lineString, prevLineString) {
    return !onCodeBlock && !onTable
            && this._isImage(lineString) && !this._isList(lineString) && !this._isQuote(lineString)
            && prevLineString.length === 0;
  }

  /**
   * _doFollowedLinesHaveCodeBlockEnd
   * Check if follow lines have codeblock end
   * @param {number} lineIndex current index
   * @param {number} lineLength line length
   * @returns {boolean} result
   * @private
   */
  _doFollowedLinesHaveCodeBlockEnd(lineIndex, lineLength) {
    let doLineHaveCodeBlockEnd = false;

    for (let i = lineIndex + 1; i < lineLength; i += 1) {
      if (this._isCodeBlockEnd(this.cm.getLine(i))) {
        doLineHaveCodeBlockEnd = true;
        break;
      }
    }

    return doLineHaveCodeBlockEnd;
  }

  /**
   * _isCodeBlockStart
   * Check if passed string have code block start
   * @param {string} string string to check
   * @returns {boolean} result
   * @private
   */
  _isCodeBlockStart(string) {
    return FIND_CODEBLOCK_START_RX.test(string);
  }

  /**
   * _isCodeBlockEnd
   * Check if passed string have code block end
   * @param {string} string string to check
   * @returns {boolean} result
   * @private
   */
  _isCodeBlockEnd(string) {
    return FIND_CODEBLOCK_END_RX.test(string);
  }

  /**
   * _isTable
   * Check if passed string have table
   * @param {string} lineString current line string
   * @param {string} nextLineString next line string
   * @returns {boolean} result
   * @private
   */
  _isTable(lineString, nextLineString) {
    return (this._isTableCode(lineString) && this._isTableAligner(nextLineString));
  }

  /**
   * _isTableCode
   * Check if passed string have table code
   * @param {string} string string to check
   * @returns {boolean} result
   * @private
   */
  _isTableCode(string) {
    return /(^\S?.*\|.*)/.test(string);
  }

  /**
   * _isTableAligner
   * Check if passed string have table align code
   * @param {string} string string to check
   * @returns {boolean} result
   * @private
   */
  _isTableAligner(string) {
    return /(\s*[-:]+\s*\|)+/.test(string);
  }

  /**
   * _isAtxHeader
   * Check if passed string have atx header
   * @param {string} string string to check
   * @returns {boolean} result
   * @private
   */
  _isAtxHeader(string) {
    return FIND_HEADER_RX.test(string);
  }

  /**
   * _isSeTextHeader
   * @param {string} lineString current line string
   * @param {string} nextLineString next line string
   * @returns {boolean} result
   * @private
   */
  _isSeTextHeader(lineString, nextLineString) {
    return lineString.replace(FIND_SPACE, '') !== ''
            && nextLineString
            && FIND_SETEXT_HEADER_RX.test(nextLineString);
  }

  _isImage(lineString) {
    return FIND_IMAGE_RX.test(lineString);
  }

  _isList(lineString) {
    return FIND_LIST_RX.test(lineString);
  }

  _isQuote(lineString) {
    return FIND_QUOTE_RX.test(lineString);
  }

  /**
   * makeSectionList
   * make section list
   */
  makeSectionList() {
    this._sectionList = [];

    this._eachLineState((isSection, lineNumber) => {
      if (isSection || !this._sectionList.length) {
        this._addNewSection(lineNumber, lineNumber);
      } else {
        this._updateCurrentSectionEnd(lineNumber);
      }
    });
  }

  /**
   * sectionMatch
   * make preview sections then match section list with preview section element
   */
  sectionMatch() {
    if (this.getSectionList()) {
      const sections = this._getPreviewSections();
      this._matchPreviewSectionsWithSectionlist(sections);
    }
  }

  /**
   * _matchPreviewSectionsWithSectionlist
   * match section list with preview section element
   * @param {HTMLNode[]} sections section nodes
   * @private
   */
  _matchPreviewSectionsWithSectionlist(sections) {
    const sectionList = this.getSectionList();
    sections.forEach((childs, index) => {
      const section = sectionList[index];
      if (section) {
        const $sectionDiv = $(`<div class='content-id-${index}'></div>`);
        section.$previewSectionEl = $(childs).wrapAll($sectionDiv).parent();
      }
    });
  }

  /**
   * _getPreviewSections
   * get preview html section group to make section
   * @returns {array[]} element node array
   * @private
   */
  _getPreviewSections() {
    const sections = [];
    let lastSection = 0;
    let isRightAfterImageSection = false;

    sections[0] = [];

    this.$previewContent.contents().filter(findElementNodeFilter).each((index, el) => {
      const isParagraph = (el.tagName === 'P');
      const isHeading = el.tagName.match(/^(H1|H2|H3|H4|H5|H6)$/);
      const isImage = (isParagraph && el.childNodes[0].nodeName === 'IMG');

      if ((isHeading || isImage || isRightAfterImageSection)
                && sections[lastSection].length
      ) {
        sections.push([]);
        lastSection += 1;
        isRightAfterImageSection = false;
      }

      if (isImage) {
        isRightAfterImageSection = true;
      }

      sections[lastSection].push(el);
    });

    return sections;
  }

  /**
   * _sectionByLine
   * get section by markdown line
   * @param {number} line markdown editor line number
   * @returns {object} section
   */
  sectionByLine(line) {
    let sectionIndex;
    const sectionList = this.getSectionList();
    const sectionLength = sectionList.length;

    for (sectionIndex = 0; sectionIndex < sectionLength; sectionIndex += 1) {
      if (line <= sectionList[sectionIndex].end) {
        break;
      }
    }

    if (sectionIndex === sectionLength) {
      sectionIndex = sectionLength - 1;
    }

    return sectionList[sectionIndex];
  }
}

/**
 * findElementNodeFilter
 * @this Node
 * @returns {boolean} true or not
 * @ignore
 */
function findElementNodeFilter() {
  return this.nodeType === Node.ELEMENT_NODE;
}

export default SectionManager;
