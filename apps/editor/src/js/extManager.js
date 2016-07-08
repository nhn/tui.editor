/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

/**
 * ExtManager
 * @exports ExtManager
 * @constructor
 * @class ExtManager
 */
function ExtManager() {
    this.exts = new util.Map();
}

/**
 * defineExtension
 * Defined Extension
 * @api
 * @memberOf ExtManager
 * @param {string} name extension name
 * @param {ExtManager~extension} ext extension
 */
ExtManager.prototype.defineExtension = function(name, ext) {
    this.exts.set(name, ext);
};

/**
 * Apply extensions
 * @api
 * @memberOf ExtManager
 * @param {object} context Context
 * @param {Array.<string>} extNames Extension names
 */
ExtManager.prototype.applyExtension = function(context, extNames) {
    var self = this;

    if (extNames) {
        extNames.forEach(function(extName) {
            if (self.exts.has(extName)) {
                self.exts.get(extName)(context);
            }
        });
    }
};

module.exports = new ExtManager();
