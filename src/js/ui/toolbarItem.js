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
  constructor(options = {
    name: 'toolbar-item'
  }) {
    super(util.extend({
      className: ToolbarItem.className
    }, options));

    this._name = options.name;
  }

  /**
   * get the name of the toolbar item
   * @returns {string} - the name of the toolbar item
   */
  getName() {
    return this._name;
  }

  static get className() {
    return 'tui-toolbar-item';
  }
}

export default ToolbarItem;
