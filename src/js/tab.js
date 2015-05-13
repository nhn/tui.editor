/**
 * @fileoverview tab버튼 UI를 그리는 객체가 정의되어 있다
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var UIController = require('./uiController');

var util = ne.util;

var buttonTmpl = '<button type="button" data-index="<%=index%>"><%=name%></button>';

/**
 * Tab
 * @exports Tab
 * @extends {UIController}
 * @constructor
 * @class
 * @example
 * var tab = new Tab({
 *     items: ['Editor', 'Preview'],
 *     sections: [this.$mdEditorContainerEl, this.$previewEl]
 * });
 */
var Tab = UIController.extend(/** @lends Tab.prototype */{
    /**
     * events for tab
     */
    events: {
        'click button': '_onButtonClick'
    },

    /**
     * init
     * initialize object
     * @param {object} options options
     * @param {string[]} options.items Button names to be created
     * @param {DOMElement[]} options.sections Dom elements for tab
     * @param {function} options.onItemClick when button is clicked pass button name to function
     */
    init: function Tab(options) {
        UIController.call(this, {
            tagName: 'div',
            className: 'tab'
        });

        options = util.extend({}, options);

        this.items = options.items;
        this.sections = options.sections;

        this._$activeButton = null;

        this.render();
        this._initItemClickEvent(options.onItemClick);

        this._applyInitName(options.initName);
    },

    /**
     * render
     * render UI
     */
    render: function() {
        var buttonHtml;

        buttonHtml = this.template(buttonTmpl, this._getButtonData());

        this.$el.html(buttonHtml);

        this.attachEvents();
    },

    /**
     * _applyInitName
     * Apply initial section by button item name
     * @param {string} initName Button name to activate
     */
    _applyInitName: function(initName) {
        if (initName) {
            this.activate(initName);
        }
    },

    /**
     * _getButtonData
     * Make button data by this.items
     * @return {object[]} Button data
     */
    _getButtonData: function() {
        var buttonData = [],
            i,
            len;

        for (i = 0, len = this.items.length; i < len; i += 1) {
            buttonData.push({
                name: this.items[i],
                index: i
            });
        }

        return buttonData;
    },

    /**
     * _onButtonClick
     * Button click handler
     * @param {event} ev Event object
     */
    _onButtonClick: function(ev) {
        var $button = $(ev.target);

        this._activateTabByButton($button);
    },

    /**
     * _deactivate
     * Deactive active section and button
     */
    _deactivate: function() {
        if (this._$activeButton) {
            this._$activeButton.removeClass('active');

            if (this.sections) {
                this.sections[this._$activeButton.attr('data-index')].removeClass('active');
            }
        }
    },

    /**
     * _activateButton
     * Activate button
     * @param {jQuery} $button button to activate
     */
    _activateButton: function($button) {
        this._$activeButton = $button;
        this._$activeButton.addClass('active');
    },

    /**
     * _activateSection
     * Activate Section
     * @param {number} index Section index to activate
     */
    _activateSection: function(index) {
        if (this.sections) {
            this.sections[index].addClass('active');
        }
    },

    /**
     * activate
     * Activate Section & Button
     * @param {string} name button name to activate
     */
    activate: function(name) {
        var $button = this.$el.find('button:contains("' + name + '")');
        this._activateTabByButton($button);
    },

    /**
     * _activateTabByButton
     * Activate tab section by button
     * @param {jQuery} $button button to activate
     */
    _activateTabByButton: function($button) {
        if (this._isActivatedButton($button)) {
            return;
        }

        this._deactivate();

        this._activateButton($button);
        this._activateSection($button.attr('data-index'));

        this.trigger('itemClick', $button.text());
    },

    /**
     * _isActivatedButton
     * Check passed button is activated
     * @param {jQuery} $button Button to check
     * @return {boolean} result
     */
    _isActivatedButton: function($button) {
        return this._$activeButton && this._$activeButton.text() === $button.text();
    },

    /**
     * _initItemClickEvent
     * Initialize itemClick event handler
     * @param {function} handler Function to invoke when button is clicked
     */
    _initItemClickEvent: function(handler) {
        if (handler) {
            this.on('itemClick', handler);
        }
    }
});

module.exports = Tab;
