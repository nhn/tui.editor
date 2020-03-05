/**
 * @fileoverview Implements LayerPopup
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';
import isExisty from 'tui-code-snippet/type/isExisty';
import isString from 'tui-code-snippet/type/isString';
import addClass from 'tui-code-snippet/domUtil/addClass';
import hasClass from 'tui-code-snippet/domUtil/hasClass';
import css from 'tui-code-snippet/domUtil/css';
import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';

import UIController from './uicontroller';
import domUtils from '../utils/dom';

const CLASS_PREFIX = 'tui-popup-';
const CLASS_FIT_WINDOW = 'fit-window';

const LAYOUT_TEMPLATE_MODELESS = `<div class="${CLASS_PREFIX}header">
        <span class="${CLASS_PREFIX}title"></span>
        <div class="${CLASS_PREFIX}header-buttons">
            <button type="button" class="${CLASS_PREFIX}close-button"></button>
        </div>
    </div>
    <div class="${CLASS_PREFIX}body"></div>`;

const LAYOUT_TEMPLATE_MODAL = `<div class="${CLASS_PREFIX}wrapper">
        <div class="${CLASS_PREFIX}header">
            <span class="${CLASS_PREFIX}title"></span>
            <div class="${CLASS_PREFIX}header-buttons">
                <button type="button" class="${CLASS_PREFIX}close-button"></button>
            </div>
        </div>
        <div class="${CLASS_PREFIX}body"></div>
    </div>`;

/**
 * A number, or a string containing a number.
 * @typedef {object} LayerPopupOption
 * @property {string[]} [openerCssQuery] - Css Query list to bind clickevent that open popup
 * @property {string[]} [closerCssQuery] - Css Query list to bind clickevent that close popup
 * @property {HTMLElement} el - popup root element
 * @property {HTMLElement|string} [content] - popup content that html string or element
 * @property {string} [textContent] - popup text content
 * @property {string} title - popup title
 * @property {boolean} [header] - whether to draw header
 * @property {HTMLElement} [target] - element to append popup
 * @property {boolean} modal - true: modal, false: modeless
 * @property {string} [headerButtons] - replace header(close) button
 */

/**
 * Class LayerPopup
 * @param {LayerPopupOption} options - popup option
 */
