/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * ExtManager
 * @exports ExtManager
 * @extends {}
 * @constructor
 * @class
 */
function ExtManager() {
    this.exts = new ne.util.HashMap();
}

ExtManager.prototype.activate = function(obj) {
    var extObjs = [];

    this.exts.each(function(Ext) {
        extObjs.push(new Ext(obj));
    });

    return extObjs;
};

ExtManager.prototype.add = function(ext) {
    this.exts.set(ext.name, ext);
};

module.exports = ExtManager;