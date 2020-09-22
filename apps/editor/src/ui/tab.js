/**
 * @fileoverview Implements tab button ui
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import UIController from './uicontroller';
import domUtils from '../utils/dom';

const CLASS_TAB_ACTIVE = 'te-tab-active';

/**
 * Class Tab
 * @param {object} options - options
 *     @param {string} [options.initName] - name of the default activated button
 *     @param {string[]} options.items - button names to be created
 *     @param {DOMElement[]} options.sections - dom elements for tab
 *     @param {function} [options.onItemClick] - when button is clicked pass button name to function
 * @ignore
 */
class Tab extends UIController {
  constructor(options = {}) {
    super({
      tagName: 'div',
      className: 'te-tab'
    });

    this.sections = options.sections;

    this._activeButton = null;

    this._render(options);
    this._initEvent(options);
  }

  _initEvent(options) {
    const { onItemClick } = options;

    if (onItemClick) {
      this.on('itemClick', onItemClick);
    }

    this.on('click button', this._onTabButton.bind(this));
  }

  _render(options) {
    const { items, initName } = options;
    const tabButtons = [];

    for (let i = 0, len = items.length; i < len; i += 1) {
      tabButtons.push(`<button type="button" data-index="${i}">${items[i]}</button>`);
    }
    this.el.innerHTML = tabButtons.join('');
    this.activate(initName);
  }

  _findButtonContained(element, selector, text) {
    return domUtils
      .findAll(element, selector)
      .filter(node => new RegExp(text).test(node.textContent));
  }

  /**
   * Activate section & button
   * @param {string} name button name to activate
   */
  activate(name) {
    const [button] = this._findButtonContained(this.el, 'button', name);

    this._activateTabByButton(button);
  }

  _onTabButton(ev) {
    const button = ev.target;

    this._activateTabByButton(button);
    this.trigger('itemClick', button.textContent);
  }

  _activateTabByButton(button) {
    if (this._isActivatedButton(button)) {
      return;
    }

    this._updateClassByButton(button);
  }

  _updateClassByButton(activeButton) {
    // deactivate previously activated button
    if (this._activeButton) {
      const sectionIndex = this._activeButton.getAttribute('data-index');

      removeClass(this._activeButton, CLASS_TAB_ACTIVE);

      if (this.sections) {
        removeClass(this.sections[sectionIndex], CLASS_TAB_ACTIVE);
      }
    }

    // activate new button
    addClass(activeButton, CLASS_TAB_ACTIVE);

    this._activeButton = activeButton;
    const index = activeButton.getAttribute('data-index');

    if (this.sections) {
      addClass(this.sections[index], CLASS_TAB_ACTIVE);
    }
  }

  _isActivatedButton(button) {
    return this._activeButton && this._activeButton.textContent === button.textContent;
  }
}

export default Tab;
