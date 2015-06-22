/*jshint strict:false, undef:false, unused:false */

var DOCUMENT_POSITION_PRECEDING = 2; // Node.DOCUMENT_POSITION_PRECEDING
var ELEMENT_NODE = 1;                // Node.ELEMENT_NODE;
var TEXT_NODE = 3;                   // Node.TEXT_NODE;
var DOCUMENT_FRAGMENT_NODE = 11;     // Node.DOCUMENT_FRAGMENT_NODE;
var SHOW_ELEMENT = 1;                // NodeFilter.SHOW_ELEMENT;
var SHOW_TEXT = 4;                   // NodeFilter.SHOW_TEXT;

var START_TO_START = 0; // Range.START_TO_START
var START_TO_END = 1;   // Range.START_TO_END
var END_TO_END = 2;     // Range.END_TO_END
var END_TO_START = 3;   // Range.END_TO_START

var ZWS = '\u200B';

var win = doc.defaultView;

var ua = navigator.userAgent;

var isIOS = /iP(?:ad|hone|od)/.test( ua );
var isMac = /Mac OS X/.test( ua );

var isGecko = /Gecko\//.test( ua );
var isIElt11 = /Trident\/[456]\./.test( ua );
var isPresto = !!win.opera;
var isWebKit = /WebKit\//.test( ua );

var ctrlKey = isMac ? 'meta-' : 'ctrl-';

var useTextFixer = isIElt11 || isPresto;
var cantFocusEmptyTextNodes = isIElt11 || isWebKit;
var losesSelectionOnBlur = isIElt11;

var canObserveMutations = typeof MutationObserver !== 'undefined';

// Use [^ \t\r\n] instead of \S so that nbsp does not count as white-space
var notWS = /[^ \t\r\n]/;

var indexOf = Array.prototype.indexOf;

// Polyfill for FF3.5
if ( !Object.create ) {
    Object.create = function ( proto ) {
        var F = function () {};
        F.prototype = proto;
        return new F();
    };
}
