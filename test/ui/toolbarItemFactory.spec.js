/**
 * @fileoverview Test Toolbar Item Factory
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import ToolbarItemFactory from '../../src/js/ui/toolbarItemFactory';
import ToolbarItem from '../../src/js/ui/toolbarItem';
import ToolbarButton from '../../src/js/ui/toolbarButton';
import ToolbarDivider from '../../src/js/ui/toolbarDivider';

describe('ToolbarItemFactory', () => {
  describe('createItem', () => {
    it('should create and return a ToolbarItem', () => {
      expect(ToolbarItemFactory.create).toBeTruthy();
      expect(ToolbarItemFactory.create() instanceof ToolbarItem).toBe(true);
    });

    it('should create button with given options if the given name is `button`', () => {
      const button = ToolbarItemFactory.create('button', {
        name: 'testbutton'
      });

      expect(button instanceof ToolbarButton).toBe(true);
      expect(button.getName()).toBe('testbutton');
    });

    it('should create divider if given name is `divider`', () => {
      const divider = ToolbarItemFactory.create('divider');

      expect(divider instanceof ToolbarDivider).toBe(true);
      expect(divider.getName()).toBe('divider');
    });

    it('should create item with given options if given name is `item`', () => {
      const item = ToolbarItemFactory.create('item', {
        name: 'testitem'
      });

      expect(item instanceof ToolbarItem).toBe(true);
      expect(item.getName()).toBe('testitem');
    });

    it('should create corresponding items to given name', () => {
      expect(ToolbarItemFactory.create('heading').getName()).toBe('heading');
      expect(ToolbarItemFactory.create('bold').getName()).toBe('bold');
      expect(ToolbarItemFactory.create('italic').getName()).toBe('italic');
      expect(ToolbarItemFactory.create('strike').getName()).toBe('strike');
      expect(ToolbarItemFactory.create('hr').getName()).toBe('hr');
      expect(ToolbarItemFactory.create('quote').getName()).toBe('quote');
      expect(ToolbarItemFactory.create('ul').getName()).toBe('ul');
      expect(ToolbarItemFactory.create('ol').getName()).toBe('ol');
      expect(ToolbarItemFactory.create('task').getName()).toBe('task');
      expect(ToolbarItemFactory.create('table').getName()).toBe('table');
      expect(ToolbarItemFactory.create('image').getName()).toBe('image');
      expect(ToolbarItemFactory.create('link').getName()).toBe('link');
      expect(ToolbarItemFactory.create('code').getName()).toBe('code');
      expect(ToolbarItemFactory.create('codeblock').getName()).toBe('codeblock');
      expect(ToolbarItemFactory.create('item').getName()).toBe('item');
    });
  });
});
