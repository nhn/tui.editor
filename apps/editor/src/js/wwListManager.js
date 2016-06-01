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
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwListManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

WwListManager.prototype.name = 'list';

/**
 * _init
 * Init
 */
WwListManager.prototype._init = function() {
    this._initEvent();
};

/**
 * _initEvent
 * Initialize eventmanager event
 */
WwListManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygRangeChangeAfter', function() {
        self._findAndRemoveEmptyList();
    });
};
/**
 * Find empty list for whole container and remove it.
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

module.exports = WwListManager;
