/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

/**
 * ExtManager
 * @exports ExtManager
 * @extends {}
 * @constructor
 * @class
 */
function ExtManager() {
    this.exts = new util.Map();
}

/**
 * Extension Closure callback
 * @callback ExtManager~extension
 * @param {ToastUIEditor} editor editor instance
 */

/**
 * defineExtension
 * Defined Extension
 * @param {string} name extension name
 * @param {ExtManager~extension} ext extension
 */
ExtManager.prototype.defineExtension = function(name, ext) {
    this.exts.set(name, ext);
};

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
