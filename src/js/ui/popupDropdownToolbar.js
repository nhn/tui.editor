/**
 * @fileoverview implements DefaultToolbar
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import util from 'tui-code-snippet';

import LayerPopup from './layerpopup';
import Toolbar from './toolbar';

/**
 * Class PopupDropdownToolbar
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */
class PopupDropdownToolbar extends LayerPopup {
  /**
   * open event string
   * @type {string}
   */
  static OPEN_EVENT = 'openDropdownToolbar';

  constructor(options) {
    options = util.extend({
      header: false,
      className: 'te-dropdown-toolbar'
    }, options);
    super(options);
  }

  /**
   * get toolbar instance it contains
   * @returns {Toolbar} - toolbar instance
   */
  getToolbar() {
    return this._toolbar;
  }

  /**
   * get toolbar items
   * @returns {ToolbarItem[]} - toolbar items
   */
  getItems() {
    return this.getToolbar().getItems();
  }

  /**
   * get toolbar item at given index
   * @param  {number} index - item index
   * @returns {ToolbarItem} - toolbar item at the index
   */
  getItem(index) {
    return this.getToolbar().getItem(index);
  }

  /**
   * set toolbar items
   * @param {ToolbarItem[]} items - toolbar items
   */
  setItems(items) {
    this.getToolbar().setItems(items);
  }

  /**
   * add toolbar item
   * @param {ToolbarItem|string|object} item - toolbar item
   */
  addItem(item) {
    this.getToolbar().addItem(item);
  }

  /**
   * insert toolbar item
   * @param  {number} index - index at given item inserted
   * @param  {ToolbarItem|string|object} item - toolbar item
   */
  insertItem(index, item) {
    this.getToolbar().insertItem(index, item);
  }

  /**
   * get index of given item
   * @param  {ToolbarItem} item - toolbar item
   * @returns {number} - index of given toolbar item
   */
  indexOfItem(item) {
    return this.getToolbar().indexOfItem(item);
  }

  /**
   * remove an item
   * @param  {number} index - item index to remove
   * @param  {boolean} destroy - destroy item or not
   * @returns {ToolbarItem} - removed item
   */
  removeItem(index, destroy) {
    return this.getToolbar().removeItem(index, destroy);
  }

  /**
   * remove all toolbar items
   */
  removeAllItems() {
    this.getToolbar().removeAllItems();
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */
  _initInstance(options) {
    super._initInstance(options);

    const {$button, eventManager} = options;

    this._$button = $button;
    this._eventManager = eventManager;
    this._toolbar = new Toolbar(eventManager);
  }

  /**
   * initialize DOM, render popup
   * @private
   * @override
   */
  _initDOM() {
    super._initDOM();

    this.setContent(this._toolbar.$el);
  }

  /**
   * bind editor events
   * @private
   * @override
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this._eventManager.listen('focus', () => this.hide());
    this._eventManager.listen('closeAllPopup', () => this.hide());
    this._eventManager.listen(PopupDropdownToolbar.OPEN_EVENT, () => {
      const isShown = this.isShow();
      this._eventManager.emit('closeAllPopup');
      if (!isShown) {
        this.show();
      }

      // to give toolbar element enough width before the calculation
      this.$el.css({
        left: '-1000px'
      });
      const $button = this._$button;
      const position = $button.position();
      const buttonOuterHeightWithMargin = $button.outerHeight(true);
      const buttonMarginBottom = (buttonOuterHeightWithMargin - $button.outerHeight()) / 2;
      const top = position.top + buttonOuterHeightWithMargin - buttonMarginBottom;
      const left = position.left + $button.outerWidth(true) - this.$el.outerWidth(true);

      this.$el.css({
        top,
        left
      });
    });
  }
}

export default PopupDropdownToolbar;
