/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var EditorTypeSwitch = require('./editorTypeSwitch');

var util = ne.util,
    CodeMirror = window.CodeMirror;

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
    this.typeStatus = EditorTypeSwitch.TYPE.MARKDOWN;

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
        name = command.getName();

    if (command.isMDType()) {
        this._addCMCommand(name, responder, command.keyMap);
        this._mdCommand.set(name, function() {
            var args = [base.getCodeMirror()].concat(util.toArray(arguments));
            return responder.apply(null, args);
        });

        this._mdCommand.set(name, responder);
    } else if (command.isWWType()) {
        this._wwCommand.set(name, responder);
    } else if (command.isGlobalType()) {
        this._command.set(name, responder);
    }
};


/**
 * _initEvent
 * Bind event handler to eventManager
 */
CommandManager.prototype._initEvent = function() {
    var self = this;

    this.base.eventManager.listen('editorTypeSwitched', function(type) {
        self.typeStatus = type;
    });

    this.base.eventManager.listen('command', function() {
        self.exec.apply(self, arguments);
    });
};

/**
 * _addCMCommand
 * Add command to codemirror for use its keyMap system
 * @param {string} name Command Name
 * @param {function} fn Command responder
 * @param {array} keyMap keyMap array
 */
CommandManager.prototype._addCMCommand = function(name, fn, keyMap) {
    if (!CodeMirror.commands[name]) {
        CodeMirror.commands[name] = fn;

        if (keyMap) {
            CodeMirror.keyMap.pcDefault[keyMap[0]] = name;
            CodeMirror.keyMap.macDefault[keyMap[1]] = name;
        }
    }
};

/**
 * 커맨드를 실행한다
 * @param {String} name 커맨드명
 * @returns {*} 커맨드를 수행한후 리턴값
 */
CommandManager.prototype.exec = function(name) {
    var command = this._command.get(name),
        mdCommand = this._mdCommand.get(name),
        wwCommand = this._wwCommand.get(name),
        args = util.toArray(arguments);

    args.shift();

    if (command) {
        return command();
    }

    if (this.typeStatus === EditorTypeSwitch.TYPE.MARKDOWN && mdCommand) {
        args = [this.base.getCodeMirror()].concat(args);
        return mdCommand.apply(null, args);
    } else if (this.typeStatus === EditorTypeSwitch.TYPE.WYSIWYG && wwCommand) {
        args = [this.base.getSquire()].concat(args);
        return wwCommand.apply(null, args);
    }
};

module.exports = CommandManager;

