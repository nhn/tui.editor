/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */
'use strict';

var Button = require('./button');

var util = ne.util;

/**
 * ToggleButton
 * initialize toggle button
 * @exports ToggleButton
 * @augments Button
 * @constructor
 * @class
 * @param {object[]} options 옵션
 * @param {string} options.className 만들어진 RootElement에 추가할 클래스
 * @param {string} options.command 클릭되면 실행될 커맨드명
 * @param {string} options.text 버튼안에 들어갈 텍스트
 * @param {string} options.style 추가적으로 적용될 CSS스타일
 */
function ToggleButton(options) {
    this.options = options;
    this.current = this.options[0];

    Button.call(this, this.current);

    this._initEvent();
}

ToggleButton.prototype = util.extend(
    {},
    Button.prototype
);

ToggleButton.prototype._initEvent = function() {
    var self = this;

    this.on('clicked', function() {
        self._toggle();
    });
};

ToggleButton.prototype._toggle = function() {
    if (this.current === this.options[0]) {
        this.current = this.options[1];
    } else {
        this.current = this.options[0];
    }

    this._setOptions(this.current);
    this.render();
};

module.exports = ToggleButton;
