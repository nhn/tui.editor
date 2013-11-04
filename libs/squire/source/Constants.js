/*global doc, navigator */
/*jshint strict:false */

var DOCUMENT_POSITION_PRECEDING = 2; // Node.DOCUMENT_POSITION_PRECEDING
var ELEMENT_NODE = 1;                // Node.ELEMENT_NODE;
var TEXT_NODE = 3;                   // Node.TEXT_NODE;
var SHOW_ELEMENT = 1;                // NodeFilter.SHOW_ELEMENT;
var SHOW_TEXT = 4;                   // NodeFilter.SHOW_TEXT;
var FILTER_ACCEPT = 1;               // NodeFilter.FILTER_ACCEPT;
var FILTER_SKIP = 3;                 // NodeFilter.FILTER_SKIP;

var START_TO_START = 0; // Range.START_TO_START
var START_TO_END = 1;   // Range.START_TO_END
var END_TO_END = 2;     // Range.END_TO_END
var END_TO_START = 3;   // Range.END_TO_START

var win = doc.defaultView;

var ua = navigator.userAgent;

var isIOS = /iP(?:ad|hone|od)/.test( ua );
var isMac = /Mac OS X/.test( ua );

var isGecko = /Gecko\//.test( ua );
var isIE8or9or10 = /Trident\/[456]\./.test( ua );
var isIE8 = ( win.ie === 8 );
var isOpera = !!win.opera;
var isWebKit = /WebKit\//.test( ua );

var ctrlKey = isMac ? 'meta-' : 'ctrl-';

var useTextFixer = isIE8or9or10 || isOpera;
var cantFocusEmptyTextNodes = isIE8or9or10 || isWebKit;
var losesSelectionOnBlur = isIE8or9or10;
var hasBuggySplit = ( function () {
    var div = doc.createElement( 'div' ),
        text = doc.createTextNode( '12' );
    div.appendChild( text );
    text.splitText( 2 );
    return div.childNodes.length !== 2;
}() );

// Use [^ \t\r\n] instead of \S so that nbsp does not count as white-space
var notWS = /[^ \t\r\n]/;

var indexOf = Array.prototype.indexOf;
