/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller');

var util = ne.util;

var nextTypeString = ['WYSIWYG', 'Markdown'],
    TYPE = {
        'MARKDOWN': 0,
        'WYSIWYG': 1
    };

/**
 * EditorTypeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @exports EditorTypeSwitch
 * @augments UIController
 * @constructor
 * @class
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {number} initialType initial type of editor
 */
function EditorTypeSwitch(eventManager, initialType) {
    UIController.call(this, {
        tagName: 'div',
        className: 'editorTypeSwitch'
    });

    this.eventManager = eventManager;
    this.type = util.isExisty(initialType) ? initialType : TYPE.MARKDOWN;
    this._render();
}

EditorTypeSwitch.prototype = util.extend(
    {},
    UIController.prototype
);

EditorTypeSwitch.prototype._render = function() {
    this.$button = $('<button class="switchButton" />');
    this._setButtonTitle();
    this.$el.append(this.$button);

    this.attachEvents({
        'click button': '_buttonClicked'
    });
};

EditorTypeSwitch.prototype._setButtonTitle = function() {
    this.$button.text('to' + this._getNextTypeString());
};

EditorTypeSwitch.prototype._buttonClicked = function() {
    this._switchType();
};

EditorTypeSwitch.prototype._switchType = function() {
    var typeToSwitch = this._getNextTypeString();

    this._toggleType();
    this._setButtonTitle();
    this.eventManager.emit('editorTypeSwitched', this.type, typeToSwitch);
};

EditorTypeSwitch.prototype._getNextTypeString = function() {
    return nextTypeString[this.type];
};

EditorTypeSwitch.prototype._toggleType = function() {
    this.type = this.type === TYPE.MARKDOWN ? TYPE.WYSIWYG : TYPE.MARKDOWN;
};

EditorTypeSwitch.TYPE = TYPE;

module.exports = EditorTypeSwitch;
