/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller');

var util = tui.util;

var nextTypeString = ['WYSIWYG', 'Markdown'],
    TYPE = {
        'MARKDOWN': 0,
        'WYSIWYG': 1
    };

/**
 * ModeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @exports ModeSwitch
 * @augments UIController
 * @constructor
 * @class
 * @param {number} initialType initial type of editor
 */
function ModeSwitch(initialType) {
    UIController.call(this, {
        tagName: 'div',
        className: 'modeSwitch'
    });

    this.type = util.isExisty(initialType) ? initialType : TYPE.MARKDOWN;
    this._render();
}

ModeSwitch.prototype = util.extend(
    {},
    UIController.prototype
);

ModeSwitch.prototype._render = function() {
    this.$button = $('<button class="switchButton" type="button" />');
    this._setButtonTitle();
    this.$el.append(this.$button);

    this.attachEvents({
        'click button': '_buttonClicked'
    });
};

ModeSwitch.prototype._setButtonTitle = function() {
    this.$button.text('to' + this._getNextTypeString());
};

ModeSwitch.prototype._buttonClicked = function() {
    this._switchType();
};

ModeSwitch.prototype._switchType = function() {
    var typeToSwitch = this._getNextTypeString();

    this._toggleType();
    this._setButtonTitle();

    this.trigger('modeSwitched', {
        type: this.type,
        text: typeToSwitch.toLowerCase()
    });
};

ModeSwitch.prototype._getNextTypeString = function() {
    return nextTypeString[this.type];
};

ModeSwitch.prototype._toggleType = function() {
    this.type = this.type === TYPE.MARKDOWN ? TYPE.WYSIWYG : TYPE.MARKDOWN;
};

ModeSwitch.TYPE = TYPE;

module.exports = ModeSwitch;
