/**
 * @fileoverview tab버튼 UI를 그리는 객체가 정의되어 있다
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var UIController = require('./uicontroller');
var buttonTmpl = '<button type="button" data-index="<%=index%>"><%=name%></button>';

/**
 * Tab
 * @exports Tab
 * @extends {UIController}
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {string[]} options.items 추가될 탭버튼 이름
 * @param {function} options.onItemClick 버튼이 클릭되면 실행될 핸들러 인자로 버튼이름과 jQuery이벤트가 넘어간다
 */
var Tab = UIController.extend({
    events: {
        'click button': '_onButtonClick'
    },
    init: function Tab(options) {
        UIController.call(this, {
            tagName: 'div',
            className: 'tab'
        });

        this.items = options.items;
        this.sections = options.sections;

        this._$activeButton = null;

        this.render();
        this._initItemClickEvent(options);

        this._applyInitName(options.initName);
    },
    render: function() {
        var buttonHtml;

        buttonHtml = this.template(buttonTmpl, this._getButtonData());

        this.$el.html(buttonHtml);

        this.attachEvents();
    },
    _applyInitName: function(initName) {
        if (initName) {
            this.activate(initName);
        }
    },
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
    _onButtonClick: function(ev) {
        var $button = $(ev.target);

        this._activateTabByButton($button);
    },
    _deactive: function() {
        if (this._$activeButton) {
            this._$activeButton.removeClass('active');

            if (this.sections) {
                this.sections[this._$activeButton.attr('data-index')].removeClass('active');
            }
        }
    },
    _activateButton: function($button) {
        this._$activeButton = $button;
        this._$activeButton.addClass('active');
    },
    _activateSection: function(index) {
        if (this.sections) {
            this.sections[index].addClass('active');
        }
    },
    activate: function(name) {
        var $button = this.$el.find('button:contains("' + name + '")');
        this._activateTabByButton($button);
    },
    _activateTabByButton: function($button) {
        if (this._$activeButton && this._$activeButton.text() === $button.text()) {
            return;
        }

        this._deactive();

        this._activateButton($button);
        this._activateSection($button.attr('data-index'));

        this.trigger('itemClick', $button.text());
    },
    _initItemClickEvent: function(options) {
        if (options.onItemClick) {
            this.on('itemClick', options.onItemClick);
        }
    }
});

module.exports = Tab;
