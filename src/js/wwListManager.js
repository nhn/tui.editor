/**
 * @fileoverview Implements wysiwyg list manager
 * @author Junghwan Park(junghwan.pakr@nhnent.com) FE Development Team/NHN Ent.
 */

import domUtils from './domUtils';

const FIND_LI_ELEMENT = /<li/i;

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
        this.eventManager.listen('wysiwygRangeChangeAfter', () => {
            this._findAndRemoveEmptyList();
            this._removeBranchListAll();
            this._wrapDefaultBlockToListInner();
        });

        this.eventManager.listen('wysiwygSetValueAfter', () => {
            this._removeBranchListAll();
            this._wrapDefaultBlockToListInner();
        });

        this.eventManager.listen('wysiwygProcessHTMLText', html => this._prepareInsertBlankToBetweenSameList(html));

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
                    const $ul = $(range.startContainer).closest('li').children('ul, ol');

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
        this.wwe.get$Body().find('ul,ol').each((index, node) => {
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

    /**
     * _wrapDefaultBlockToListInner
     * Wrap default block to list inner contents
     * @private
     */
    _wrapDefaultBlockToListInner() {
        this.wwe.get$Body().find('li').each((index, node) => {
            if ($(node).children('div, p').length <= 0) {
                $(node).wrapInner('<div />');
                $(node).find('div').children('ul, ol').appendTo(node);
            }
        });
    }

    _prepareInsertBlankToBetweenSameList(html) {
        return html.replace(/<\/(ul|ol)>(<br \/>|<br>){0,}<\1>/g, '</$1>:BLANK_LINE:<$1>');
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
        let isEndPassed = false;
        let needNext = true;
        let nextLine;

        if (domUtils.isTextNode(start)) {
            start = $(start).parents('div').first().get(0);
        }

        if (domUtils.isTextNode(end)) {
            end = $(end).parents('div').first().get(0);
        }

        for (let line = start; needNext; line = nextLine) {
            if ($(line).is('DIV')) {
                lines.push(line);

                if (line === end) {
                    isEndPassed = true;
                }
                nextLine = line.nextElementSibling;
            } else {
                break;
            }
            needNext = nextLine && !isEndPassed;
        }

        return lines;
    }
}

module.exports = WwListManager;
