/**
 * @fileoverview Implements tab button ui
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import UIController from './uicontroller';

const CLASS_TAB_ACTIVE = 'te-tab-active';

/**
 * Class Tab
 * @extends {UIController}
 */
class Tab extends UIController {
  /**
   * Creates an instance of Tab.
   * @param {object} options - options
   *  @param {string} [options.initName] - name of the default activated button
   *  @param {string[]} options.items - Button names to be created
   *  @param {DOMElement[]} options.sections - Dom elements for tab
   *  @param {function} [options.onItemClick] - when button is clicked pass button name to function
   * @memberof Tab
   */
  constructor(options = {}) {
    super({
      tagName: 'div',
      className: 'te-tab'
    });

    this.sections = options.sections;

    this._$activeButton = null;

    this._render(options);
    this._initEvent(options);
  }

  _initEvent(options) {
    const {onItemClick} = options;
    if (onItemClick) {
      this.on('itemClick', onItemClick);
    }

    this.on('click button', this._onTabButton.bind(this));
  }

  _render(options) {
    const {items, initName} = options;
    const tabButtons = [];
    for (let i = 0, len = items.length; i < len; i += 1) {
      tabButtons.push(`<button type="button" data-index="${i}">${items[i]}</button>`);
    }
    this.$el.html(tabButtons.join(''));
    this.activate(initName);
  }

  /**
   * activate
   * Activate Section & Button
   * @param {string} name button name to activate
   */
  activate(name) {
    const $button = this.$el.find(`button:contains("${name}")`);
    this._activateTabByButton($button);
  }

  _onTabButton(ev) {
    const $button = $(ev.target);
    this._activateTabByButton($button);
    this.trigger('itemClick', $button.text());
  }

  _activateTabByButton($button) {
    if (this._isActivatedButton($button)) {
      return;
    }

    this._updateClassByButton($button);
  }

  _updateClassByButton($activeButton) {
    // deactivate previously activated button
    if (this._$activeButton) {
      const sectionIndex = this._$activeButton.attr('data-index');
      this._$activeButton.removeClass(CLASS_TAB_ACTIVE);
      if (this.sections) {
        this.sections[sectionIndex].removeClass(CLASS_TAB_ACTIVE);
      }
    }

    // activate new button
    $activeButton.addClass(CLASS_TAB_ACTIVE);
    this._$activeButton = $activeButton;
    const index = $activeButton.attr('data-index');
    if (this.sections) {
      this.sections[index].addClass(CLASS_TAB_ACTIVE);
    }
  }

  _isActivatedButton($button) {
    return this._$activeButton && this._$activeButton.text() === $button.text();
  }
}

export default Tab;
