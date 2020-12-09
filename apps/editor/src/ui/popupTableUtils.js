/**
 * @fileoverview Implements PopupTableUtils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';
import css from 'tui-code-snippet/domUtil/css';
import hasClass from 'tui-code-snippet/domUtil/hasClass';
import isString from 'tui-code-snippet/type/isString';

import LayerPopup from './layerpopup';
import i18n from '../i18n/i18n';
import domUtils from '../utils/dom';

export const REMOVE_ROW_MENU_CLASS_NAME = 'te-table-remove-row';
export const DISABLED_MENU_CLASS_NAME = 'te-context-menu-disabled';

const tableCommandMap = {
  'add-row-up': 'addRowToUp',
  'add-row-down': 'addRowToDown',
  'add-col-left': 'addColumnToLeft',
  'add-col-right': 'addColumnToRight',
  'remove-col': 'removeColumn',
  'col-align-left': ['alignColumn', { align: 'left' }],
  'col-align-center': ['alignColumn', { align: 'center' }],
  'col-align-right': ['alignColumn', { align: 'right' }],
  'remove-table': 'removeTable'
};

/**
 * PopupTableUtils
 * It implements table utils popup
 * @param {LayerPopupOption} options - layer popup options
 */
class PopupTableUtils extends LayerPopup {
  constructor(options) {
    // @TODO change class name of template
    const POPUP_CONTENT = `
      <button type="button" data-table-command-type="add-row-up">${i18n.get(
        'Add row to up'
      )}</button>
      <button type="button" data-table-command-type="add-row-down">${i18n.get(
        'Add row to down'
      )}</button>
      <button type="button" class="te-table-remove-row" data-table-command-type="remove-row">${i18n.get(
        'Remove row'
      )}</button>
      <hr/>
      <button type="button" data-table-command-type="add-col-left">${i18n.get(
        'Add column to left'
      )}</button>
      <button type="button" data-table-command-type="add-col-right">${i18n.get(
        'Add column to right'
      )}</button>
      <button type="button" data-table-command-type="remove-col">${i18n.get(
        'Remove column'
      )}</button>
      <hr/>
      <button type="button" data-table-command-type="col-align-left">${i18n.get(
        'Align column to left'
      )}</button>
      <button type="button" data-table-command-type="col-align-center">${i18n.get(
        'Align column to center'
      )}</button>
      <button type="button" data-table-command-type="col-align-right">${i18n.get(
        'Align column to right'
      )}</button>
      <hr/>
      <button type="button" data-table-command-type="remove-table">${i18n.get(
        'Remove table'
      )}</button>
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
    this.eventEmitter = options.eventEmitter;
  }

  /**
   * bind DOM events
   * @private
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('click', ({ target }) => {
      const commandType = target.dataset.tableCommandType;

      console.log(target.dataset);

      if (commandType) {
        const commandInfo = tableCommandMap[commandType];

        if (!commandInfo) {
          return;
        }

        let command = commandInfo;
        let payload = null;

        if (!isString(commandInfo)) {
          command = commandInfo[0];
          payload = commandInfo[1];
        }

        this.eventEmitter.emit('command', { type: 'wysiwyg', command }, payload);
      }

      this.hide();
    });

    this._bindClickEventOnRemoveRowMenu();
  }

  /**
   * bind editor events
   * @private
   * @override
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this.eventEmitter.listen('focus', () => this.hide());
    this.eventEmitter.listen('mousedown', () => this.hide());
    this.eventEmitter.listen('closeAllPopup', () => this.hide());
    this.eventEmitter.listen('openPopupTableUtils', ev => {
      const { left, top } = this.el.parentNode.getBoundingClientRect();

      this._disableRemoveRowMenu(ev.target);

      css(this.el, {
        position: 'absolute',
        top: `${ev.clientY - top + 5}px`, // beside mouse pointer
        left: `${ev.clientX - left + 10}px`
      });
      this.eventEmitter.emit('closeAllPopup');
      this.show();
    });
  }

  _bindClickEventOnRemoveRowMenu() {
    this.on(`click .${REMOVE_ROW_MENU_CLASS_NAME}`, ev => {
      const { target } = ev;

      if (hasClass(target, DISABLED_MENU_CLASS_NAME)) {
        ev.preventDefault();
      } else {
        this.eventEmitter.emit('command', { type: 'wysiwyg', command: 'removeRow' });
      }
    });
  }

  _disableRemoveRowMenu(target) {
    const menu = this.el.querySelector(`.${REMOVE_ROW_MENU_CLASS_NAME}`);

    domUtils.toggleClass(menu, DISABLED_MENU_CLASS_NAME, target.nodeName === 'TH');
  }
}

export default PopupTableUtils;