class LayerPopup extends UIController {
  constructor(options) {
    options = extend(
      {
        header: true,
        target: document.body,
        textContent: ''
      },
      options
    );
    super({
      tagName: 'div',
      className: options.modal ? `${CLASS_PREFIX}modal-background` : `${CLASS_PREFIX}wrapper`,
      rootElement: options.el
    });

    this._clickEventMap = {};
    this._onClickCloseButton = this.hide.bind(this);

    this._initInstance(options);
    this._initDOM(options);
    this._initDOMEvent(options);
    this._initEditorEvent(options);
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   */
  _initInstance(options) {
    this._target = options.target;

    if (options.el) {
      this.el = options.el;
      this._isExternalHtmlUse = true;
    }

    if (options.content) {
      this.content = options.content;
    } else {
      this.content = options.textContent;
    }

    this.options = options;
  }

  /**
   * initialize DOM, render popup
   * @private
   */
  _initDOM() {
    this._initLayout();

    if (!this._isExternalHtmlUse) {
      if (isExisty(this.options.title)) {
        this.setTitle(this.options.title);
      }
      this.setContent(this.content);
    }

    const buttons = this.options.headerButtons;

    if (buttons) {
      const closeButtons = domUtils.findAll(this.el, `.${CLASS_PREFIX}close-button`);

      closeButtons.forEach(button => {
        domUtils.remove(button);
      });

      const buttonWrapper = this.el.querySelector(`.${CLASS_PREFIX}header-buttons`);

      domUtils.empty(buttonWrapper);
      buttonWrapper.innerHTML = buttons;
    }

    if (this.options.css) {
      css(this.el, this.options.css);
    }
  }

  /**
   * bind DOM events
   * @private
   */
  _initDOMEvent() {
    const { openerCssQuery, closerCssQuery } = this.options;
    const { body } = document;

    if (openerCssQuery) {
      domUtils.findAll(body, openerCssQuery).forEach(el => {
        const eventKey = `click.${this._id}`;

        this._clickEventMap[eventKey] = this.show.bind(this);
        on(el, 'click', this._clickEventMap[eventKey]);
      });
    }

    if (closerCssQuery) {
      domUtils.findAll(body, closerCssQuery).forEach(el => {
        const eventKey = `click.${this._id}`;

        this._clickEventMap[eventKey] = this.hide.bind(this);
        on(el, 'click', this._clickEventMap[eventKey]);
      });
    }

    this.on(`click .${CLASS_PREFIX}close-button`, this._onClickCloseButton);
  }

  /**
   * bind editor events
   * @private
   * @abstract
   */
  _initEditorEvent() {}

  _initLayout() {
    const { options } = this;

    if (!this._isExternalHtmlUse) {
      const layout = options.modal ? LAYOUT_TEMPLATE_MODAL : LAYOUT_TEMPLATE_MODELESS;

      this.el.innerHTML = layout;

      if (options.className) {
        addClass(this.el, ...options.className.split(/\s+/g));
      }
      this.hide();
      this._target.appendChild(this.el);
      this.body = this.el.querySelector(`.${CLASS_PREFIX}body`);

      if (!options.header) {
        domUtils.remove(this.el.querySelector(`.${CLASS_PREFIX}header`));
      }
    } else {
      this.hide();
      this._target.appendChild(this.el);
    }
  }

  /**
   * set popup content
   * @param {HTMLElement|string} content - content
   */
  setContent(content) {
    domUtils.empty(this.body);

    if (isString(content)) {
      this.body.innerHTML = content;
    } else {
      this.body.appendChild(content);
    }
  }

  /**
   * set title
   * @param {string} title - title text
   */
  setTitle(title) {
    const titleWrapper = this.el.querySelector(`.${CLASS_PREFIX}title`);

    domUtils.empty(titleWrapper);
    titleWrapper.innerHTML = title;
  }

  /**
   * get title element
   * @returns {HTMLElement} - title html element
   */
  getTitleElement() {
    return this.el.querySelector(`.${CLASS_PREFIX}title`);
  }

  /**
   * hide popup
   */
  hide() {
    css(this.el, { display: 'none' });
    this._isShow = false;
    this.trigger('hidden', this);
  }

  /**
   * show popup
   */
  show() {
    css(this.el, { display: 'block' });
    this._isShow = true;
    this.trigger('shown', this);
  }

  /**
   * whether this popup is visible
   * @returns {boolean} - true: shown, false: hidden
   */
  isShow() {
    return this._isShow;
  }

  /**
   * remove popup content
   */
  remove() {
    const { openerCssQuery, closerCssQuery } = this.options;
    const { body } = document;

    this.trigger('remove', this);
    this.off(`click .${CLASS_PREFIX}close-button`, this._onClickCloseButton);

    if (openerCssQuery) {
      domUtils.findAll(body, openerCssQuery).forEach(opener => {
        off(opener, 'click', this._clickEventMap[`click.${this._id}`]);
        delete this._clickEventMap[`click.${this._id}`];
      });
    }
    if (closerCssQuery) {
      domUtils.findAll(body, closerCssQuery).forEach(closer => {
        off(closer, 'click', this._clickEventMap[`click.${this._id}`]);
        delete this._clickEventMap[`click.${this._id}`];
      });
    }

    domUtils.remove(this.el);
    this.el = null;
  }

  /**
   * make popup size fit to window
   * @param {boolean} fit - true to make popup fit to window
   * @protected
   * @ignore
   */
  setFitToWindow(fit) {
    domUtils.toggleClass(this.el, CLASS_FIT_WINDOW, fit);
  }

  /**
   * make popup size fit to window
   * @returns {boolean} - true for fit to window
   * @protected
   * @ignore
   */
  isFitToWindow() {
    return hasClass(this.el, CLASS_FIT_WINDOW);
  }

  /**
   * toggle size fit to window
   * @returns {boolean} - true for fit to window
   * @protected
   * @ignore
   */
  toggleFitToWindow() {
    const fitToWindow = !this.isFitToWindow();

    this.setFitToWindow(fitToWindow);

    return fitToWindow;
  }
}

export default LayerPopup;
