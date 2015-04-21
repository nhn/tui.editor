/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var UIController = require('./uicontroller');

/**
 * Button
 * @exports Button
 * @extends {UIController}
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {string} options.tagName 만들 RootElement 태그네임
 * @param {string} options.className 만들어진 RootElement에 추가할 클래스
 * @param {string} options.command 클릭되면 실행될 커맨드명
 * @param {string} options.text 버튼안에 들어갈 텍스트
 * @param {string} options.style 추가적으로 적용될 CSS스타일
 */

var Button = UIController.extend({
    events: {
        'click': '_onClick'
    },
    init: function Button(options) {
        UIController.call(this, {
            tagName: 'button',
            className: options.className
        });

        this.command = options.command;
        this.text = options.text;
        this.style = options.style;

        this.render();
    },
    /**
     * Button의 모습을 그린다
     */
    render: function() {
        this.$el.text(this.text);
        this.$el.attr('type', 'button');

        if (this.style) {
            this.$el.attr('style', this.style);
        }
        this.attachEvents();
    },
    _onClick: function() {
        this.trigger('command', this.command);
    }
});

module.exports = Button;
