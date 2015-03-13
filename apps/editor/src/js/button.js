/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var UIController = require('./uicontroller');

var util = ne.util;

/**
 * Button
 * @exports Button
 * @extends {}
 * @constructor
 * @class
 */

function Button(options) {
    $.extend(options, {
        className: '',
        command: '',
        text: 'TB'
    });

    UIController.call(this, {
        tagName: 'button',
        className: options.className
    });

    this.command = options.command;
    this.text = options.text;

    this.attachEvents();
    this.render();
}

util.inherit(Button, UIController);

Button.prototype.events = {
    'click': '_onClick'
};

Button.prototype.render = function() {
    this.$el.text(this.text);
};

Button.prototype._onClick = function() {
    console.log('aewfawef');
};

module.exports = Button;