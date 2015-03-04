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
    this.editor = options.editor;

    this._mo = null;
    this.isOberserveContent = false;

    this._bindKeyEvent();
    this.observeContent();
}


Action.prototype._bindKeyEvent = function() {
    var self = this,
        $editorEl = this.editor.$editorEl;

    $editorEl.on('keydown', function(ev) {
        if (ev.which === 13) {
            ev.preventDefault();
            self.editor.newLine();
        }
    });

    $editorEl.on('copy', function() {
        console.log('on: copy!!');
    });

    $editorEl.on('paste', function() {
        console.log('on: paste!!');
    });
};

Action.prototype._contentChanged = function() {
    if (this.isOberserveContent) {
        this.editor.contentChanged();
    }
};

Action.prototype.stopObserveContent = function() {
    this.isOberserveContent = false;
    this._mo.disconnect();
};

Action.prototype.observeContent = function() {
    var editorEl = this.editor.$editorEl[0];

    this._mo = this._mo || new MutationObserver(this._contentChanged.bind(this));
    this._mo.observe(editorEl, {
        childList: true,
        //attributes: true,
        characterData: true,
        subtree: true
    });

    this.isOberserveContent = true;
};

Action.prototype.destroy = function() {
    this.stopObserveContent();
};

module.exports = Action;
