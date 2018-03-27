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

/**
 * Class Toolbar
 * @extends {UIController}
 */
class Toolbar extends UIController {
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

    /**
     * UI name
     * @memberof Toolbar#
     * @private
     * @type {Array}
     */
    this._items = [];

    /**
     * UI name
     * @memberof Toolbar#
     * @private
     * @type {EventManager}
     */
    this._eventManager = eventManager;

    this._render();
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
   * render
   * Render toolbar
   * @private
   */
  _render() {
    this.$buttonContainer = this.$el;
  }

  /**
   * get toolbar items
   * @returns {ToolbarItem[]} - toolbar items
   * @memberof Toolbar
   */
  getItems() {
    return this._items;
  }

  /**
   * set toolbar items
   * @param {ToolbarItem[]} items - toolbar items
   * @memberof Toolbar
   */
  setItems(items) {
    this.removeAllItems();
    items.forEach(item => {
      this.addItem(item);
    });
  }

  /**
   * add toolbar item
   * @param {ToolbarItem} item - toolbar item
   * @memberof Toolbar
   */
  addItem(item) {
    this.insertItem(this._items.length, item);
  }

  /**
   * insert toolbar item
   * @param  {number} index - index at given item inserted
   * @param  {ToolbarItem} item - toolbar item
   * @memberof Toolbar
   */
  insertItem(index, item) {
    const children = this.$el.children();
    if (index >= 0 && index < children.length) {
      item.$el.insertBefore(children.eq(index));
      this._items.splice(index, 0, item);
    } else {
      item.$el.appendTo(this.$el);
      this._items.push(item);
    }

    item.on('command', (e, commandName) => this._eventManager.emit('command', commandName));
    item.on('event', (e, eventName) => this._eventManager.emit(eventName));
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
    } else if (typeof item === 'string') {
      const itemName = item;
      index = this._items.map(itemToTest => itemToTest.getName()).indexOf(itemName);
    }

    return index;
  }

  /**
   * remove an item
   * @param  {number} index - item index to remove
   * @memberof Toolbar
   */
  removeItem(index) {
    const item = this._items.splice(index, 1);
    if (item.length > 0) {
      item[0].destroy();
    }
  }

  /**
   * remove all toolbar items
   * @memberof Toolbar
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
      this.$buttonContainer.find(`.${Button.className}`).eq(index - 1).before($btn);
    } else {
      this.$buttonContainer.append($btn);
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
    this.$buttonContainer.append($el);

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
