/**
 * @fileoverview Test Toolbar Item Factory
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

import ToolbarItemFactory from '@/ui/toolbarItemFactory';
import ToolbarItem from '@/ui/toolbarItem';
import ToolbarButton from '@/ui/toolbarButton';
import ToolbarDivider from '@/ui/toolbarDivider';

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
      expect(ToolbarItemFactory.create('indent').getName()).toBe('indent');
      expect(ToolbarItemFactory.create('outdent').getName()).toBe('outdent');
      expect(ToolbarItemFactory.create('item').getName()).toBe('item');
    });

    it('should create items of commands/events', () => {
      expect(ToolbarItemFactory.create('heading')._event).toBe('openHeadingSelect');
      expect(ToolbarItemFactory.create('bold')._command).toBe('Bold');
      expect(ToolbarItemFactory.create('italic')._command).toBe('Italic');
      expect(ToolbarItemFactory.create('strike')._command).toBe('Strike');
      expect(ToolbarItemFactory.create('hr')._command).toBe('HR');
      expect(ToolbarItemFactory.create('quote')._command).toBe('Blockquote');
      expect(ToolbarItemFactory.create('ul')._command).toBe('UL');
      expect(ToolbarItemFactory.create('ol')._command).toBe('OL');
      expect(ToolbarItemFactory.create('task')._command).toBe('Task');
      expect(ToolbarItemFactory.create('table')._event).toBe('openPopupAddTable');
      expect(ToolbarItemFactory.create('image')._event).toBe('openPopupAddImage');
      expect(ToolbarItemFactory.create('link')._event).toBe('openPopupAddLink');
      expect(ToolbarItemFactory.create('code')._command).toBe('Code');
      expect(ToolbarItemFactory.create('codeblock')._command).toBe('CodeBlock');
      expect(ToolbarItemFactory.create('indent')._command).toBe('Indent');
      expect(ToolbarItemFactory.create('outdent')._command).toBe('Outdent');
    });
  });
});
