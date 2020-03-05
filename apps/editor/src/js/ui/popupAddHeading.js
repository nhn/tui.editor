/**
 * @fileoverview Implements PopupAddHeading
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';
import css from 'tui-code-snippet/domUtil/css';

import LayerPopup from './layerpopup';
import i18n from '../i18n';
import domUtils from '../utils/dom';

/**
 * Class PopupAddHeading
 * It implements Popup to add headings
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */
class PopupAddHeading extends LayerPopup {
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

    options = extend(
      {
        header: false,
        className: 'te-heading-add',
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

    this._eventManager = options.eventManager;
    this._button = options.button;
  }

  /**
   * bind DOM events
   * @private
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('click li', ev => {
      const li = domUtils.closest(ev.target, 'li');

      this._eventManager.emit(
        'command',
        li.getAttribute('data-type'),
        li.getAttribute('data-value')
      );
    });
  }

  /**
   * bind editor events
   * @private
   * @override
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this._eventManager.listen('focus', this.hide.bind(this));
    this._eventManager.listen('closeAllPopup', this.hide.bind(this));
    this._eventManager.listen('openHeadingSelect', () => {
      const button = this._button;
      const { offsetTop, offsetLeft } = button;

      css(this.el, {
        top: `${offsetTop + domUtils.getOuterHeight(button)}px`,
        left: `${offsetLeft}px`
      });

      this._eventManager.emit('closeAllPopup');
      this.show();
    });
  }
}

export default PopupAddHeading;
