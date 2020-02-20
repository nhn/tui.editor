/**
 * @fileoverview Implements ui mode switch
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import isExisty from 'tui-code-snippet/type/isExisty';
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import UIController from './uicontroller';
import i18n from '../i18n';

const MARKDOWN = 'markdown';
const WYSIWYG = 'wysiwyg';

/**
 * Class ModeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @param {HTMLElement} rootElement - root element
 * @param {string} initialType - initial type of editor
 */
class ModeSwitch extends UIController {
  /**
   * mode switch type
   * @property {string} MARKDOWN - Markdown
   * @property {string} WYSIWYG - WYSIWYG
   * @static
   * @ignore
   */
  static TYPE = {
    MARKDOWN,
    WYSIWYG
  };

  /**
   * mode switch buttons
   * @type {Object}
   * @private
   */
  _buttons = {};

  /**
   * current mode
   * @type {String}
   * @private
   */
  _type;

  /**
   * root element
   * @type {HTMLElement}
   * @private
   */
  _rootElement;

  constructor(rootElement, initialType) {
    super({
      tagName: 'div',
      className: 'te-mode-switch'
    });

    this._render(rootElement);
    this._switchType(isExisty(initialType) ? initialType : MARKDOWN);
  }

  /**
   * is the switch tab bar shown
   * @returns {Boolean} - showing status
   */
  isShown() {
    return this._rootElement.style.display === 'block';
  }

  /**
   * show switch tab bar
   */
  show() {
    css(this._rootElement, { display: 'block' });
  }

  /**
   * hide switch tab bar
   */
  hide() {
    css(this._rootElement, { display: 'none' });
  }

  _render(rootElement) {
    const createButton = (className, value) => {
      const button = document.createElement('button');

      button.className = `te-switch-button ${className}`;
      button.innerHTML = value;

      return button;
    };

    this._buttons.markdown = createButton('markdown', `${i18n.get('Markdown')}`);
    this._buttons.wysiwyg = createButton('wysiwyg', `${i18n.get('WYSIWYG')}`);

    this.$el.appendChild(this._buttons.markdown);
    this.$el.appendChild(this._buttons.wysiwyg);

    if (rootElement) {
      rootElement.appendChild(this.$el);
      this._rootElement = rootElement;
    }

    this.on('click .markdown', this._changeMarkdown.bind(this));
    this.on('click .wysiwyg', this._changeWysiwyg.bind(this));

    this.show();
  }

  _changeMarkdown() {
    this._switchType(MARKDOWN);
  }

  _changeWysiwyg() {
    this._switchType(WYSIWYG);
  }

  _setActiveButton(type) {
    removeClass(this._buttons.markdown, 'active');
    removeClass(this._buttons.wysiwyg, 'active');
    addClass(this._buttons[`${type}`], 'active');
  }

  _switchType(type) {
    if (this._type === type) {
      return;
    }

    this._type = type;
    this._setActiveButton(type);
    this.trigger('modeSwitched', this._type);
  }
}

export default ModeSwitch;
