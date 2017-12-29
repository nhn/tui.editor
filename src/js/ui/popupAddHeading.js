/**
 * @fileoverview Implements PopupAddTable
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import LayerPopup from './layerpopup';
import i18n from '../i18n';

/**
 * Class PopupHeading
 * It implements Popup to add headings
 * @extends {LayerPopup}
 */
class PopupAddHeading extends LayerPopup {
  /**
   * Creates an instance of PopupAddHeading.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupAddHeading
   */
  constructor(options) {
    const POPUP_CONTENT = `
            <ul>
                <li data-value="1" data-type="Heading"><h1>${i18n.get('Heading')} 1</h1></li>
                <li data-value="2" data-type="Heading"><h2>${i18n.get('Heading')} 2</h2></li>
                <li data-value="3" data-type="Heading"><h3>${i18n.get('Heading')} 3</h3></li>
                <li data-value="4" data-type="Heading"><h4>${i18n.get('Heading')} 4</h4></li>
                <li data-value="5" data-type="Heading"><h5>${i18n.get('Heading')} 5</h5></li>
                <li data-value="6" data-type="Heading"><h6>${i18n.get('Heading')} 6</h6></li>
                <li data-type="Paragraph"><div>${i18n.get('Paragraph')}</div></li>
            </ul>
        `;
    options = util.extend({
      header: false,
      className: 'te-heading-add',
      content: POPUP_CONTENT
    }, options);
    super(options);
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupAddHeading
   * @protected
   * @override
   */
  _initInstance(options) {
    super._initInstance(options);

    this._eventManager = options.eventManager;
    this._$button = options.$button;
  }

  /**
   * bind DOM events
   * @memberof PopupAddHeading
   * @protected
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('click li', ev => {
      const $li = $(ev.target).closest('li');
      this._eventManager.emit('command', $li.data('type'), $li.data('value'));
    });
  }

  /**
   * bind editor events
   * @memberof PopupAddHeading
   * @protected
   * @abstract
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this._eventManager.listen('focus', this.hide.bind(this));
    this._eventManager.listen('closeAllPopup', this.hide.bind(this));
    this._eventManager.listen('openHeadingSelect', () => {
      this._eventManager.emit('closeAllPopup');

      const $button = this._$button;
      const position = $button.position();
      this.$el.css({
        top: position.top + $button.outerHeight(true),
        left: position.left
      });

      this.show();
    });
  }
}

export default PopupAddHeading;
