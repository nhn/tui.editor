/**
 * @fileoverview Implements PopupTableUtils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import LayerPopup from './layerpopup';
import i18n from '../i18n';

export const REMOVE_ROW_MENU_CLASS_NAME = 'te-table-remove-row';
export const DISABLED_MENU_CLASS_NAME = 'te-context-menu-disabled';

/**
 * PopupTableUtils
 * It implements table utils popup
 * @param {LayerPopupOption} options - layer popup options
 */
class PopupTableUtils extends LayerPopup {
  constructor(options) {
    const POPUP_CONTENT = `
            <button type="button" class="te-table-add-row">${i18n.get('Add row')}</button>
            <button type="button" class="te-table-add-col">${i18n.get('Add col')}</button>
            <button type="button" class="te-table-remove-row">${i18n.get('Remove row')}</button>
            <button type="button" class="te-table-remove-col">${i18n.get('Remove col')}</button>
            <hr/>
            <button type="button" class="te-table-col-align-left">${i18n.get('Align left')}</button>
            <button type="button" class="te-table-col-align-center">${i18n.get('Align center')}</button>
            <button type="button" class="te-table-col-align-right">${i18n.get('Align right')}</button>
            <hr/>
            <button type="button" class="te-table-remove">${i18n.get('Remove table')}</button>
        `;
    options = util.extend({
      header: false,
      className: 'te-popup-table-utils',
      content: POPUP_CONTENT
    }, options);
    super(options);
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
    this.eventManager = options.eventManager;
  }

  /**
   * bind DOM events
   * @private
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('click .te-table-add-row', () => this.eventManager.emit('command', 'AddRow'));
    this.on('click .te-table-add-col', () => this.eventManager.emit('command', 'AddCol'));
    this.on('click .te-table-col-align-left', () => this.eventManager.emit('command', 'AlignCol', 'left'));
    this.on('click .te-table-col-align-center', () => this.eventManager.emit('command', 'AlignCol', 'center'));
    this.on('click .te-table-col-align-right', () => this.eventManager.emit('command', 'AlignCol', 'right'));
    this.on('click .te-table-remove-col', () => this.eventManager.emit('command', 'RemoveCol'));
    this.on('click .te-table-remove', () => this.eventManager.emit('command', 'RemoveTable'));
    this._bindClickEventOnRemoveRowMenu();
  }

  /**
   * bind editor events
   * @private
   * @override
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this.eventManager.listen('focus', () => this.hide());
    this.eventManager.listen('mousedown', () => this.hide());
    this.eventManager.listen('closeAllPopup', () => this.hide());
    this.eventManager.listen('openPopupTableUtils', ev => {
      const offset = this.$el.parent().offset();
      const x = ev.clientX - offset.left;
      const y = ev.clientY - offset.top + $(window).scrollTop();

      this._disableRemoveRowMenu(ev.target);

      this.$el.css({
        position: 'absolute',
        top: y + 5, // beside mouse pointer
        left: x + 10
      });
      this.eventManager.emit('closeAllPopup');
      this.show();
    });
  }

  _bindClickEventOnRemoveRowMenu() {
    this.on(`click .${REMOVE_ROW_MENU_CLASS_NAME}`, ev => {
      const {target} = ev;

      if ($(target).hasClass(DISABLED_MENU_CLASS_NAME)) {
        ev.preventDefault();
      } else {
        this.eventManager.emit('command', 'RemoveRow');
      }
    });
  }

  _disableRemoveRowMenu(target) {
    const $menu = this.$el.find(`.${REMOVE_ROW_MENU_CLASS_NAME}`);

    if (target.nodeName === 'TH') {
      $menu.addClass(DISABLED_MENU_CLASS_NAME);
    } else {
      $menu.removeClass(DISABLED_MENU_CLASS_NAME);
    }
  }
}

export default PopupTableUtils;
