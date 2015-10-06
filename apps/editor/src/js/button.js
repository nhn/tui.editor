/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */
'use strict';

var UIController = require('./uicontroller');

var util = ne.util;

/**
 * Button
 * initialize button
 * @exports Button
 * @augments UIController
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {string} options.className 만들어진 RootElement에 추가할 클래스
 * @param {string} options.command 클릭되면 실행될 커맨드명
 * @param {string} options.text 버튼안에 들어갈 텍스트
 * @param {string} options.style 추가적으로 적용될 CSS스타일
 */
function Button(options) {
    UIController.call(this, {
        tagName: 'button',
        className: options.className
    });

    this._setOptions(options);

    this.render();

    this.attachEvents({
        'click': '_onClick'
    });
}

Button.prototype = util.extend(
    {},
    UIController.prototype
);

Button.prototype._setOptions = function(options) {
    this.command = options.command;
    this.event = options.event;
    this.text = options.text;
    this.style = options.style;
};

/**
 * Button의 모습을 그린다
 */
Button.prototype.render = function() {
    this.$el.text(this.text);
    this.$el.attr('type', 'button');

    if (this.style) {
        this.$el.attr('style', this.style);
    }
};

/**
 * _onClick
 * Click event handler
 */
Button.prototype._onClick = function() {
    if (this.command) {
        this.trigger('command', this.command);
    } else {
        this.trigger('event', this.event);
    }

    this.trigger('clicked');
};

module.exports = Button;
