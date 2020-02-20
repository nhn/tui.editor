/**
 * @fileoverview test toolbar item
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import ToolbarItem from '@/ui/toolbarItem';

describe('ToolbarItem', () => {
  let toolbarItem;

  describe('constructor', () => {
    afterEach(() => {
      toolbarItem.destroy();
      toolbarItem = null;
    });

    it(`should add tui-toolbar-item className to it's base element`, () => {
      toolbarItem = new ToolbarItem();

      expect(toolbarItem).toBeTruthy();
      expect(toolbarItem.el.className).toBe(ToolbarItem.className);
    });

    it("getName() should return the name it's instance has been initialized with", () => {
      const itemName = 'testItemName';

      toolbarItem = new ToolbarItem({
        name: itemName
      });

      expect(toolbarItem.getName()).toBe(itemName);
    });
  });
});
