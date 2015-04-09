/**
 * @fileoverview tab버튼 UI를 그리는 객체가 정의되어 있다
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var UIController = require('./uicontroller');

var util = ne.util;

var buttonTmpl = '<button type="button"><%=name%></button>';

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
function Tab(options) {
    UIController.call(this, {
        tagName: 'div',
        className: 'tab'
    });

    this.items = options.items;

    this._onItemClick = options.onItemClick;

    this._$activeButton = null;

    this.render();
}

util.inherit(Tab, UIController);

Tab.prototype.events = {
    'click button': '_onButtonClick'
};

Tab.prototype.render = function() {
    var i,
        len,
        buttonData = [],
        html;

    for (i = 0, len = this.items.length; i < len; i += 1) {
        buttonData.push({
            name: this.items[i]
        });
    }

    html = this.template(buttonTmpl, buttonData);

    this.$el.html(html);

    this.attachEvents();
};

Tab.prototype._onButtonClick = function(ev) {
    var $button = $(ev.target);

    if (this._$activeButton && this._$activeButton.text() === $button.text()) {
        return;
    }

    this._activateButton($button);

    if (this._onItemClick) {
        this._onItemClick($button.text(), ev);
    }
};

Tab.prototype._activateButton = function($button) {
    if (this._$activeButton) {
        this._$activeButton.removeClass('active');
    }

    this._$activeButton = $button;
    this._$activeButton.addClass('active');
};

Tab.prototype.activate = function(name) {
    this.$el.find('button:contains("' + name + '")').trigger('click');
};

module.exports = Tab;
