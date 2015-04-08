/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var util = ne.util,
    CodeMirror = window.CodeMirror;

/**
 * CommandManager
 * @exports CommandManager
 * @extends {}
 * @constructor
 * @class
 * @param {NEditor} base ned인스턴스
 */
function CommandManager(base) {
    this._command = new util.HashMap();
    this._mdCommand = new util.HashMap();
    this.base = base;
}

/**
 * addCommand
 * 커맨드를 추가한다.
 * @param {Command} command 커맨드객체
 */
CommandManager.prototype.addCommand = function(command) {
    var base = this.base,
        fn,
        name = command.getName();


    fn = function CommandFN() {
        command.responder.apply(command, arguments);
    };

    if (command.isMDType()) {
        this._addCMCommand(name, fn, command.keyMap);
        this._mdCommand.set(name, function() {
            return base.getCodeMirror().execCommand(name);
        });
    } else {
        this._command.set(name, fn);
    }
};

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
        mdCommand = this._mdCommand.get(name);

    //wysiwyg에디터가 추가되면 상황별로 판단하는 로직이 필요
    if (command) {
        return command(this.base);
    } else if (mdCommand) {
        return mdCommand(this.base);
    }
};

module.exports = CommandManager;
