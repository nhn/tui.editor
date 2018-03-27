/**
 * @fileoverview Implements Toolbar Divider
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import ToolbarItem from './toolbarItem';

class ToolbarDivider extends ToolbarItem {
  constructor() {
    super({
      name: ToolbarDivider.name,
      tagName: 'div',
      className: ToolbarDivider.className
    });
  }

  static get name() {
    return 'divider';
  }

  static get className() {
    return 'tui-toolbar-divider';
  }
}

export default ToolbarDivider;
