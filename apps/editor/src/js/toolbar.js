/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var UIController = require('./uicontroller'),
    Button = require('./button');

var util = ne.util;

var tmpl = '<p><%=title%></p><div class="buttons"></div>';

/**
 * Toolbar
 * @exports Toolbar
 * @extends {UIController}
 * @constructor
 * @class
 * @param {object} options 옵션
 */
function Toolbar($container, eventManager, commandManager) {
    UIController.call(this, {
        tagName: 'div',
        className: 'toolBar'
    });

    this.buttons = [];

    this.$container = $container;
    this.eventManager = eventManager;
    this.commandManager = commandManager;

    this.render();
    this._initButton();
}

util.inherit(Toolbar, UIController);

Toolbar.prototype.render = function() {
    this.$el.append(this.template(tmpl, {title: 'toolbuttons'}));
    this.$buttonContainer = this.$el.find('.buttons');
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
        className: 'boldButton',
        command: 'Bold',
        text: 'B'
    }));
};

module.exports = Toolbar;
