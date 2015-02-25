/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * Action
 * @exports Action
 * @extends {}
 * @constructor
 * @class
 */
function Action(options) {
    this.$editorEl = options.$editorEl;
    this.contentChangeTOID = null;

    this._bindKeyEvent();
}


Action.prototype._bindKeyEvent = function() {
    var commandManager = this.base.commandManager,
        self = this;

    this.$editorEl.on('keydown', function(ev) {
        if (ev.which === 13) {
            commandManager.run('newLine');
        }

        if (ev.which < 37 || ev.which > 40) {
            self._contentChange();
        }
    });
};

Action.prototype._contentChange = function() {
    var self = this;

    if (this.contentChangeTOID) {
        clearTimeout(this.contentChangeTOID);
    }

    this.contentChangeTOID = setTimeout(function() {
        self.base.eventManager.emit('contentChange');
    }, 500);
};

module.exports = Action;