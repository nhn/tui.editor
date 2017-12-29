/**
 * @fileoverview Implements PopupTableUtils
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import LayerPopup from './layerpopup';
import i18n from '../i18n';

/**
 * PopupTableUtils
 * It implements table utils popup
 * @extends {LayerPopup}
 */
class PopupTableUtils extends LayerPopup {
  /**
   * Creates an instance of PopupTableUtils.
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupTableUtils
   */
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
   * @memberof PopupTableUtils
   * @protected
   * @override
   */
  _initInstance(options) {
    super._initInstance(options);
    this.eventManager = options.eventManager;
  }

  /**
   * bind DOM events
   * @memberof PopupTableUtils
   * @protected
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('click .te-table-add-row', () => this.eventManager.emit('command', 'AddRow'));
    this.on('click .te-table-add-col', () => this.eventManager.emit('command', 'AddCol'));
    this.on('click .te-table-remove-row', () => this.eventManager.emit('command', 'RemoveRow'));
    this.on('click .te-table-col-align-left', () => this.eventManager.emit('command', 'AlignCol', 'left'));
    this.on('click .te-table-col-align-center', () => this.eventManager.emit('command', 'AlignCol', 'center'));
    this.on('click .te-table-col-align-right', () => this.eventManager.emit('command', 'AlignCol', 'right'));
    this.on('click .te-table-remove-col', () => this.eventManager.emit('command', 'RemoveCol'));
    this.on('click .te-table-remove', () => this.eventManager.emit('command', 'RemoveTable'));
  }

  /**
   * bind editor events
   * @memberof PopupTableUtils
   * @protected
   * @abstract
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this.eventManager.listen('focus', () => this.hide());
    this.eventManager.listen('mousedown', () => this.hide());
    this.eventManager.listen('closeAllPopup', () => this.hide());

    this.eventManager.listen('openPopupTableUtils', event => {
      const offset = this.$el.parent().offset();
      const x = event.clientX - offset.left;
      const y = event.clientY - offset.top + $(window).scrollTop();

      this.eventManager.emit('closeAllPopup');

      this.$el.css({
        position: 'absolute',
        top: y + 5, // beside mouse pointer
        left: x + 10
      });

      this.show();
    });
  }
}

export default PopupTableUtils;
