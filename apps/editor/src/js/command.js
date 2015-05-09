'use strict';

var util = ne.util;

/**
 * Command
 * It implements command to editors
 * @exports Command
 * @constructor
 * @class
 */
var Command = util.defineClass(/** @lends Command.prototype */{
    /**
     * initialize command
     * @param {string} name Command name
     * @param {number} type Command type (Command.TYPE)
     */
    init: function Command(name, type) {
        this.name = name;
        this.type = type;

        this.initResponder();
    },
    /**
     * getName
     * returns Name of command
     * @return {string} Command Name
     */
    getName: function() {
        return this.name;
    },
    /**
     * getType
     * returns Type of command
     * @return {number} Command Type
     */
    getType: function() {
        return this.type;
    },
    /**
     * isMDType
     * returns whether Command Type is Markdown or not
     * @return {boolean} result
     */
    isMDType: function() {
        return this.type === Command.TYPE.MD;
    },
    /**
     * isWWType
     * returns whether Command Type is Wysiwyg or not
     * @return {boolean} result
     */
    isWWType: function() {
        return this.type === Command.TYPE.WW;
    },
    /**
     * isGlobalType
     * returns whether Command Type is Global or not
     * @return {boolean} result
     */
    isGlobalType: function() {
        return this.type === Command.TYPE.GB;
    },
    /**
     * setKeyMap
     * Set keymap value for each os
     * @param {string} win window Key
     * @param {string} mac mac osx key
     */
    setKeyMap: function(win, mac) {
        this.keyMap = [];
        this.keyMap[0] = win;
        this.keyMap[1] = mac;
    },
    /**
     * _responder
     * first responder to commandManager or editor
     * @return {*} Command's return value
     */
    _responder: function() {
        if (this.setup) {
            this.setup.apply(this, arguments);
        }

        return this.exec.apply(this, arguments);
    },
    /**
     * initResponder
     * Bind command context to responder for editors
     */
    initResponder: function() {
        var self = this;

        this.responder = function() {
            return self._responder.apply(self, arguments);
        };
    }
});


/**
 * Command Type Constant
 *
 */
Command.TYPE = {
    MD: 0,
    WW: 1,
    GB: 2
};

/**
 * extend
 * for command inheritance
 * @param {object} props child properties
 * @return {*} Constructor
 */
Command.extend = function(props) {
    var Child = util.defineClass(this, props);
    Child.extend = Command.extend;
    return Child;
};

module.exports = Command;
