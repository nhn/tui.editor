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
 */
function Toolbar(eventManager) {
    UIController.call(this, {
        tagName: 'div',
        className: 'toolbar'
    });

    this.buttons = [];

    this.eventManager = eventManager;

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
    var ev = this.eventManager;

    button.on('command', function($, commandName) {
        ev.emit('command', commandName);
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

    this.addButton(new Button({
        className: 'heading',
        command: 'Heading',
        text: 'HH'
    }));

    this.addButton(new Button({
        className: 'hrline',
        command: 'HR',
        text: 'HR'
    }));

    this.addButton(new Button({
        className: 'link',
        text: 'link'
    }));
};

module.exports = Toolbar;
