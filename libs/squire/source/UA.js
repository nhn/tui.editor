/* Copyright © 2011-2012 by Neil Jenkins. Licensed under the MIT license. */

/*global navigator, window */

var UA = (function ( win ) {

    "use strict";

    var ua = navigator.userAgent;
    var isOpera = !!win.opera;
    var isIE = /Trident\//.test( ua );
    var isWebKit = /WebKit\//.test( ua );

    return {
        // Browser sniffing. Unfortunately necessary.
        isOpera: isOpera,
        isIE8: ( win.ie === 8 ),
        isIE: isIE,
        isGecko: /Gecko\//.test( ua ),
        isWebKit: isWebKit,
        isIOS: /iP(?:ad|hone|od)/.test( ua ),

        // Browser quirks
        useTextFixer: isIE || isOpera,
        cantFocusEmptyTextNodes: isIE || isWebKit,
        losesSelectionOnBlur: isIE
    };

})( window );
