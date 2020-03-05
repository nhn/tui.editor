/**
 * @fileoverview Implements CommandManager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';

import Command from './command';
import { isMac } from './utils/common';
import Map from './utils/map';

const KEYMAP_OS_INDEX = isMac ? 1 : 0;

/**
 * Class CommandManager
 * @param {ToastUIEditor} base nedInstance
 * @param {object} [options={}] - option object
 *     @param {boolean} [options.useCommandShortcut=true] - execute command with keyMap
 * @ignore
 */
class CommandManager {
  constructor(base, options = {}) {
    this._command = new Map();
    this._mdCommand = new Map();
    this._wwCommand = new Map();
    this._options = extend(
      {
        useCommandShortcut: true
      },
      options
    );

    this.base = base;

    this.keyMapCommand = {};

    this._initEvent();
  }

  /**
   * You can change command before command addition by addCommandBefore event.
   * @param {object} command - command
   * @returns {object}
   * @private
   */
  _addCommandBefore(command) {
    const commandWrapper = { command };

    this.base.eventManager.emit('addCommandBefore', commandWrapper);

    return commandWrapper.command || command;
  }

  /**
   * Add command
   * @param {Command} command Command instance
   * @returns {Command} Command
   */
  addCommand(command, ...args) {
    if (args.length) {
      command = CommandManager.command(command, ...args);
    }

    command = this._addCommandBefore(command);

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
   */
  _initEvent() {
    this.base.eventManager.listen('command', (...args) => {
      this.exec(...args);
    });

    this.base.eventManager.listen('keyMap', ev => {
      if (!this._options.useCommandShortcut) {
        return;
      }
      const command = this.keyMapCommand[ev.keyMap];

      if (command) {
        ev.data.preventDefault();
        this.exec(command);
      }
    });
  }

  /**
   * Execute command
   * @param {String} name Command name
   * @param {*} ...args Command argument
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
 * @param {string} type Command type
 * @param {{name: string, keyMap: Array}} props Property
 * @returns {*}
 * @static
 */
CommandManager.command = function(type, props) {
  const command = Command.factory(type, props.name, props.keyMap);

  extend(command, props);

  return command;
};

export default CommandManager;
