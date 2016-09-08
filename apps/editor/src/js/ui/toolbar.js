/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import UIController from './uicontroller';
import Button from './button';
import i18n from '../i18n';

const util = tui.util;

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
    const ev = this.eventManager;

    if (!button.render) {
        button = new Button(button);
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
        tooltip: i18n.get('Headings')
    }));

    this.addButton(new Button({
        className: 'tui-bold',
        command: 'Bold',
        tooltip: i18n.get('Bold')
    }));

    this.addButton(new Button({
        className: 'tui-italic',
        command: 'Italic',
        tooltip: i18n.get('Italic')
    }));

    this.addButton(new Button({
        className: 'tui-strike',
        command: 'Strike',
        text: '~',
        tooltip: i18n.get('Strike')
    }));

    this.addButton(new Button({
        className: 'tui-hrline',
        command: 'HR',
        tooltip: i18n.get('Line')
    }));

    this.addButton(new Button({
        className: 'tui-quote',
        command: 'Blockquote',
        tooltip: i18n.get('Blockquote')
    }));

    this.addButton(new Button({
        className: 'tui-ul',
        command: 'UL',
        tooltip: i18n.get('Unordered list')
    }));

    this.addButton(new Button({
        className: 'tui-ol',
        command: 'OL',
        tooltip: i18n.get('Ordered list')
    }));

    this.addButton(new Button({
        className: 'tui-task',
        command: 'Task',
        tooltip: i18n.get('Task')
    }));

    this.addButton(new Button({
        className: 'tui-table',
        event: 'openPopupAddTable',
        tooltip: i18n.get('Insert table')
    }));

    this.addButton(new Button({
        className: 'tui-link',
        event: 'openPopupAddLink',
        tooltip: i18n.get('Insert link')
    }));

    this.addButton(new Button({
        className: 'tui-codeblock',
        command: 'CodeBlock',
        text: 'CB',
        tooltip: i18n.get('Insert codeblock')
    }));

    this.addButton(new Button({
        className: 'tui-code',
        command: 'Code',
        tooltip: i18n.get('Code')
    }));

    this.addButton(new Button({
        className: 'tui-image',
        event: 'openPopupAddImage',
        tooltip: i18n.get('Insert image')
    }));
};

module.exports = Toolbar;
