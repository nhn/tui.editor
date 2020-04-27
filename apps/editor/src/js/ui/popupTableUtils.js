/**
 * @fileoverview Implements PopupTableUtils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';
import css from 'tui-code-snippet/domUtil/css';
import hasClass from 'tui-code-snippet/domUtil/hasClass';

import LayerPopup from './layerpopup';
import i18n from '../i18n';
import domUtils from '../utils/dom';

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

    options = extend(
      {
        header: false,
        className: 'te-popup-table-utils',
        content: POPUP_CONTENT
      },
      options
    );
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
    this.on('click .te-table-col-align-left', () =>
      this.eventManager.emit('command', 'AlignCol', 'left')
    );
    this.on('click .te-table-col-align-center', () =>
      this.eventManager.emit('command', 'AlignCol', 'center')
    );
    this.on('click .te-table-col-align-right', () =>
      this.eventManager.emit('command', 'AlignCol', 'right')
    );
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
      const { left, top } = this.el.parentNode.getBoundingClientRect();

      this._disableRemoveRowMenu(ev.target);

      css(this.el, {
        position: 'absolute',
        top: `${ev.clientY - top + 5}px`, // beside mouse pointer
        left: `${ev.clientX - left + 10}px`
      });
      this.eventManager.emit('closeAllPopup');
      this.show();
    });
  }

  _bindClickEventOnRemoveRowMenu() {
    this.on(`click .${REMOVE_ROW_MENU_CLASS_NAME}`, ev => {
      const { target } = ev;

      if (hasClass(target, DISABLED_MENU_CLASS_NAME)) {
        ev.preventDefault();
      } else {
        this.eventManager.emit('command', 'RemoveRow');
      }
    });
  }

  _disableRemoveRowMenu(target) {
    const menu = this.el.querySelector(`.${REMOVE_ROW_MENU_CLASS_NAME}`);

    domUtils.toggleClass(menu, DISABLED_MENU_CLASS_NAME, target.nodeName === 'TH');
  }
}

export default PopupTableUtils;
