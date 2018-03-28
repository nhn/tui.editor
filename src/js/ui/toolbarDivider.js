/**
 * @fileoverview Implements Toolbar Divider
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import ToolbarItem from './toolbarItem';

class ToolbarDivider extends ToolbarItem {
  /**
   * item name
   * @memberof ToolbarDivider
   * @type {String}
   * @static
   */
  static name = 'divider';

  /**
   * item class name
   * @memberof ToolbarDivider
   * @type {String}
   * @static
   */
  static className = 'tui-toolbar-divider';

  /**
   * toolbar divider constructor
   * @memberof ToolbarDivider
   */
  constructor() {
    super({
      name: ToolbarDivider.name,
      tagName: 'div',
      className: ToolbarDivider.className
    });
  }
}

export default ToolbarDivider;
