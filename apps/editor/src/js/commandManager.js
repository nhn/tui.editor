/**
 * @fileoverview Implements CommandManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

var Command = require('./command'),
    MarkdownCommand = require('./markdownCommand'),
    WysiwygCommand = require('./wysiwygCommand');

var TYPE = new util.Enum(['GLOBAL', 'MARKDOWN', 'WYSIWYG']);

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
    this.typeStatus = TYPE.MARKDOWN;

    this._initEvent();
}

/**
 * addCommand
 * 커맨드를 추가한다.
 * @param {Command} command 커맨드객체
 * @return {Command} 커맨드
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

    return command;
};


/**
 * _initEvent
 * Bind event handler to eventManager
 */
CommandManager.prototype._initEvent = function() {
    var self = this;

    this.base.eventManager.listen('changeEditorTypeToWysiwyg', function() {
        self.typeStatus = TYPE.WYSIWYG;
    });

    this.base.eventManager.listen('changeEditorTypeToMarkdown', function() {
        self.typeStatus = TYPE.MARKDOWN;
    });

    this.base.eventManager.listen('command', function() {
        self.exec.apply(self, arguments);
    });
};

/**
 * 커맨드를 실행한다
 * @param {String} name 커맨드명
 * @returns {*} 커맨드를 수행한후 리턴값
 */
CommandManager.prototype.exec = function(name) {
    var commandToRun,
        args = util.toArray(arguments);

    args.shift();

    commandToRun = this._command.get(name);

    if (!commandToRun) {
        if (this.typeStatus === TYPE.MARKDOWN) {
            commandToRun = this._mdCommand.get(name);
        } else if (this.typeStatus === TYPE.WYSIWYG) {
            commandToRun = this._wwCommand.get(name);
        }
    }

    if (commandToRun) {
        return commandToRun.runWithContext(this.base, args);
    }
};

CommandManager.command = function(type, props) {
    var command;

    if (type === 'markdown') {
        command = MarkdownCommand.factory(props.name);
    } else if (type === 'wysiwyg') {
        command = WysiwygCommand.factory(props.name);
    } else if (type === 'global') {
        command = Command.factory(props.name);
    }

    util.extend(command, props);

    return command;
};


module.exports = CommandManager;
