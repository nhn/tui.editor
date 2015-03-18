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
 * @param {Object} commandOptions 커맨드를 생성할 옵션들
 * @param {String} commandOptions.name 커맨드명
 * @param {Function} commandOptions.fn 커맨드펑션
 * @param {Array} commandOptions.keyMap 매핑할 키들 첫번째는 PC 두번째는 MAC
 * @param {string} commandOptions.type 커맨드 타입 입력하지않으면 기본, md입력하면 코드미러용 커맨드
 */
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
