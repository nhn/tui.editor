/**
 * @fileoverview Implements Command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';

/**
 * Class Command
 * @param {string} name Command name
 * @param {number} type Command type (Command.TYPE)
 * @param {Array.<string>} [keyMap] keyMap
 * @ignore
 */
class Command {
  constructor(name, type, keyMap) {
    this.name = name;
    this.type = type;

    if (keyMap) {
      this.setKeyMap(keyMap);
    }
  }

  /**
   * returns Name of command
   * @returns {string} Command Name
   */
  getName() {
    return this.name;
  }

  /**
   * returns Type of command
   * @returns {number} Command Command type number
   */
  getType() {
    return this.type;
  }

  /**
   * returns whether Command Type is Markdown or not
   * @returns {boolean} result
   */
  isMDType() {
    return this.type === Command.TYPE.MD;
  }

  /**
   * returns whether Command Type is Wysiwyg or not
   * @returns {boolean} result
   */
  isWWType() {
    return this.type === Command.TYPE.WW;
  }

  /**
   * returns whether Command Type is Global or not
   * @returns {boolean} result
   */
  isGlobalType() {
    return this.type === Command.TYPE.GB;
  }

  /**
   * Set keymap value for each os
   * @param {string} win Windows Key(and etc)
   * @param {string} mac Mac osx key
   */
  setKeyMap(win, mac) {
    this.keyMap = [win, mac];
  }
}

/**
 * Command factory method
 * @param {string} typeStr Editor type name
 * @param {object} props Property
 *     @param {string} props.name Command name
 *     @param {number} props.type Command type number
 * @returns {Command}
 * @static
 */
Command.factory = function(typeStr, props) {
  let type;

  if (typeStr === 'markdown') {
    type = Command.TYPE.MD;
  } else if (typeStr === 'wysiwyg') {
    type = Command.TYPE.WW;
  } else if (typeStr === 'global') {
    type = Command.TYPE.GB;
  }

  const command = new Command(props.name, type);

  extend(command, props);

  return command;
};

/**
 * Command Type Constant
 * markdown : 0
 * wysiwyg : 1
 * global : 2
 * @type {object}
 * @private
 */
Command.TYPE = {
  MD: 0,
  WW: 1,
  GB: 2
};

export default Command;
