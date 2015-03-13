/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var util = ne.util;

/**
 * ExtManager
 * @exports ExtManager
 * @extends {}
 * @constructor
 * @class
 */
function ExtManager() {
    this.exts = new util.HashMap();
}

ExtManager.prototype.defineExtension = function(name, ext) {
    this.exts.set('name', ext);
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

module.exports = ExtManager;