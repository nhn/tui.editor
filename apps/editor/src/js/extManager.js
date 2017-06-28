/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

const {util} = tui;

/**
 * ExtManager
 * @class ExtManager
 */
class ExtManager {
    /**
     * Creates an instance of ExtManager.
     * @memberof ExtManager
     */
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
     * @memberof ExtManager
     * @param {object} context Context
     * @param {Array.<string|object>} options - options or names array
     */
    applyExtension(context, options) {
        if (options) {
            options.forEach(option => {
                const hasOption = util.isObject(option);
                const name = hasOption ? option.name : option;

                if (this.exts.has(name)) {
                    const ext = this.exts.get(name);
                    if (hasOption) {
                        ext(context, option);
                    } else {
                        ext(context);
                    }
                }
            });
        }
    }
}

module.exports = new ExtManager();
