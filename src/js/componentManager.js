/**
 * @fileoverview Implements ComponentManager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class ComponentManager
 * @param {MarkdownEditor|WysiwygEditor} editor - Editor instance
 * @ignore
 */
class ComponentManager {
  constructor(editor) {
    /**
     * private
     * @type {object}
     * @private
     */
    this._managers = {};
    this._editor = editor;
  }

  /**
   * addManager
   * Add manager
   * @param {string|function} nameOrConstructor Manager name or constructor
   * @param {function} [ManagerConstructor] Constructor
   */
  addManager(nameOrConstructor, ManagerConstructor) {
    if (!ManagerConstructor) {
      ManagerConstructor = nameOrConstructor;
      nameOrConstructor = null;
    }

    const instance = new ManagerConstructor(this._editor);

    this._managers[nameOrConstructor || instance.name] = instance;
  }

  /**
   * getManager
   * Get manager by manager name
   * @param {string} name Manager name
   * @returns {object} manager
   */
  getManager(name) {
    return this._managers[name];
  }

  /**
   * Remove Manager.
   * @param {string} name - manager name
   */
  removeManager(name) {
    const manager = this.getManager(name);

    if (!manager) {
      return;
    }

    if (manager.destroy) {
      manager.destroy();
    }

    delete this._managers[name];
  }
}

export default ComponentManager;
