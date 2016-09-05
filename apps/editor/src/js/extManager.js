/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


const util = tui.util;

/**
 * ExtManager
 * @exports ExtManager
 * @constructor
 * @class ExtManager
 */
class ExtManager {
    constructor() {
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
    defineExtension(name, ext) {
        this.exts.set(name, ext);
    }

    /**
     * Apply extensions
     * @api
     * @memberOf ExtManager
     * @param {object} context Context
     * @param {Array.<string>} extNames Extension names
     */
    applyExtension(context, extNames) {
        if (extNames) {
            extNames.forEach(extName => {
                if (this.exts.has(extName)) {
                    this.exts.get(extName)(context);
                }
            });
        }
    }
}
module.exports = new ExtManager();
