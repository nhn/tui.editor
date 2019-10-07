/**
 * @fileoverview extension manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import util from 'tui-code-snippet';

/**
 * Class ExtManager
 * @ignore
 */
class ExtManager {
  constructor() {
    this.exts = new util.Map();
  }

  /**
   * Defined Extension
   * @param {string} name extension name
   * @param {function} ext extension
   */
  defineExtension(name, ext) {
    this.exts.set(name, ext);
  }

  /**
   * Apply extensions
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

export default new ExtManager();
