/**
 * @fileoverview Implements Toolbar Item
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';
import UIController from './uicontroller';

/**
 * Toolbar Item
 * @extends {UIController}
 */
class ToolbarItem extends UIController {
  /**
   * item name
   * @memberof ToolbarDivider
   * @type {String}
   * @static
   */
  static name = 'item';

  /**
   * toolbar item class name
   * @memberof ToolbarItem
   * @type {String}
   */
  static className = 'tui-toolbar-item';

  /**
   * toolbar item constructor
   * @memberof ToolbarItem
   * @param {Object} [options={name: 'toolbar-item'}] [description]
   */
  constructor(options = {
    name: ToolbarItem.name
  }) {
    super(util.extend({
      className: ToolbarItem.className
    }, options));

    this._name = options.name;
  }

  /**
   * get the name of the toolbar item
   * @memberof ToolbarItem
   * @returns {string} - the name of the toolbar item
   */
  getName() {
    return this._name;
  }
}

export default ToolbarItem;
