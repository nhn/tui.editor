/**
 * @fileoverview Implements wysiwyg list manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import domUtils from './domUtils';

const FIND_LI_ELEMENT = /<li/i;
const DIV_OR_LI = 'DIV,LI';
const UL_OR_OL = 'OL,UL';

/**
 * Class WwListManager
 */
class WwListManager {
  /**
   * Creates an instance of WwListManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwListManager
   */
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwListManager#
     * @type {string}
     */
    this.name = 'list';

    this._init();
  }

  /**
   * _init
   * Initialize
   * @memberof WwListManager
   * @private
   */
  _init() {
    this._initEvent();
    this._initKeyHandler();
  }

  /**
   * _initEvent
   * Initialize event
   * @memberof WwListManager
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygSetValueBefore', html => this._convertToArbitraryNestingList(html));

    this.eventManager.listen('wysiwygRangeChangeAfter', () => {
      this._findAndRemoveEmptyList();
      this._removeBranchListAll();
    });

    this.eventManager.listen('wysiwygSetValueAfter', () => {
      this._removeBranchListAll();
    });

    this.eventManager.listen('wysiwygProcessHTMLText', html => {
      html = this._insertBlankToBetweenSameList(html);
      html = this._convertFromArbitraryNestingList(html);

      return html;
    });

    this.eventManager.listen('convertorAfterHtmlToMarkdownConverted',
      markdown => markdown.replace(/:BLANK_LINE:\n/g, ''));
  }

  _initKeyHandler() {
    this.wwe.addKeyEventHandler('TAB', (ev, range) => {
      let isNeedNext;

      if (range.collapsed) {
        if (this.wwe.getEditor().hasFormat('LI')) {
          ev.preventDefault();
          this.eventManager.emit('command', 'IncreaseDepth');

          isNeedNext = false;
        }
      }

      return isNeedNext;
    });

    this.wwe.addKeyEventHandler('SHIFT+TAB', (ev, range) => {
      let isNeedNext;

      if (range.collapsed) {
        if (this.wwe.getEditor().hasFormat('LI')) {
          ev.preventDefault();
          const $ul = $(range.startContainer).closest('li').children(UL_OR_OL);

          this.eventManager.emit('command', 'DecreaseDepth');

          if ($ul.length && !$ul.prev().length) {
            this._removeBranchList($ul);
          }

          isNeedNext = false;
        }
      }

      return isNeedNext;
    });

    this.wwe.addKeyEventHandler('ENTER', (ev, range) => {
      if (range.collapsed) {
        if (this.wwe.getEditor().hasFormat('LI')) {
          this.wwe.defer(() => {
            const afterRange = this.wwe.getRange();
            const $li = $(afterRange.startContainer).parents('li').eq(0);
            this._removeBranchListAll($li);
          });
        }
      }
    });

    this.wwe.addKeyEventHandler('BACK_SPACE', (ev, range) => {
      if (range.collapsed) {
        if (this.wwe.getEditor().hasFormat('LI')) {
          this.wwe.defer(() => {
            this._removeBranchListAll();
          });
        }
      }
    });
  }

  /**
   * Find empty list for whole container and remove it.
   * @memberof WwListManager
   * @private
   */
  _findAndRemoveEmptyList() {
    this.wwe.get$Body().find(UL_OR_OL).each((index, node) => {
      if (!(FIND_LI_ELEMENT.test(node.innerHTML))) {
        $(node).remove();
      }
    });
  }

  /**
   * Remove branch lists all from body
   * @memberof WwListManager
   * @private
   * @param {jQuery|HTMLElement} $root root to remove branch list
   */
  _removeBranchListAll($root) {
    $root = !$root ? this.wwe.get$Body() : $($root);

    $root.find('li ul, li ol').each((idx, node) => {
      if (!node || node.previousSibling) {
        return;
      }
      this._removeBranchList(node);
    });
  }

  /**
   * Remove branch list of passed list(ul, ol)
   * @memberof WwListManager
   * @param {HTMLElement} list list
   * @private
   */
  _removeBranchList(list) {
    const $list = $(list);
    let $branchRoot = $list;

    while (!$branchRoot[0].previousSibling
               && $branchRoot[0].parentElement.tagName.match(/UL|OL|LI/g)) {
      $branchRoot = $branchRoot.parent();
    }

    const $firstLi = $branchRoot.children('li').eq(0);

    $branchRoot.prepend($list.children().unwrap());

    $firstLi.remove();
  }

  _insertBlankToBetweenSameList(html) {
    return html.replace(/<\/(ul|ol)>(<br \/>|<br>){0,}<\1>/g, '</$1>:BLANK_LINE:<$1>');
  }

  /**
   * make arbitrary nesting list out of standard list
   * `<ul><li>text<ul><li>text2</li></ul></li></ul>` to
   * `<ul><li>text</li><ul><li>text2</li></ul></ul>`
   * @param {string} html string to convert
   * @returns {string} converted HTML text
   * @private
   */
  _convertToArbitraryNestingList(html) {
    const NESTED_LIST_QUERY = 'li > ul, li > ol';
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    let nestedList = wrapper.querySelector(NESTED_LIST_QUERY);
    while (nestedList !== null) {
      const parentLI = nestedList.parentNode;
      const parentList = parentLI.parentNode;

      parentList.insertBefore(nestedList, parentLI.nextElementSibling);

      nestedList = wrapper.querySelector(NESTED_LIST_QUERY);
    }

    return wrapper.innerHTML;
  }

  /**
   * make standard list out of arbitrary nesting list
   * `<ul><li>text<ul><li>text2</li></ul></li></ul>` from
   * `<ul><li>text</li><ul><li>text2</li></ul></ul>`
   * @param {string} html string to convert
   * @returns {string} converted HTML text
   * @private
   */
  _convertFromArbitraryNestingList(html) {
    const NESTED_LIST_QUERY = 'ol > ol, ol > ul, ul > ol, ul > ul';
    const wrapperDiv = document.createElement('div');
    wrapperDiv.innerHTML = html;

    let nestedList = wrapperDiv.querySelector(NESTED_LIST_QUERY);
    while (nestedList !== null) {
      let prevLI = nestedList.previousElementSibling;
      while (prevLI.tagName !== 'LI') {
        prevLI = prevLI.previousElementSibling;
      }

      prevLI.appendChild(nestedList);

      nestedList = wrapperDiv.querySelector(NESTED_LIST_QUERY);
    }

    return wrapperDiv.innerHTML;
  }

  /**
   * Return lines in selection
   * @param {Node} start Start element
   * @param {Node} end End element
   * @param {HTMLElement} body Editor body element
   * @returns {Array.<HTMLElement>}
   * @private
   */
  getLinesOfSelection(start, end) {
    const lines = [];
    let isLastLine = false;
    let needNext = true;
    let nextLine;

    if (domUtils.isTextNode(start)) {
      start = $(start).parents(DIV_OR_LI).first().get(0);
    }

    if (domUtils.isTextNode(end)) {
      end = $(end).parents(DIV_OR_LI).first().get(0);
    }

    for (let line = start; needNext; line = nextLine) {
      if ($(line).is(DIV_OR_LI)) {
        lines.push(line);

        if (line === end) {
          isLastLine = true;
        } else {
          nextLine = this._getNextLine(line, end);
        }
      } else {
        break;
      }
      needNext = nextLine && !isLastLine;
    }

    return lines;
  }

  /**
   * get next line
   * @param {Node} currentLine - current line node
   * @param {Node} end - last node in selection
   * @returns {Node} - next line node
   * @private
   */
  _getNextLine(currentLine, end) {
    let nextLine = currentLine.nextElementSibling;

    if (!nextLine) {
      // current line was the last line in ul/ol
      // while we have lines those has not been processed yet.
      nextLine = currentLine.parentNode.nextElementSibling;
    } else if ($(nextLine).is(UL_OR_OL)) {
      // we don't sure firstChild is LI. arbtrary list can have another ol/ul
      nextLine = nextLine.querySelector('li');
    }

    if ($(nextLine).is(DIV_OR_LI) || nextLine === end) {
      return nextLine;
    }

    return this._getNextLine(nextLine);
  }

  /**
   * merge to previous list
   * consider remove this function when https://github.com/neilj/Squire/issues/294 resolved
   * @param {HTMLLIElement} currentLine - current li element
   * @ignore
   */
  mergeList(currentLine) {
    let currentList = currentLine.parentNode;
    const prevList = currentList.previousElementSibling;
    const nextList = currentList.nextElementSibling;

    if (currentList.firstElementChild === currentLine) {
      if (prevList && $(prevList).is(UL_OR_OL)) {
        this._mergeList(currentList, prevList);
        currentList = prevList;
      }
    }

    if (currentList.lastElementChild === currentLine) {
      if (nextList && $(nextList).is(UL_OR_OL)) {
        this._mergeList(nextList, currentList);
      }
    }
  }

  /**
   * merge list to targetList
   * @param {HTMLOListElement|HTMLUListElement} list - list to merge
   * @param {HTMLOListElement|HTMLUListElement} targetList - target list
   * @ignore
   */
  _mergeList(list, targetList) {
    let listItem = list.firstElementChild;

    if (targetList && $(targetList).is(UL_OR_OL)) {
      while (listItem) {
        const temp = listItem.nextElementSibling;
        targetList.appendChild(listItem);
        listItem = temp;
      }

      list.parentNode.removeChild(list);
    }
  }
}

export default WwListManager;
