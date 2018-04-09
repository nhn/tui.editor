/**
 * @fileoverview implements DefaultToolbar
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import ResizeObserver from 'resize-observer-polyfill';

import i18n from '../i18n';
import Toolbar from './toolbar';
import PopupDropdownToolbar from './popupDropdownToolbar';
import ToolbarItemFactory from './toolbarItemFactory';

const MORE_BUTTON_NAME = 'more';

/**
 * default toolbar
 * @extends Toolbar
 */
class DefaultToolbar extends Toolbar {
  /**
   * more button
   * @memberof DefaultToolbar
   * @private
   * @type {ToolbarButton}
   */
  _moreButton;

  /**
   * popup dropdown toolbar
   * @memberof DefaultToolbar
   * @private
   * @type {PopupDropdownToolbar}
   */
  _popupDropdownToolbar;

  /**
   * resize observer
   * @memberof DefaultToolbar
   * @private
   * @type {ResizeObserver}
   */
  _observer;

  constructor(eventManager, options) {
    super(eventManager, options);

    this._init(eventManager);
    this._bindWidthChangedEvent();
  }

  _init(eventManager) {
    const moreButton = ToolbarItemFactory.create('button', {
      name: MORE_BUTTON_NAME,
      className: 'tui-more',
      tooltip: i18n.get('More'),
      event: PopupDropdownToolbar.OPEN_EVENT
    });
    this._moreButton = moreButton;
    this.addItem(moreButton);

    this._popupDropdownToolbar = new PopupDropdownToolbar({
      $target: this.$el,
      eventManager,
      $button: moreButton.$el
    });
  }

  _bindWidthChangedEvent() {
    this._observer = new ResizeObserver(() => this._balanceButtons());
    this._observer.observe(this.$el.get(0));
  }

  _balanceButtons() {
    let dropDownToolbarItems = this._popupDropdownToolbar.getItems();
    dropDownToolbarItems.forEach(item => {
      this._popupDropdownToolbar.removeItem(item, false);
      this.addItem(item);
    });

    this.removeItem(this._moreButton, false);
    this.insertItem(0, this._moreButton);

    const toolbarHeight = this.$el.height();
    const defaultToolbarItems = this.getItems();
    const overflowItems = defaultToolbarItems.filter(item => {
      return item.$el.position().top > toolbarHeight;
    });

    overflowItems.forEach(item => {
      this.removeItem(item, false);
      this._popupDropdownToolbar.addItem(item);
    });

    this._arrangeMoreButton();
  }

  _arrangeMoreButton() {
    this.removeItem(this._moreButton, false);

    const hasOverflow = this._popupDropdownToolbar.getItems().length > 0;
    if (hasOverflow) {
      this.addItem(this._moreButton);
    }
  }

  /**
   * destroy
   * @override
   */
  destroy() {
    if (this._observer) {
      this._observer.disconnect();
    }
  }
}

export default DefaultToolbar;
