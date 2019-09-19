/**
 * @fileoverview Implements Toolbar Divider
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import ToolbarItem from './toolbarItem';

/**
 * Class ToolbarDivider
 * @ignore
 */
class ToolbarDivider extends ToolbarItem {
  /**
   * item name
   * @type {String}
   * @static
   */
  static name = 'divider';

  /**
   * item class name
   * @type {String}
   * @static
   */
  static className = 'tui-toolbar-divider';

  constructor() {
    super({
      name: ToolbarDivider.name,
      tagName: 'div',
      className: ToolbarDivider.className
    });
  }
}

export default ToolbarDivider;
