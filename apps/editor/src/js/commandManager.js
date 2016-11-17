/**
 * @fileoverview Implements CommandManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import Command from './command';

const util = tui.util;

const isMac = /Mac/.test(navigator.platform);
const KEYMAP_OS_INDEX = isMac ? 1 : 0;

/**
 * CommandManager
 * @exports CommandManager
 * @class
 */
class CommandManager {
    /**
     * @param {ToastUIEditor} base nedInstance
     */
    constructor(base) {
        this._command = new util.Map();
        this._mdCommand = new util.Map();
        this._wwCommand = new util.Map();
        this.base = base;

        this.keyMapCommand = {};

        this._initEvent();
    }
    /**
     * Add command
     * @api
     * @memberOf CommandManager
     * @param {Command} command Command instance
     * @returns {Command} Command
     */
    addCommand(command, ...args) {
        if (args.length) {
            command = CommandManager.command(command, ...args);
        }

        const name = command.getName();

        let commandBase;

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
    }

    /**
     * _initEvent
     * Bind event handler to eventManager
     * @private
     * @memberOf CommandManager
     */
    _initEvent() {
        this.base.eventManager.listen('command', (...args) => {
            this.exec(...args);
        });

        this.base.eventManager.listen('keyMap', ev => {
            const command = this.keyMapCommand[ev.keyMap];

            if (command) {
                ev.data.preventDefault();
                this.exec(command);
            }
        });
    }

    /**
     * Execute command
     * @api
     * @memberOf CommandManager
     * @param {String} name Command name
     * @returns {*}
     */
    exec(name, ...args) {
        let commandToRun, result;
        let context = this.base;

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
            result = commandToRun.exec(...args);
        }

        return result;
    }
}

/**
 * Create command by given editor type and property object
 * @api
 * @memberOf ComponentManager
 * @param {string} type Command type
 * @param {{name: string, keyMap: object}} props Property
 * @returns {*}
 */
CommandManager.command = function(type, props) {
    const command = Command.factory(type, props.name, props.keyMap);

    util.extend(command, props);

    return command;
};

module.exports = CommandManager;
