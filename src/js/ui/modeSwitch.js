/**
 * @fileoverview Implements ui mode switch
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import UIController from './uicontroller';
import i18n from '../i18n';

const MARKDOWN = 'markdown';
const WYSIWYG = 'wysiwyg';

/**
 * Class ModeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @extends {UIController}
 */
class ModeSwitch extends UIController {
  /**
   * Creates an instance of ModeSwitch.
   * @param {string} initialType - initial type of editor
   * @memberof ModeSwitch
   */
  constructor(initialType) {
    super({
      tagName: 'div',
      className: 'te-mode-switch'
    });

    this._render();
    this._switchType(util.isExisty(initialType) ? initialType : MARKDOWN);
  }

  _render() {
    this.buttons = {};
    this.buttons.$markdown
            = $(`<button class="te-switch-button markdown" type="button">${i18n.get('Markdown')}</button>`);
    this.buttons.$wysiwyg
            = $(`<button class="te-switch-button wysiwyg" type="button">${i18n.get('WYSIWYG')}</button>`);
    this.$el.append(this.buttons.$markdown);
    this.$el.append(this.buttons.$wysiwyg);

    this.on('click .markdown', this._changeMarkdown.bind(this));
    this.on('click .wysiwyg', this._changeWysiwyg.bind(this));
  }

  _changeMarkdown() {
    this._switchType(MARKDOWN);
  }

  _changeWysiwyg() {
    this._switchType(WYSIWYG);
  }

  _setActiveButton(type) {
    this.buttons.$markdown.removeClass('active');
    this.buttons.$wysiwyg.removeClass('active');
    this.buttons[`$${type}`].addClass('active');
  }

  _switchType(type) {
    if (this.type === type) {
      return;
    }

    this.type = type;
    this._setActiveButton(type);
    this.trigger('modeSwitched', this.type);
  }
}

/**
 * @static
 * @memberof ModeSwitch
 * @property {string} MARKDOWN - markdown
 * @property {string} WYSIWYG - wysiwyg
 */
ModeSwitch.TYPE = {
  MARKDOWN,
  WYSIWYG
};

export default ModeSwitch;
