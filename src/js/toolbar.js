/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller'),
    Button = require('./button');

var util = ne.util;

/**
 * Toolbar
 * @exports Toolbar
 * @augments UIController
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

Toolbar.prototype = util.extend(
    {},
    UIController.prototype
);

/**
 * render
 * Render toolbar
 */
Toolbar.prototype.render = function() {
    this.$buttonContainer = this.$el;
};

/**
 * 버튼을 추가한다
 * @param {Button} button 버튼
 */
Toolbar.prototype.addButton = function(button) {
    var ev = this.eventManager;

    button.on('command', function emitCommandEvent($, commandName) {
        ev.emit('command', commandName);
    });

    button.on('event', function emitEventByCommand($, eventName) {
        ev.emit(eventName);
    });

    this.buttons.push(button);
    this.$buttonContainer.append(button.$el);
};

/**
 * 필요한 버튼들을 추가한다.
 */
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
        event: 'openPopupAddLink',
        text: 'A'
    }));

    this.addButton(new Button({
        className: 'image',
        event: 'openPopupAddImage',
        text: 'IMG'
    }));

    this.addButton(new Button({
        className: 'ul',
        command: 'UL',
        text: 'UL'
    }));

    this.addButton(new Button({
        className: 'ol',
        command: 'OL',
        text: 'OL'
    }));

    this.addButton(new Button({
        className: 'task',
        command: 'Task',
        text: 'TASK'
    }));
};

module.exports = Toolbar;
