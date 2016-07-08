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
 * Return boolean value that current range is in the List or not
 * @api
 * @memberOf WwListManager
 * @returns {boolean}
 */
WwListManager.prototype.isInList = function() {
    var range = this.wwe.getEditor().getSelection().cloneRange();

    return $(range.startContainer).parents('LI').length !== 0;
};

module.exports = WwListManager;
