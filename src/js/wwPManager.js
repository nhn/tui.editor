/**
 * @fileoverview Implements wysiwyg p manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * WwPManager
 * @exports WwPManager
 * @class WwPManager
 * @constructor
 * @param {WysiwygEditor} wwe wysiwygEditor instance
 */
function WwPManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

/**
 * Name property
 * @api
 * @memberOf WwPManager
 * @type {string}
 */
WwPManager.prototype.name = 'p';

/**
 * _init
 * Init
 * @memberOf WwPManager
 * @private
 */
WwPManager.prototype._init = function() {
    this._initEvent();
};

/**
 * _initEvent
 * Initialize event
 * @memberOf WwPManager
 * @private
 */
WwPManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._ensurePtagContentWrappedWithDiv();
        self._unwrapPtags();
    });
};

/**
 * _ensurePtagContentWrappedWithDiv
 * Wrap new line inside P tag to DIV, and additional empty line added within too
 * @memberOf WwPManager
 * @private
 */
WwPManager.prototype._ensurePtagContentWrappedWithDiv = function() {
    this.wwe.get$Body().find('p').each(function(index, node) {
        if ($(node).find('div').length <= 0) {
            $(node).wrapInner('<div />');
        }

        if ($(node).next().is('p')) {
            $(node).append('<div><br></div>');
        }
    });
};

/**
 * _unwrapPtags
 * Unwrap P tag
 * @memberOf WwPManager
 * @private
 */
WwPManager.prototype._unwrapPtags = function() {
    this.wwe.get$Body().find('div').each(function(index, node) {
        if ($(node).parent().is('p')) {
            $(node).unwrap();
        }
    });
};

module.exports = WwPManager;
