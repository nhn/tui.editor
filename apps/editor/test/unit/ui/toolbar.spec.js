/**
 * @fileoverview test ui toolbar
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import Toolbar from '@/ui/toolbar';
import ToolbarItem from '@/ui/toolbarItem';
import ToolbarButton from '@/ui/toolbarButton';
import CommandManager from '@/commandManager';
import Command from '@/command';
import EventManager from '@/eventManager';

describe('Toolbar', () => {
  let toolbar, em, cm;

  beforeEach(() => {
    em = new EventManager();
    em.addEventType('test');
    cm = new CommandManager({
      eventManager: em
    });
    toolbar = new Toolbar(em);
  });

  afterEach(() => {
    toolbar.destroy();
  });

  it('button state should be (de)activated on stateChange event', () => {
    toolbar.addItem({
      type: 'button',
      options: {
        className: 'testButton',
        event: 'testEvent',
        text: 'textText',
        state: 'testState'
      }
    });
    const buttonEl = toolbar.getItems()[0].el;

    em.emit('stateChange', {
      testState: true
    });
    expect($(buttonEl).hasClass('active')).toBe(true);

    em.emit('stateChange', {
      testState: false
    });
    expect($(buttonEl).hasClass('active')).toBe(false);
  });

  describe('setItems', () => {
    it('should set items array to given items array', () => {
      const inputItems = [new ToolbarItem(), new ToolbarItem()];

      toolbar.setItems(inputItems);

      const outputItems = toolbar.getItems();

      expect(outputItems.length).toBe(inputItems.length);
      expect(outputItems[0]).toBe(inputItems[0]);
      expect(outputItems[1]).toBe(inputItems[1]);
    });

    it('should remove items before set items', () => {
      spyOn(toolbar, 'removeAllItems');

      toolbar.setItems([]);

      expect(toolbar.removeAllItems).toHaveBeenCalled();
    });
  });

  describe('addItem', () => {
    let inputItem;

    beforeEach(() => {
      inputItem = new ToolbarItem();
    });

    afterEach(() => {
      inputItem.destroy();
    });

    it('should add the item', () => {
      toolbar.addItem(inputItem);

      const outputItem = toolbar.getItem(0);

      expect(outputItem).toBe(inputItem);
      expect(outputItem.el.parentNode).toBe(toolbar.el);
    });

    it('should bind the item event', () => {
      const spy = jasmine.createSpy('test');

      em.listen('test', spy);

      toolbar.addItem(inputItem);

      inputItem.trigger('event', 'test');
      expect(spy).toHaveBeenCalled();
    });

    it('should bind the item command', () => {
      const command = new Command('testCommand', Command.TYPE.GB);

      command.setup = function() {};
      command.exec = jasmine.createSpy('exec');
      cm.addCommand(command);

      toolbar.addItem(inputItem);

      inputItem.trigger('command', 'testCommand');
      expect(command.exec).toHaveBeenCalled();
    });
  });

  describe('insertItem', () => {
    let inputItems;

    beforeEach(() => {
      inputItems = [];
      inputItems.push(new ToolbarItem());
      inputItems.push(new ToolbarItem());
      inputItems.push(new ToolbarItem());
      inputItems.push(new ToolbarItem());
      inputItems.push(new ToolbarItem());
    });

    afterEach(() => {
      inputItems.forEach(inputItem => {
        inputItem.destroy();
      });
    });

    it('should insert the item into given index', () => {
      toolbar.insertItem(0, inputItems[0]);
      toolbar.insertItem(0, inputItems[1]);
      toolbar.insertItem(0, inputItems[2]);
      toolbar.insertItem(2, inputItems[3]);
      toolbar.insertItem(2, inputItems[4]);

      // array index
      expect(toolbar._items[4]).toBe(inputItems[0]);
      expect(toolbar._items[1]).toBe(inputItems[1]);
      expect(toolbar._items[0]).toBe(inputItems[2]);
      expect(toolbar._items[3]).toBe(inputItems[3]);
      expect(toolbar._items[2]).toBe(inputItems[4]);

      // element index
      const children = toolbar.el.childNodes;

      expect(children[4]).toBe(inputItems[0].el);
      expect(children[1]).toBe(inputItems[1].el);
      expect(children[0]).toBe(inputItems[2].el);
      expect(children[3]).toBe(inputItems[3].el);
      expect(children[2]).toBe(inputItems[4].el);
    });

    it('should insert the item with given name for pre-defined items', () => {
      toolbar.insertItem(0, 'heading');
      toolbar.insertItem(1, 'bold');
      toolbar.insertItem(2, 'divider');

      expect(toolbar._items[0].getName()).toBe('heading');
      expect(toolbar._items[1].getName()).toBe('bold');
      expect(toolbar._items[2].getName()).toBe('divider');
    });

    it('should insert the button item with given options', () => {
      toolbar.insertItem(0, {
        type: 'button',
        options: {
          name: 'testButton'
        }
      });

      const [item] = toolbar._items;

      expect(item instanceof ToolbarButton).toBe(true);
      expect(item.getName()).toBe('testButton');
    });

    it('should bind the item event', () => {
      const spy = jasmine.createSpy('test');

      em.listen('test', spy);

      toolbar.insertItem(0, inputItems[0]);

      inputItems[0].trigger('event', 'test');
      expect(spy).toHaveBeenCalled();
    });

    it('should bind the item command', () => {
      const command = new Command('testCommand', Command.TYPE.GB);

      command.setup = function() {};
      command.exec = jasmine.createSpy('exec');
      cm.addCommand(command);

      toolbar.insertItem(0, inputItems[0]);

      inputItems[0].trigger('command', 'testCommand');
      expect(command.exec).toHaveBeenCalled();
    });
  });

  describe('getItems', () => {
    it('should return toolbar items array', () => {
      const items = toolbar.getItems();

      expect(items).toEqual(jasmine.any(Array));
      items.forEach(item => {
        expect(item).toEqual(jasmine.any(ToolbarItem));
      });
    });
  });

  describe('getItem', () => {
    it('should return toolbar item at given index', () => {
      const items = [new ToolbarItem(), new ToolbarItem(), new ToolbarItem()];

      toolbar.setItems(items);

      const item = toolbar.getItem(1);

      expect(item).toBe(items[1]);
    });
  });

  describe('removeItem', () => {
    it('should remove item at given index', () => {
      const items = [new ToolbarItem(), new ToolbarItem(), new ToolbarItem()];

      toolbar.setItems(items);

      toolbar.removeItem(1);

      expect(toolbar._items[0]).toBe(items[0]);
      expect(toolbar._items[1]).toBe(items[2]);
    });

    it('should remove given item', () => {
      const items = [new ToolbarItem(), new ToolbarItem(), new ToolbarItem()];

      toolbar.setItems(items);

      toolbar.removeItem(items[1]);

      expect(toolbar._items[0]).toBe(items[0]);
      expect(toolbar._items[1]).toBe(items[2]);
    });

    it('should call destroy of the removing item', () => {
      const spy = jasmine.createSpy('destroy');
      const item = new ToolbarItem();
      const items = [new ToolbarItem(), new ToolbarItem(), item];

      item.destroy = spy;
      toolbar.setItems(items);

      toolbar.removeItem(2);

      expect(item.destroy).toHaveBeenCalled();
    });

    it('should not destroy if destroy param is false', () => {
      const spy = jasmine.createSpy('destroy');
      const item = new ToolbarItem();
      const items = [new ToolbarItem(), new ToolbarItem(), item];

      item.destroy = spy;
      toolbar.setItems(items);

      toolbar.removeItem(2, false);

      expect(item.destroy).not.toHaveBeenCalled();
    });
  });

  describe('indexOfItem', () => {
    let items;

    beforeEach(() => {
      items = [
        new ToolbarItem({
          name: 'item 1'
        }),
        new ToolbarItem({
          name: 'item 2'
        }),
        new ToolbarItem({
          name: 'item 3'
        })
      ];
      toolbar._items = items;
    });

    it('should return index of given item', () => {
      expect(toolbar.indexOfItem(items[0])).toBe(0);
      expect(toolbar.indexOfItem(items[1])).toBe(1);
      expect(toolbar.indexOfItem(items[2])).toBe(2);
    });

    it('should return index of given item name', () => {
      expect(toolbar.indexOfItem('item 1')).toBe(0);
      expect(toolbar.indexOfItem('item 2')).toBe(1);
      expect(toolbar.indexOfItem('item 3')).toBe(2);
    });
  });

  describe('removeAllItems', () => {
    it('should destory items and empty items array', () => {
      const destroySpy = jasmine.createSpy('destroy');
      const items = [new ToolbarItem(), new ToolbarItem()];
      const { length } = items;

      items.forEach(item => {
        item.destroy = destroySpy;
      });
      toolbar.setItems(items);

      toolbar.removeAllItems();

      expect(destroySpy).toHaveBeenCalled();
      expect(destroySpy.calls.count()).toBe(length);
      expect(toolbar.getItems().length).toBe(0);
    });
  });

  describe('enableAllButton', () => {
    it('should call the enable of all the button in the toolbar', () => {
      toolbar.addItem({
        type: 'button',
        options: {
          className: 'test',
          command: 'test',
          text: 'test'
        }
      });
      toolbar.addItem({
        type: 'button',
        options: {
          className: 'test2',
          command: 'test2',
          text: 'test2'
        }
      });
      const buttons = toolbar.getItems();

      spyOn(buttons[0], 'enable');
      spyOn(buttons[1], 'enable');

      toolbar.enableAllButton();

      expect(buttons[0].enable).toHaveBeenCalled();
      expect(buttons[1].enable).toHaveBeenCalled();
    });

    it('should be called onchangePreviewTabWrite', () => {
      spyOn(toolbar, 'enableAllButton');

      em.emit('changePreviewTabWrite');

      expect(toolbar.enableAllButton).toHaveBeenCalled();
    });

    it('should be called onchangeMode', () => {
      spyOn(toolbar, 'enableAllButton');

      em.emit('changeMode');

      expect(toolbar.enableAllButton).toHaveBeenCalled();
    });
  });

  describe('disableAllButton', () => {
    it('should call the disable of all the button in the toolbar', () => {
      toolbar.addItem({
        type: 'button',
        options: {
          className: 'test',
          command: 'test',
          text: 'test'
        }
      });
      toolbar.addItem({
        type: 'button',
        options: {
          className: 'test2',
          command: 'test2',
          text: 'test2'
        }
      });
      const buttons = toolbar.getItems();

      spyOn(buttons[0], 'disable');
      spyOn(buttons[1], 'disable');

      toolbar.disableAllButton();

      expect(buttons[0].disable).toHaveBeenCalled();
      expect(buttons[1].disable).toHaveBeenCalled();
    });

    it('should be called changePreviewTabPreview', () => {
      spyOn(toolbar, 'disableAllButton');

      em.emit('changePreviewTabPreview');

      expect(toolbar.disableAllButton).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      $('body').append(toolbar.el);
    });

    afterEach(() => {
      if (toolbar.el) {
        toolbar.el.remove();
      }
    });

    it('should free instance', () => {
      toolbar.destroy();
      expect(toolbar.buttons).toBeFalsy();
      expect(toolbar.el).toBeFalsy();
      expect(toolbar.$buttonContainer).toBeFalsy();
    });

    it('should destroy toolbar items too', () => {
      const destroySpy = jasmine.createSpy('destroy');
      const items = [new ToolbarItem(), new ToolbarItem()];
      const { length } = items;

      items.forEach(item => {
        item.destroy = destroySpy;
      });
      toolbar.setItems(items);

      toolbar.destroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(destroySpy.calls.count()).toBe(length);
    });
  });

  describe('constructor', () => {
    beforeEach(() => {
      $('body').append(toolbar.el);
    });

    it('should create a toolbar without an item', () => {
      toolbar = new Toolbar(em);

      expect(toolbar.getItems().length).toBe(0);
    });

    it('should create a toolbar with given items', () => {
      const itemsInput = [new ToolbarItem(), new ToolbarItem()];

      toolbar = new Toolbar(em, itemsInput);

      const itemsOutput = toolbar.getItems();

      expect(itemsOutput.length).toBe(itemsInput.length);
    });
  });
});
