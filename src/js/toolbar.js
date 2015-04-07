/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var UIController = require('./uicontroller'),
    Button = require('./button');

var util = ne.util;

/**
 * Toolbar
 * @exports Toolbar
 * @extends {UIController}
 * @constructor
 * @class
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {CommandManager} commandManager 커맨드 매니저
 */
function Toolbar(eventManager, commandManager) {
    UIController.call(this, {
        tagName: 'div',
        className: 'toolbar'
    });

    this.buttons = [];

    this.eventManager = eventManager;
    this.commandManager = commandManager;

    this.render();
    this._initButton();
}

util.inherit(Toolbar, UIController);

Toolbar.prototype.render = function() {
    this.$buttonContainer = this.$el;
};

/**
 * 버튼을 추가한다
 * @param {Button} button 버튼
 */
Toolbar.prototype.addButton = function(button) {
    var commandManager = this.commandManager;

    button.on('command', function(commandName) {
        commandManager.exec(commandName);
    });

    this.buttons.push(button);
    this.$buttonContainer.append(button.$el);
};

Toolbar.prototype._initButton = function() {
    this.addButton(new Button({
        className: 'bold',
        command: 'Bold',
        text: 'B'
    }));

    this.addButton(new Button({
        className: 'italic',
        command: 'Italic',
        text: 'I'
    }));

    this.addButton(new Button({
        className: 'quote',
        command: 'Blockquote',
        text: 'Q'
    }));
};

module.exports = Toolbar;
