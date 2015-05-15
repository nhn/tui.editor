/**
 * @fileoverview Implements Command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * Command
 * It implements command to editors
 * @exports Command
 * @constructor
 * @class
 * @param {string} name Command name
 * @param {number} type Command type (Command.TYPE)
 */
function Command(name, type) {
    this.name = name;
    this.type = type;

    this.initResponder();
}

/**
 * getName
 * returns Name of command
 * @return {string} Command Name
 */
Command.prototype.getName = function() {
    return this.name;
};

/**
 * getType
 * returns Type of command
 * @return {number} Command Type
 */
Command.prototype.getType = function() {
    return this.type;
};

/**
 * isMDType
 * returns whether Command Type is Markdown or not
 * @return {boolean} result
 */
Command.prototype.isMDType = function() {
    return this.type === Command.TYPE.MD;
};

/**
 * isWWType
 * returns whether Command Type is Wysiwyg or not
 * @return {boolean} result
 */
Command.prototype.isWWType = function() {
    return this.type === Command.TYPE.WW;
};

/**
 * isGlobalType
 * returns whether Command Type is Global or not
 * @return {boolean} result
 */
Command.prototype.isGlobalType = function() {
    return this.type === Command.TYPE.GB;
};

/**
 * setKeyMap
 * Set keymap value for each os
 * @param {string} win window Key
 * @param {string} mac mac osx key
 */
Command.prototype.setKeyMap = function(win, mac) {
    this.keyMap = [win, mac];
};

/**
 * setup
 * Must implment in subclass for change commands context
 * @virtual
 */
Command.prototype.setup = function() {
    throw new Error('must be inplemented by subclass!');
};

/**
 * _responder
 * first responder to commandManager or editor
 * @return {*} Command's return value
 */
Command.prototype._responder = function() {
    if (this.setup) {
        this.setup.apply(this, arguments);
    }

    return this.exec.apply(this, arguments);
};

/**
 * initResponder
 * Bind command context to responder for editors
 */
Command.prototype.initResponder = function() {
    var self = this;

    this.responder = function() {
        return self._responder.apply(self, arguments);
    };
};

/**
 * Command Type Constant
 */
Command.TYPE = {
    MD: 0,
    WW: 1,
    GB: 2
};

module.exports = Command;
