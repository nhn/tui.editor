/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller'),
    Button = require('./button'),
    ToggleButton = require('./toggleButton');

var util = tui.util;

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
        className: 'tui-editor-defaultUI-toolbar'
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
 * @param {Number} index 버튼위치 (optional)
 */
Toolbar.prototype.addButton = function(button, index) {
    var ev = this.eventManager;

    if (!button.render) {
        if (!util.isArray(button)) {
            button = new Button(button);
        } else {
            button = new ToggleButton(button);
        }
    }

    button.on('command', function emitCommandEvent($, commandName) {
        ev.emit('command', commandName);
    });

    button.on('event', function emitEventByCommand($, eventName) {
        ev.emit(eventName);
    });

    this.buttons.push(button);

    if (index) {
        this.$buttonContainer.find('button').eq(index - 1).after(button.$el);
    } else {
        this.$buttonContainer.append(button.$el);
    }
};

/**
 * 필요한 버튼들을 추가한다.
 */
Toolbar.prototype._initButton = function() {
    this.addButton(new Button({
        className: 'tui-heading',
        event: 'openHeadingSelect',
        tooltip: '제목크기'
    }));

    this.addButton(new Button({
        className: 'tui-bold',
        command: 'Bold',
        tooltip: '굵게'
    }));

    this.addButton(new Button({
        className: 'tui-italic',
        command: 'Italic',
        tooltip: '기울임꼴'
    }));

    this.addButton(new Button({
        className: 'tui-hrline',
        command: 'HR',
        tooltip: '문단나눔'
    }));

    this.addButton(new Button({
        className: 'tui-quote',
        command: 'Blockquote',
        tooltip: '인용구'
    }));

    this.addButton(new Button({
        className: 'tui-ul',
        command: 'UL',
        tooltip: '글머리 기호'
    }));

    this.addButton(new Button({
        className: 'tui-ol',
        command: 'OL',
        tooltip: '번호 매기기'
    }));

    this.addButton(new Button({
        className: 'tui-task',
        command: 'Task',
        tooltip: '체크박스'
    }));

    this.addButton(new Button({
        className: 'tui-table',
        event: 'openPopupAddTable',
        tooltip: '표 삽입'
    }));

    this.addButton(new Button({
        className: 'tui-link',
        event: 'openPopupAddLink',
        tooltip: '링크 삽입'
    }));

    this.addButton(new Button({
        className: 'tui-image',
        event: 'openPopupAddImage',
        tooltip: '이미지 삽입'
    }));
};

module.exports = Toolbar;
