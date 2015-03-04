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
function CommandManager() {
    this.commands = new util.HashMap();
}

CommandManager.prototype.addCommand = function(commandOptions) {
    this.commands.set(commandOptions.name, commandOptions.method);
};

CommandManager.prototype.action = function() {
    var args = util.toArray(arguments),
        name = args.shift(),
        command = this.commands.get(name);

    if (command) {
        command.apply(null, args);
    }
};

module.exports = CommandManager;
