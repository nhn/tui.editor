/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var util = ne.util;

/**
 * CommandManager
 * @exports CommandManager
 * @extends {}
 * @constructor
 * @class
 */
function CommandManager(base) {
    this._command = new util.HashMap();
    this._mdCommand = new util.HashMap();
    this.base = base;
}

CommandManager.prototype.addCommand = function(commandOptions) {
    var name = commandOptions.name,
        fn = commandOptions.fn,
        keyMap = commandOptions.keyMap,
        type = commandOptions.type,
        base = this.base;

    if (type === 'md') {
        this._addCMCommand(name, fn, keyMap);
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
