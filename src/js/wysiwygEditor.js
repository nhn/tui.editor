/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var Squire = window.Squire;

/**
 * WysiwygEditor
 * @exports WysiwygEditor
 * @extends {}
 * @constructor
 * @class
 * @param {jQuery} $el 에디터가 들어갈 엘리먼트
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {commandManager} commandManager 커맨드 매니저
 */
function WysiwygEditor($el, eventManager, commandManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;
}


WysiwygEditor.prototype.init = function(initialValue) {
    var editor;
    var iframe = document.createElement( 'iframe' );

    iframe.addEventListener( 'load', function () {
        // Make sure we're in standards mode.
        var doc = iframe.contentDocument;
        if ( doc.compatMode !== 'CSS1Compat' ) {
            doc.open();
            doc.write( '<!DOCTYPE html><title></title>' );
            doc.close();
        }
        // doc.close() can cause a re-entrant load event in some browsers,
        // such as IE9.
        if ( editor ) {
            return;
        }
        // Create Squire instance
        editor = new Squire( doc );
        // Add styles to frame
        var style = doc.createElement( 'style' );
        style.type = 'text/css';
        style.textContent = document.getElementById( 'editorStyles' ).textContent;
        doc.querySelector( 'head' ).appendChild( style );
    }, false );

    this.$editorContainerEl.append(iframe);
};


module.exports = WysiwygEditor;

