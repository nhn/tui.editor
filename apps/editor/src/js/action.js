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

    this._isComposing = 0;

    this._bindKeyEvent();
    this.observeContent();
}


Action.prototype._bindKeyEvent = function() {
    var self = this,
        $editorEl = this.editor.$editorEl;

    $editorEl.on('keydown', function(ev) {
        if (ev.which === 13) {
            //ev.preventDefault();
            console.log("enter뙇!");
            //self.editor.newLine();
        }
    });

    $editorEl.on('copy', function() {
        console.log('on: copy!!');
    });

    $editorEl.on('paste', function() {
        console.log('on: paste!!');
    });

    $editorEl.on('compositionstart', function() {
        self._isComposing += 1;
        console.log('on: compositionstart!!', self._isComposing);
    });

    $editorEl.on('compositionend', function() {
        setTimeout(function(){
            self._isComposing-=1;
            console.log('on: compositionend!!', self._isComposing);
        }, 0);
    });
};

Action.prototype._contentChanged = function() {
    this.editor.contentChanged();
};

Action.prototype.stopObserveContent = function() {
    this._mo.disconnect();
    this.isOberserveContent = false;
};

Action.prototype.observeContent = function() {
    var editorEl = this.editor.$editorEl[0];

    this.isOberserveContent = true;
    this._mo = this._mo || new MutationObserver(this._contentChanged.bind(this));
    this._mo.observe(editorEl, {
        childList: true,
        //attributes: true,
        characterData: true,
        subtree: true
    });
};

Action.prototype.destroy = function() {
    this.stopObserveContent();
};

Action.prototype.isComposing = function() {
    return this._isComposing > 0;
};

module.exports = Action;
