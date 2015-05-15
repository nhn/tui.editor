/**
 * @fileoverview Implemnts WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Command = require('./command');

var util = ne.util;

/**
 * WysiwygCommand
 * It implements Wysiwyg Command
 * @exports WysiwygCommand
 * @augments Command
 * @constructor
 * @class
 * @param {string} name Command Name
 */
function WysiwygCommand(name) {
    Command.call(this, name, Command.TYPE.WW);
}

WysiwygCommand.prototype = util.extend(
    {},
    Command.prototype
);

/**
 * setup
 * Set current base and codemirror context
 * @param {Squire} editor Squire instance
 */
WysiwygCommand.prototype.setup = function(editor) {
    this.editor = editor;
};

WysiwygCommand.factory = function(props) {
    var wc = new WysiwygCommand(props.name);

    util.extend(wc, props);

    return wc;
};

module.exports = WysiwygCommand;
