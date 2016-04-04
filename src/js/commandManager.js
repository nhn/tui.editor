/**
 * @fileoverview Implements CommandManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

var Command = require('./command');

var isMac = /Mac/.test(navigator.platform),
    KEYMAP_OS_INDEX = isMac ? 1 : 0;

/**
 * CommandManager
 * @exports CommandManager
 * @constructor
 * @class
 * @param {NEditor} base ned인스턴스
 */
function CommandManager(base) {
    this._command = new util.Map();
    this._mdCommand = new util.Map();
    this._wwCommand = new util.Map();
    this.base = base;

    this.keyMapCommand = {};

    this._initEvent();
}

/**
 * addCommand
 * 커맨드를 추가한다.
 * @param {Command} command 커맨드객체
 * @returns {Command} 커맨드
 */
CommandManager.prototype.addCommand = function(command) {
    var name,
        commandBase;

    if (arguments.length === 2) {
        command = CommandManager.command(arguments[0], arguments[1]);
    }

    name = command.getName();

    if (command.isMDType()) {
        commandBase = this._mdCommand;
    } else if (command.isWWType()) {
        commandBase = this._wwCommand;
    } else if (command.isGlobalType()) {
        commandBase = this._command;
    }

    commandBase.set(name, command);

    if (command.keyMap) {
        this.keyMapCommand[command.keyMap[KEYMAP_OS_INDEX]] = name;
    }

    return command;
};


/**
 * _initEvent
 * Bind event handler to eventManager
 */
CommandManager.prototype._initEvent = function() {
    var self = this;

    this.base.eventManager.listen('command', function() {
        self.exec.apply(self, arguments);
    });

    this.base.eventManager.listen('keyMap', function(ev) {
        var command = self.keyMapCommand[ev.keyMap];

        if (command) {
            ev.data.preventDefault();
            self.exec(command);
        }
    });
};

/**
 * 커맨드를 실행한다
 * @param {String} name 커맨드명
 * @returns {*} 커맨드를 수행한후 리턴값
 */
CommandManager.prototype.exec = function(name) {
    var commandToRun, result,
        context = this.base,
        args = util.toArray(arguments);

    args.shift();

    commandToRun = this._command.get(name);

    if (!commandToRun) {
        if (this.base.isMarkdownMode()) {
            commandToRun = this._mdCommand.get(name);
            context = this.base.mdEditor;
        } else {
            commandToRun = this._wwCommand.get(name);
            context = this.base.wwEditor;
        }
    }

    if (commandToRun) {
        args.unshift(context);
        result = commandToRun.exec.apply(commandToRun, args);
    }

    return result;
};

CommandManager.command = function(type, props) {
    var command;

    command = Command.factory(type, props.name, props.keyMap);

    util.extend(command, props);

    return command;
};


module.exports = CommandManager;
