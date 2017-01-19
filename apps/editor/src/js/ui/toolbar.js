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
 * @param {Button} buttons 버튼
 * @param {Number} index 버튼위치 (optional)
 */
Toolbar.prototype.addButton = function(buttons, index) {
    const TOOLBAR_GROUP_CLASS_NAME = 'tui-toolbar-button-group';
    const $buttonWrap = $(`<div class="${TOOLBAR_GROUP_CLASS_NAME}"></div>`);

    if (util.isArray(buttons)) {
        util.forEach(buttons, button => {
            $buttonWrap.append(this._setButton(button).$el);
        });
    } else {
        $buttonWrap.append(this._setButton(buttons).$el);
    }

    if (index) {
        this.$buttonContainer.find(`.${TOOLBAR_GROUP_CLASS_NAME}`).eq(index - 1).after($buttonWrap);
    } else {
        this.$buttonContainer.append($buttonWrap);
    }
};

/**
 * 버튼에 이벤트 바인딩
 * @param {Button} button 버튼
 * @returns {Button}
 */
Toolbar.prototype._setButton = function(button) {
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

    return button;
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

    this.addButton([
        new Button({
            className: 'tui-bold',
            command: 'Bold',
            tooltip: i18n.get('Bold'),
            state: 'bold'
        }),
        new Button({
            className: 'tui-italic',
            command: 'Italic',
            tooltip: i18n.get('Italic'),
            state: 'italic'
        }),
        new Button({
            className: 'tui-strike',
            command: 'Strike',
            text: '~',
            tooltip: i18n.get('Strike'),
            state: 'strike'
        })
    ]);

    this.addButton([
        new Button({
            className: 'tui-ul',
            command: 'UL',
            tooltip: i18n.get('Unordered list')
        }),
        new Button({
            className: 'tui-ol',
            command: 'OL',
            tooltip: i18n.get('Ordered list')
        }),
        new Button({
            className: 'tui-task',
            command: 'Task',
            tooltip: i18n.get('Task')
        })
    ]);

    this.addButton([
        new Button({
            className: 'tui-hrline',
            command: 'HR',
            tooltip: i18n.get('Line')
        }),
        new Button({
            className: 'tui-table',
            event: 'openPopupAddTable',
            tooltip: i18n.get('Insert table')
        })
    ]);

    this.addButton([
        new Button({
            className: 'tui-image',
            event: 'openPopupAddImage',
            tooltip: i18n.get('Insert image')
        }),
        new Button({
            className: 'tui-link',
            event: 'openPopupAddLink',
            tooltip: i18n.get('Insert link')
        })
    ]);

    this.addButton(new Button({
        className: 'tui-quote',
        command: 'Blockquote',
        tooltip: i18n.get('Blockquote'),
        state: 'quote'
    }));

    this.addButton([
        new Button({
            className: 'tui-codeblock',
            command: 'CodeBlock',
            text: 'CB',
            tooltip: i18n.get('Insert codeblock'),
            state: 'codeBlock'
        }),
        new Button({
            className: 'tui-code',
            command: 'Code',
            tooltip: i18n.get('Code'),
            state: 'code'
        })
    ]);

    this.eventManager.listen('stateChange', ev => {
        util.forEach(this.buttons, button => {
            if (button.state) {
                if (ev[button.state]) {
                    button.$el.addClass('active');
                } else {
                    button.$el.removeClass('active');
                }
            }
        });
    });
};

module.exports = Toolbar;
