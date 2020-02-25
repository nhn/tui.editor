/**
 * @fileoverview Implements toolbar
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import isString from 'tui-code-snippet/type/isString';
import isNumber from 'tui-code-snippet/type/isNumber';
import isArray from 'tui-code-snippet/type/isArray';

import UIController from './uicontroller';
import Button from './button';
import ToolbarItem from './toolbarItem';
import ToolbarItemFactory from './toolbarItemFactory';
import domUtils from '../domUtils';

/**
 * Class Toolbar
 * @param {EventManager} eventManager - event manager
 * @param {ToolbarItem[]} [items=[]] - toolbar items
 */
class Toolbar extends UIController {
  /**
   * items
   * @type {Array}
   * @private
   */
  _items = [];

  /**
   * event manager
   * @type {EventManager}
   * @private
   */
  _eventManager;

  constructor(eventManager, items = []) {
    super({
      tagName: 'div',
      className: 'tui-editor-defaultUI-toolbar'
    });

    this._eventManager = eventManager;

    this.setItems(items);
    this._initEvent(eventManager);
  }

  /**
   * init event
   * @param  {EventManager} eventManager - event manager
   * @private
   * @override
   */
  _initEvent(eventManager) {
    eventManager.listen('stateChange', ev => {
      this._items.forEach(item => {
        if (item._state) {
          domUtils.toggleClass(item.el, 'active', !!ev[item._state]);
        }
      });
    });
    eventManager.listen('changePreviewTabPreview', () => this.disableAllButton());
    eventManager.listen('changePreviewTabWrite', () => this.enableAllButton());
    eventManager.listen('changeMode', () => this.enableAllButton());
  }

  /**
   * disable all toolbar button
   */
  disableAllButton() {
    this._items.forEach(item => {
      if (item instanceof Button) {
        item.disable();
      }
    });
  }

  /**
   * enable all toolbar button
   */
  enableAllButton() {
    this._items.forEach(item => {
      if (item instanceof Button) {
        item.enable();
      }
    });
  }

  /**
   * get toolbar items
   * @returns {ToolbarItem[]} - toolbar items
   */
  getItems() {
    return this._items.slice(0);
  }

  /**
   * get toolbar item at given index
   * @param  {number} index - item index
   * @returns {ToolbarItem} - toolbar item at the index
   */
  getItem(index) {
    return this._items[index];
  }

  /**
   * set toolbar items
   * @param {ToolbarItem[]} items - toolbar items
   */
  setItems(items) {
    this.removeAllItems();
    items.forEach(this.addItem.bind(this));
  }

  /**
   * add toolbar item
   * @param {ToolbarItem|string|object} item - toolbar item
   */
  addItem(item) {
    this.insertItem(this._items.length, item);
  }

  /**
   * insert toolbar item
   * @param  {number} index - index at given item inserted
   * @param  {ToolbarItem|string|object} item - toolbar item
   */
  insertItem(index, item) {
    if (isString(item)) {
      item = ToolbarItemFactory.create(item);
    } else if (isString(item.type)) {
      item = ToolbarItemFactory.create(item.type, item.options);
    }

    const { children } = this.el;

    if (index >= 0 && index < children.length) {
      domUtils.insertBefore(item.el, children[index]);
      this._items.splice(index, 0, item);
    } else {
      this.el.appendChild(item.el);
      this._items.push(item);
    }

    item.onCommandHandler = (e, commandName) => this._eventManager.emit('command', commandName);
    item.onEventHandler = (e, eventName) => this._eventManager.emit(eventName);
    item.on('command', item.onCommandHandler);
    item.on('event', item.onEventHandler);
  }

  /**
   * get index of given item
   * @param  {ToolbarItem} item - toolbar item
   * @returns {number} - index of given toolbar item
   */
  indexOfItem(item) {
    let index;

    if (item instanceof ToolbarItem) {
      index = this._items.indexOf(item);
    } else if (isString(item)) {
      const itemName = item;

      index = this._items.map(itemToTest => itemToTest.getName()).indexOf(itemName);
    }

    return index;
  }

  /**
   * remove an item
   * @param  {ToolbarItem|number} item - an toolbar item or index of the item to remove
   * @param  {boolean} destroy - destroy item or not
   * @returns {ToolbarItem|undefined} - removed item
   */
  removeItem(item, destroy = true) {
    let index;
    let removedItem;

    if (item instanceof ToolbarItem) {
      index = this.indexOfItem(item);
    } else {
      index = item;
    }

    if (index >= 0) {
      removedItem = this._items.splice(index, 1)[0];
    }
    if (removedItem) {
      if (destroy) {
        removedItem.destroy();
      } else {
        removedItem.off('command', removedItem.onCommandHandler);
        removedItem.off('event', removedItem.onEventHandler);
        domUtils.remove(removedItem.el);
      }
    }

    return removedItem;
  }

  /**
   * remove all toolbar items
   */
  removeAllItems() {
    while (this._items && this._items.length > 0) {
      this.removeItem(0);
    }
  }

  /**
   * destroy instance
   * @override
   */
  destroy() {
    this.removeAllItems();
    super.destroy();
  }

  /**
   * add button
   * @param {Button} button - button instance
   * @param {Number} [index] - location the button will be placed
   * @deprecated
   */
  addButton(button, index) {
    if (isArray(button)) {
      let arrayIndex = button.length - 1;

      for (; arrayIndex >= 0; arrayIndex -= 1) {
        if (isNumber(index)) {
          this._addButton(button[arrayIndex], index);
        } else {
          this._addButton(button);
        }
      }
    } else {
      this._addButton(button, index);
    }
  }

  /**
   * _addButton
   * @param {Button} button - button instance
   * @param {Number} index - location the button will be placed
   * @private
   * @deprecated
   */
  _addButton(button, index) {
    const btn = this._setButton(button, index).el;

    if (isNumber(index)) {
      const buttons = this.el.querySelectorAll(`.${Button.className}`);

      if (buttons.length) {
        domUtils.insertBefore(btn, buttons[index - 1]);
      }
    } else {
      this.el.appendChild(btn);
    }
  }

  /**
   * _setButton
   * @param {Button} button - button instance
   * @param {Number} index - location the button will be placed
   * @returns {Button} - button instance
   * @private
   * @deprecated
   */
  _setButton(button, index) {
    const ev = this._eventManager;

    if (!(button instanceof Button)) {
      button = new Button(button);
    }

    button.on('command', (e, commandName) => ev.emit('command', commandName));
    button.on('event', (e, eventName) => ev.emit(eventName));

    if (isNumber(index)) {
      this._items.splice(index, 0, button);
    } else {
      this._items.push(button);
    }

    return button;
  }
}

export default Toolbar;
