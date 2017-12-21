/**
 * @fileoverview Implements toolbar
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import UIController from './uicontroller';
import Button from './button';
import i18n from '../i18n';

const TOOLBAR_BUTTON_CLASS_NAME = 'tui-toolbar-icons';
const TOOLBAR_DIVIDER_CLASS_NAME = 'tui-toolbar-divider';

/**
 * Class Toolbar
 * @extends {UIController}
 */
class Toolbar extends UIController {
  /**
   * Creates an instance of Toolbar.
   * @param {EventManager} eventManager - event manager
   * @memberof Toolbar
   */
  constructor(eventManager) {
    super({
      tagName: 'div',
      className: 'tui-editor-defaultUI-toolbar'
    });

    this.buttons = [];

    this.eventManager = eventManager;

    this._render();
    this._initButton(['heading', 'bold', 'italic', 'strike', '|', 'hr', 'quote', 'ul', 'ol',
      'task', '|', 'table', 'image', 'link', '|', 'code', 'codeBlock']);

    this.eventManager.listen('stateChange', ev => {
      util.forEach(this.buttons, button => {
        if (button._state) {
          if (ev[button._state]) {
            button.$el.addClass('active');
          } else {
            button.$el.removeClass('active');
          }
        }
      });
    });
  }

  /**
   * render
   * Render toolbar
   * @private
   */
  _render() {
    this.$buttonContainer = this.$el;
  }

  /**
   * add button
   * @param {Button} button - button instance
   * @param {Number} [index] - location the button will be placed
   * @memberof Toolbar
   */
  addButton(button, index) {
    if (util.isArray(button)) {
      let arrayIndex = button.length - 1;
      for (; arrayIndex >= 0; arrayIndex -= 1) {
        if (util.isNumber(index)) {
          this._addButton(button[arrayIndex], index);
        } else {
          this._addButton(button);
        }
      }
    } else {
      this._addButton(button, index);
    }
  }

  _addButton(button, index) {
    const $btn = this._setButton(button, index).$el;

    if (util.isNumber(index)) {
      this.$buttonContainer.find(`.${TOOLBAR_BUTTON_CLASS_NAME}`).eq(index - 1).before($btn);
    } else {
      this.$buttonContainer.append($btn);
    }
  }

  /**
   * add divider
   * @returns {jQuery} - created divider jquery element
   * @memberof Toolbar
   */
  addDivider() {
    const $el = $(`<div class="${TOOLBAR_DIVIDER_CLASS_NAME}"></div>`);
    this.$buttonContainer.append($el);

    return $el;
  }

  _setButton(button, index) {
    const ev = this.eventManager;
    if (!(button instanceof Button)) {
      button = new Button(button);
    }

    button.on('command', (e, commandName) => ev.emit('command', commandName));
    button.on('event', (e, eventName) => ev.emit(eventName));
    if (util.isNumber(index)) {
      this.buttons.splice(index, 0, button);
    } else {
      this.buttons.push(button);
    }

    return button;
  }

  /**
   * init button
   * @param {Array} buttonList using button list
   * @private
   */
  _initButton(buttonList) {
    this.buttonOptions = {
      heading: {
        className: 'tui-heading',
        event: 'openHeadingSelect',
        tooltip: i18n.get('Headings')
      },
      bold: {
        className: 'tui-bold',
        command: 'Bold',
        tooltip: i18n.get('Bold'),
        state: 'bold'
      },
      italic: {
        className: 'tui-italic',
        command: 'Italic',
        tooltip: i18n.get('Italic'),
        state: 'italic'
      },
      strike: {
        className: 'tui-strike',
        command: 'Strike',
        tooltip: i18n.get('Strike'),
        state: 'strike'
      },
      ul: {
        className: 'tui-ul',
        command: 'UL',
        tooltip: i18n.get('Unordered list')
      },
      ol: {
        className: 'tui-ol',
        command: 'OL',
        tooltip: i18n.get('Ordered list')
      },
      task: {
        className: 'tui-task',
        command: 'Task',
        tooltip: i18n.get('Task')
      },
      hr: {
        className: 'tui-hrline',
        command: 'HR',
        tooltip: i18n.get('Line')
      },
      table: {
        className: 'tui-table',
        event: 'openPopupAddTable',
        tooltip: i18n.get('Insert table')
      },
      image: {
        className: 'tui-image',
        event: 'openPopupAddImage',
        tooltip: i18n.get('Insert image')
      },
      link: {
        className: 'tui-link',
        event: 'openPopupAddLink',
        tooltip: i18n.get('Insert link')
      },
      quote: {
        className: 'tui-quote',
        command: 'Blockquote',
        tooltip: i18n.get('Blockquote'),
        state: 'quote'
      },
      codeBlock: {
        className: 'tui-codeblock',
        command: 'CodeBlock',
        tooltip: i18n.get('Insert CodeBlock'),
        state: 'codeBlock'
      },
      code: {
        className: 'tui-code',
        command: 'Code',
        tooltip: i18n.get('Code'),
        state: 'code'
      }
    };

    util.forEach(buttonList, buttonName => {
      if (buttonName === '|') {
        this.addDivider();
      } else if (this.buttonOptions[buttonName]) {
        this.addButton(new Button(this.buttonOptions[buttonName]));
      }
    });
  }
}

export default Toolbar;
