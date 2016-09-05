/**
 * @fileoverview tab버튼 UI를 그리는 객체가 정의되어 있다
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import UIController from './uicontroller';
import templater from './templater';

const util = tui.util;

const buttonTmpl = '<button type="button" data-index="${index}">${name}</button>';

/**
 * Tab
 * @exports Tab
 * @augments UIController
 * @constructor
 * @class
 * @param {object} options options
 * @param {string[]} options.items Button names to be created
 * @param {DOMElement[]} options.sections Dom elements for tab
 * @param {function} options.onItemClick when button is clicked pass button name to function
 * @example
 * const tab = new Tab({
 *     items: ['Editor', 'Preview'],
 *     sections: [this.$mdEditorContainerEl, this.$previewEl]
 * });
 */
function Tab(options) {
    UIController.call(this, {
        tagName: 'div',
        className: 'te-tab'
    });

    options = util.extend({}, options);

    this.items = options.items;
    this.sections = options.sections;

    this._$activeButton = null;

    this.render();
    this._initItemClickEvent(options.onItemClick);

    this._applyInitName(options.initName);
}

Tab.prototype = util.extend(
    {},
    UIController.prototype
);

/**
 * render
 * render UI
 */
Tab.prototype.render = function() {
    const buttonHtml = templater(buttonTmpl, this._getButtonData());

    this.$el.html(buttonHtml);

    this.attachEvents({
        'click button': '_onButtonClick'
    });
};

/**
 * _applyInitName
 * Apply initial section by button item name
 * @param {string} initName Button name to activate
 */
Tab.prototype._applyInitName = function(initName) {
    if (initName) {
        this.activate(initName);
    }
};

/**
 * _getButtonData
 * Make button data by this.items
 * @returns {object[]} Button data
 */
Tab.prototype._getButtonData = function() {
    const buttonData = [];

    for (let i = 0, len = this.items.length; i < len; i += 1) {
        buttonData.push({
            name: this.items[i],
            index: i
        });
    }

    return buttonData;
};

/**
 * _onButtonClick
 * Button click handler
 * @param {event} ev Event object
 */
Tab.prototype._onButtonClick = function(ev) {
    const $button = $(ev.target);
    this._activateTabByButton($button);
};

/**
 * _deactivate
 * Deactive active section and button
 */
Tab.prototype._deactivate = function() {
    if (this._$activeButton) {
        this._$activeButton.removeClass('te-tab-active');

        if (this.sections) {
            this.sections[this._$activeButton.attr('data-index')].removeClass('te-tab-active');
        }
    }
};

/**
 * _activateButton
 * Activate button
 * @param {jQuery} $button button to activate
 */
Tab.prototype._activateButton = function($button) {
    this._$activeButton = $button;
    this._$activeButton.addClass('te-tab-active');
};

/**
 * _activateSection
 * Activate Section
 * @param {number} index Section index to activate
 */
Tab.prototype._activateSection = function(index) {
    if (this.sections) {
        this.sections[index].addClass('te-tab-active');
    }
};

/**
 * activate
 * Activate Section & Button
 * @param {string} name button name to activate
 */
Tab.prototype.activate = function(name) {
    const $button = this.$el.find(`button:contains("${name}")`);
    this._activateTabByButton($button);
};

/**
 * _activateTabByButton
 * Activate tab section by button
 * @param {jQuery} $button button to activate
 */
Tab.prototype._activateTabByButton = function($button) {
    if (this._isActivatedButton($button)) {
        return;
    }

    this._deactivate();

    this._activateButton($button);
    this._activateSection($button.attr('data-index'));

    this.trigger('itemClick', $button.text());
};

/**
 * _isActivatedButton
 * Check passed button is activated
 * @param {jQuery} $button Button to check
 * @returns {boolean} result
 */
Tab.prototype._isActivatedButton = function($button) {
    return this._$activeButton && this._$activeButton.text() === $button.text();
};

/**
 * _initItemClickEvent
 * Initialize itemClick event handler
 * @param {function} handler Function to invoke when button is clicked
 */
Tab.prototype._initItemClickEvent = function(handler) {
    if (handler) {
        this.on('itemClick', handler);
    }
};

module.exports = Tab;
