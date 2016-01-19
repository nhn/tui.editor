/**
 * @fileoverview Implements KeyMapper
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var SPECIAL_KEY_CHAR = {
    27: 'ESC',
    38: 'UP',
    40: 'DOWN',
    13: 'ENTER',
    9: 'TAB',
    8: 'BACK',
    32: 'SPACE'
};

/**
 * KeyMapper
 * @exports KeyMapper
 * @augments
 * @constructor
 * @class
 * @param {object} options options
 * @param {string} options.splitter splitter string default is +
 */
function KeyMapper(options) {
    this._setSplitter(options);
}

KeyMapper.prototype._setSplitter = function(options) {
    var splitter = options ? options.splitter : '+';
    this._splitter = splitter;
};

KeyMapper.prototype.convert = function(event) {
    var keyMap = [];

    if (event.shiftKey) {
        keyMap.push('SHIFT');
    }

    if (event.ctrlKey) {
        keyMap.push('CTRL');
    }

    if (event.metaKey) {
        keyMap.push('META');
    }

    if (event.altKey) {
        keyMap.push('ALT');
    }

    if (event.keyCode) {
        keyMap.push(this._getKeyCodeChar(event.keyCode));
    }

    return keyMap.join(this._splitter);
};

KeyMapper.prototype._getKeyCodeChar = function(keyCode) {
    var keyCodeChar;

    keyCodeChar = this._getSpecialKeyChar(keyCode);

    if (!keyCodeChar) {
        keyCodeChar = String.fromCharCode(keyCode);
    }

    return keyCodeChar;
};

KeyMapper.prototype._getSpecialKeyChar = function(keyCode) {
    return SPECIAL_KEY_CHAR[keyCode];
};

module.exports = KeyMapper;
