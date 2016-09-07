/**
 * @fileoverview Implements wysiwyg list manager
 * @author Junghwan Park(junghwan.pakr@nhnent.com) FE Development Team/NHN Ent.
 */


const FIND_LI_ELEMENT = /<li/i;

/**
 * WwListManager
 * @exports WwListManager
 * @constructor
 * @class WwListManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
class WwListManager {

    constructor(wwe) {
        this.wwe = wwe;
        this.eventManager = wwe.eventManager;

        /**
         * Name property
         * @api
         * @memberOf WwListManager
         * @type {string}
         */
        this.name = 'list';

        this._init();
    }

    /**
     * _init
     * Initialize
     * @memberOf WwListManager
     * @private
     */
    _init() {
        this._initEvent();
        this._initKeyHandler();
    }

    /**
     * _initEvent
     * Initialize event
     * @memberOf WwListManager
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
    }

    /**
     * Find empty list for whole container and remove it.
     * @memberOf WwListManager
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
     * @memberOf WwListManager
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
     * @memberOf WwListManager
     * @param {HTMLElement} list list
     * @private
     */
    _removeBranchList(list) {
        const $list = $(list);
        let $branchRoot = $list;

        while (!$branchRoot[0].previousSibling) {
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
}

module.exports = WwListManager;
