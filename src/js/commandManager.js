/**
 * @fileoverview Implements CommandManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util,
    CodeMirror = window.CodeMirror;

var TYPE = new util.Enum(['GLOBAL', 'MARKDOWN', 'WYSIWYG']);

/**
 * CommandManager
 * @exports CommandManager
 * @constructor
 * @class
 * @param {NEditor} base ned인스턴스
 */
function CommandManager(base) {
    this._command = new util.HashMap();
    this._mdCommand = new util.HashMap();
    this._wwCommand = new util.HashMap();
    this.base = base;
    this.typeStatus = TYPE.MARKDOWN;

    this._initEvent();
}

/**
 * addCommand
 * 커맨드를 추가한다.
 * @param {Command} command 커맨드객체
 */
CommandManager.prototype.addCommand = function(command) {
    var base = this.base,
        responder = command.responder,
        name = command.getName(),
        commandBase;

    if (command.isMDType()) {
        commandBase = this._mdCommand;
    } else if (command.isWWType()) {
        commandBase = this._wwCommand;
    } else if (command.isGlobalType()) {
        commandBase = this._command;
    }

    commandBase.set(name,responder);
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
        globalCommand = this._command.get(name),
        mdCommand = this._mdCommand.get(name),
        wwCommand = this._wwCommand.get(name),
        args = util.toArray(arguments);

    args.shift();

    if (globalCommand) {
        args = [this.base].concat(args);
        commandToRun = globalCommand;
    } else {
        if (this.typeStatus === TYPE.MARKDOWN && mdCommand) {
            args = [this.base.getCodeMirror()].concat(args);
            commandToRun = mdCommand;
        } else if (this.typeStatus === TYPE.WYSIWYG && wwCommand) {
            args = [this.base.getSquire()].concat(args);
            commandToRun = wwCommand;
        }
    }

    if (commandToRun) {
        return commandToRun.apply(null, args);
    }
};

module.exports = CommandManager;
