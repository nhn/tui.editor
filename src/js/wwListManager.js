/**
 * @fileoverview Implements wysiwyg list manager
 * @author Junghwan Park(junghwan.pakr@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var FIND_LI_ELEMENT = /<li/i;

/**
 * WwListManager
 * @exports WwListManager
 * @constructor
 * @class WwListManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwListManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

/**
 * Name property
 * @api
 * @memberOf WwListManager
 * @type {string}
 */
WwListManager.prototype.name = 'list';

/**
 * _init
 * Initialize
 * @memberOf WwListManager
 * @private
 */
WwListManager.prototype._init = function() {
    this._initEvent();
    this._initKeyHandler();
};

/**
 * _initEvent
 * Initialize event
 * @memberOf WwListManager
 * @private
 */
WwListManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygRangeChangeAfter', function() {
        self._findAndRemoveEmptyList();
        self._removeBranchListAll();
    });

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._removeBranchListAll();
        self._wrapDefaultBlockToListInner();
    });

    this.eventManager.listen('wysiwygProcessHTMLText', function(html) {
        return self._prepareInsertBlankToBetweenSameList(html);
    });

    this.eventManager.listen('convertorAfterHtmlToMarkdownConverted', function(markdown) {
        return markdown.replace(/:BLANK_LINE:\n/g, '');
    });
};


WwListManager.prototype._initKeyHandler = function() {
    var self = this;

    this.wwe.addKeyEventHandler('TAB', function(ev, range) {
        if (range.collapsed) {
            if (self.wwe.getEditor().hasFormat('LI')) {
                ev.preventDefault();
                self.eventManager.emit('command', 'IncreaseDepth');

                return false;
            }
        }

        return true;
    });

    this.wwe.addKeyEventHandler('SHIFT+TAB', function(ev, range) {
        var isNeedNext;
        var $ul;

        if (range.collapsed) {
            if (self.wwe.getEditor().hasFormat('LI')) {
                ev.preventDefault();
                $ul = $(range.startContainer).closest('li').children('ul, ol');

                self.eventManager.emit('command', 'DecreaseDepth');

                if ($ul.length && !$ul.prev().length) {
                    self._removeBranchList($ul);
                }

                isNeedNext = false;
            }
        }

        return isNeedNext;
    });
};

/**
 * Find empty list for whole container and remove it.
 * @memberOf WwListManager
 * @private
 */
WwListManager.prototype._findAndRemoveEmptyList = function() {
    this.wwe.get$Body()
        .find('ul,ol')
        .each(function(index, node) {
            if (!(FIND_LI_ELEMENT.test(node.innerHTML))) {
                $(node).remove();
            }
        });
};

/**
 * Remove branch lists all from body
 */
WwListManager.prototype._removeBranchListAll = function() {
    var self = this;

    self.wwe.get$Body().find('li ul, li ol').each(function() {
        if (!this || this.previousSibling) {
            return;
        }
        self._removeBranchList(this);
    });
};

/**
 * Remove branch list of passed list(ul, ol)
 * @param {HTMLElement} list list
 */
WwListManager.prototype._removeBranchList = function(list) {
    var $list = $(list);
    var $branchRoot = $list;
    var $firstLi;

    while (!$branchRoot[0].previousSibling) {
        $branchRoot = $branchRoot.parent();
    }

    $firstLi = $branchRoot.children('li').eq(0);

    $branchRoot.prepend($list.children().unwrap());

    $firstLi.remove();
};

/**
 * _wrapDefaultBlockToListInner
 * Wrap default block to list inner contents
 * @private
 */
WwListManager.prototype._wrapDefaultBlockToListInner = function() {
    this.wwe.get$Body().find('li').each(function(index, node) {
        if ($(node).children('div, p').length <= 0) {
            $(node).wrapInner('<div />');
        }
    });
};

WwListManager.prototype._prepareInsertBlankToBetweenSameList = function(html) {
    return html.replace(/<\/(ul|ol)>(<br \/>|<br>){0,}<\1>/g, '</$1>:BLANK_LINE:<$1>');
};

module.exports = WwListManager;
