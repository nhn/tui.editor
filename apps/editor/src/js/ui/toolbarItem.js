/**
 * @fileoverview Implements Toolbar Item
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';
import UIController from './uicontroller';

/**
 * Class ToolbarItem
 * @param {Object} [options={name: 'toolbar-item'}] [description]
 */
class ToolbarItem extends UIController {
  /**
   * item name
   * @type {String}
   * @static
   * @private
   */
  static name = 'item';

  /**
   * toolbar item class name
   * @type {String}
   * @static
   * @private
   */
  static className = 'tui-toolbar-item';

  constructor(
    options = {
      name: ToolbarItem.name
    }
  ) {
    super(
      extend(
        {
          className: ToolbarItem.className
        },
        options
      )
    );

    this._name = options.name;
  }

  /**
   * get the name of the toolbar item
   * @returns {string} - the name of the toolbar item
   */
  getName() {
    return this._name;
  }
}

export default ToolbarItem;
