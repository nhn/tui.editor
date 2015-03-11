/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * Extension
 * @exports Extension
 * @extends {}
 * @constructor
 * @class
 */
function Extension(name, target) {
    this.name = name;
    this.editor = target;
}

Extension.prototype.addCommand = function(commandOptions) {
    this.commandManager.addCommand(commandOptions);
};

Extension.prototype.action = function() {
    var commandManager = this.commandManager;
    commandManager.action.apply(this.commandManager, arguments);
};

Extension.prototype.remove = function() {

};

module.exports = Extension;