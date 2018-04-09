/**
 * @fileoverview Implements toolbar
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import UIController from './uicontroller';
import Button from './button';
import ToolbarItem from './toolbarItem';
import ToolbarDivider from './toolbarDivider';
import ToolbarItemFactory from './toolbarItemFactory';

/**
 * Class Toolbar
 * @extends {UIController}
 */
class Toolbar extends UIController {
  /**
   * items
   * @memberof Toolbar
   * @private
   * @type {Array}
   */
  _items = [];

  /**
   * event manager
   * @memberof Toolbar
   * @private
   * @type {EventManager}
   */
  _eventManager;

  /**
   * Creates an instance of Toolbar.
   * @param {EventManager} eventManager - event manager
   * @param {ToolbarItem[]} [items=[]] - toolbar items
   * @memberof Toolbar
   */
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
   */
  _initEvent(eventManager) {
    eventManager.listen('stateChange', ev => {
      this._items.forEach(item => {
        if (item._state) {
          if (ev[item._state]) {
            item.$el.addClass('active');
          } else {
            item.$el.removeClass('active');
          }
        }
      });
    });
  }

  /**
   * get toolbar items
   * @returns {ToolbarItem[]} - toolbar items
   * @memberof Toolbar
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
   * @memberof Toolbar
   */
  setItems(items) {
    this.removeAllItems();
    items.forEach(this.addItem.bind(this));
  }

  /**
   * add toolbar item
   * @param {ToolbarItem|string|object} item - toolbar item
   * @memberof Toolbar
   */
  addItem(item) {
    this.insertItem(this._items.length, item);
  }

  /**
   * insert toolbar item
   * @param  {number} index - index at given item inserted
   * @param  {ToolbarItem|string|object} item - toolbar item
   * @memberof Toolbar
   */
  insertItem(index, item) {
    if (util.isString(item)) {
      item = ToolbarItemFactory.create(item);
    } else if (util.isString(item.type)) {
      item = ToolbarItemFactory.create(item.type, item.options);
    }

    const children = this.$el.children();
    if (index >= 0 && index < children.length) {
      item.$el.insertBefore(children.eq(index));
      this._items.splice(index, 0, item);
    } else {
      item.$el.appendTo(this.$el);
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
   * @memberof Toolbar
   */
  indexOfItem(item) {
    let index;
    if (item instanceof ToolbarItem) {
      index = this._items.indexOf(item);
    } else if (util.isString(item)) {
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
   * @memberof Toolbar
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
        removedItem.$el.detach();
      }
    }

    return removedItem;
  }

  /**
   * remove all toolbar items
   * @memberof Toolbar
   */
  removeAllItems() {
    while (this._items && this._items.length > 0) {
      this.removeItem(0);
    }
  }

  /**
   * destroy instance
   * @memberof Toolbar
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
   * @memberof Toolbar
   * @deprecated
   */
  addButton(button, index) {
    if (util.isArray(button)) {
      let arrayIndex = button.length - 1;
      for (; arrayIndex >= 0; arrayIndex -= 1) {
        if (util.isNumber(index)) {
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
    const $btn = this._setButton(button, index).$el;

    if (util.isNumber(index)) {
      this.$el.find(`.${Button.className}`).eq(index - 1).before($btn);
    } else {
      this.$el.append($btn);
    }
  }

  /**
   * add divider
   * @returns {jQuery} - created divider jquery element
   * @memberof Toolbar
   * @deprecated
   */
  addDivider() {
    const $el = $(`<div class="${ToolbarDivider.className}"></div>`);
    this.$el.append($el);

    return $el;
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
    if (util.isNumber(index)) {
      this._items.splice(index, 0, button);
    } else {
      this._items.push(button);
    }

    return button;
  }
}

export default Toolbar;
