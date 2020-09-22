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
  constructor() {
    super({
      name: 'divider',
      tagName: 'div',
      className: 'tui-toolbar-divider'
    });
  }
}

export default ToolbarDivider;
