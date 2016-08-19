/**
 * @fileoverview Implements Command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var util = tui.util;

/**
 * Command
 * It implements command to editors
 * @exports Command
 * @class Command
 * @param {string} name Command name
 * @param {number} type Command type (Command.TYPE)
 * @param {Array.<string>} [keyMap] keyMap
 */
function Command(name, type, keyMap) {
    this.name = name;
    this.type = type;

    if (keyMap) {
        this.setKeyMap(keyMap);
    }
}

/**
 * getName
 * returns Name of command
 * @api
 * @memberOf Command
 * @returns {string} Command Name
 */
Command.prototype.getName = function() {
    return this.name;
};

/**
 * getType
 * returns Type of command
 * @api
 * @memberOf Command
 * @returns {number} Command Command type number
 */
Command.prototype.getType = function() {
    return this.type;
};

/**
 * isMDType
 * returns whether Command Type is Markdown or not
 * @api
 * @memberOf Command
 * @returns {boolean} result
 */
Command.prototype.isMDType = function() {
    return this.type === Command.TYPE.MD;
};

/**
 * isWWType
 * returns whether Command Type is Wysiwyg or not
 * @api
 * @memberOf Command
 * @returns {boolean} result
 */
Command.prototype.isWWType = function() {
    return this.type === Command.TYPE.WW;
};

/**
 * isGlobalType
 * returns whether Command Type is Global or not
 * @api
 * @memberOf Command
 * @returns {boolean} result
 */
Command.prototype.isGlobalType = function() {
    return this.type === Command.TYPE.GB;
};

/**
 * setKeyMap
 * Set keymap value for each os
 * @api
 * @memberOf Command
 * @param {string} win Windows Key(and etc)
 * @param {string} mac Mac osx key
 */
Command.prototype.setKeyMap = function(win, mac) {
    this.keyMap = [win, mac];
};

/**
 * Command factory method
 * @api
 * @memberOf Command
 * @param {string} typeStr Editor type name
 * @param {object} props Property
 *     @param {string} props.name Command name
 *     @param {number} props.type Command type number
 * @returns {Command}
 */
Command.factory = function(typeStr, props) {
    var command, type;

    if (typeStr === 'markdown') {
        type = Command.TYPE.MD;
    } else if (typeStr === 'wysiwyg') {
        type = Command.TYPE.WW;
    } else if (typeStr === 'global') {
        type = Command.TYPE.GB;
    }

    command = new Command(props.name, type);

    util.extend(command, props);

    return command;
};

/**
 * Command Type Constant
 * markdown : 0
 * wysiwyg : 1
 * global : 2
 * @api
 * @memberOf Command
 * @type {object}
 */
Command.TYPE = {
    MD: 0,
    WW: 1,
    GB: 2
};

module.exports = Command;
