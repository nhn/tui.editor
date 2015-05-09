/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var UIController = require('./uicontroller');

var util = ne.util;

/**
 * EditorTypeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @exports EditorTypeSwitch
 * @extends {UIController}
 * @constructor
 * @class
 * @param {EventManager} eventManager 이벤트 매니저
 */
var EditorTypeSwitch = UIController.extend({
    events: {
        'click button': '_buttonClicked'
    },
    nextTypeString: ['WYSIWYG', 'Markdown'],
    init: function(eventManager, initialType) {
        UIController.call(this, {
            tagName: 'div',
            className: 'editorTypeSwitch'
        });

        this.eventManager = eventManager;
        this.type = util.isExisty(initialType) ? initialType : EditorTypeSwitch.TYPE.MARKDOWN;
        this._render();
    },
    _render: function() {
        this.$button = $('<button class="switchButton" />');
        this._setButtonTitle();
        this.$el.append(this.$button);

        this.attachEvents();
    },
    _setButtonTitle: function() {
        this.$button.text('to' + this._getNextTypeString());
    },
    _buttonClicked: function() {
        this._switchType();
    },
    _switchType: function() {
        var typeToSwitch = this._getNextTypeString();

        this._toggleType();
        this._setButtonTitle();
        this.eventManager.emit('editorTypeSwitched', this.type, typeToSwitch);
    },
    _getNextTypeString: function() {
        return this.nextTypeString[this.type];
    },
    _toggleType: function() {
        this.type = this.type === EditorTypeSwitch.TYPE.MARKDOWN ? EditorTypeSwitch.TYPE.WYSIWYG : EditorTypeSwitch.TYPE.MARKDOWN;
    }
});

EditorTypeSwitch.TYPE = {
    'MARKDOWN': 0,
    'WYSIWYG': 1
};

module.exports = EditorTypeSwitch;
