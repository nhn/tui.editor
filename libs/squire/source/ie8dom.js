/* Copyright © 2011 by Neil Jenkins. Licensed under the MIT license. */

( function () {

/*global window, document, Element, HTMLDocument */
/*jshint strict: false */

var doc = document;

// Add JS hook
window.ie = 8;

// Add defaultView property to document
doc.defaultView = window;

// Fake W3C events support
var translate = {
    focus: 'focusin',
    blur: 'focusout'
};

var returnTrue = function () { return true; };
var returnFalse = function () { return false; };

var toCopy = 'altKey ctrlKey metaKey shiftKey clientX clientY charCode keyCode'.split( ' ' );

var DOMEvent = function ( event ) {
    var type = event.type,
        doc = document,
        target = event.srcElement || doc,
        html = ( target.ownerDocument || doc ).documentElement,
        l = toCopy.length,
        property;

    while ( l-- ) {
        property = toCopy[l];
        this[ property ] = event[ property ];
    }

    if ( type === 'propertychange' ) {
        type = ( target.nodeName === 'INPUT' &&
                target.type !== 'text' && target.type !== 'password' ) ?
            'change' : 'input';
    }

    this.type = Object.keyOf( translate, type ) || type;
    this.target = target;
    this.pageX = event.clientX + html.scrollLeft;
    this.pageY = event.clientY + html.scrollTop;

    if ( event.button ) {
        this.button = ( event.button & 4 ? 1 :
            ( event.button & 2 ? 2 : 0 ) );
        this.which = this.button + 1;
    }

    this.relatedTarget = event.fromElement === target ?
        event.toElement : event.fromElement;
    this._event = event;
};

DOMEvent.prototype = {
    constructor: DOMEvent,
    isEvent: true,
    preventDefault: function () {
        this.isDefaultPrevented = returnTrue;
        this._event.returnValue = false;
    },
    stopPropagation: function () {
        this.isPropagationStopped = returnTrue;
        this._event.cancelBubble = true;
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse
};

// Add W3C event add/remove methods to elements and document.
[ doc, Element.prototype ].forEach(
        function ( dom ) {
    dom.addEventListener = function ( type, handler, capture ) {
        var fn = handler._ie_handleEvent || ( handler._ie_handleEvent =
                function () {
                    var event = new DOMEvent( window.event );
                    if ( typeof handler === 'object' ) {
                        handler.handleEvent( event );
                    } else {
                        handler.call( this, event );
                    }
                }
            ),
            node = /paste|cut/.test( type ) ? this.body || this : this;

        handler._ie_registeredCount = ( handler._ie_registeredCount || 0 ) + 1;

        node.attachEvent( 'on' + ( translate[ type ] || type ), fn );
    };
    dom.addEventListener.isFake = true;

    dom.removeEventListener = function ( type, handler, capture ) {
        var fn = handler._ie_handleEvent,
            node = /paste|cut/.test( type ) ? this.body || this : this;
        if ( !( handler._ie_registeredCount -= 1 ) ) {
            delete handler._ie_handleEvent;
        }
        if ( fn ) {
            node.detachEvent( 'on' + ( translate[ type ] || type ), fn );
        }
    };
    dom.removeEventListener.isFake = true;
});

// The events that we normally attach to the window object, IE8 wants on the
// body.
doc.defaultView.addEventListener = function ( type, handler, capture ) {
    return doc.addEventListener( type, handler, capture );
};

// Add textContent property to elements.
Object.defineProperty( Element.prototype, 'textContent', {
    get: function () {
        return this.innerText;
    },

    set: function ( text ) {
        this.innerText = text;
    }
});

// Add compareDocumentPosition method to elements.
Element.prototype.compareDocumentPosition = function ( b ) {
    if ( b.nodeType !== 1 ) { b = b.parentNode; }
    var a = this,
        different = ( a !== b ),
        aIndex = a.sourceIndex,
        bIndex = b.sourceIndex;

    return ( different && a.contains( b ) ? 16 : 0 ) +
        ( different && b.contains( a ) ? 8 : 0 ) +
        ( aIndex < bIndex ? 4 : 0 ) +
        ( bIndex < aIndex ? 2 : 0 );
};

// Add normalize method to document fragments
HTMLDocument.prototype.normalize = function () {
    var children = this.childNodes,
        l = children.length,
        child;

    while ( l-- ) {
        child = children[l];
        if ( child.nodeType === 1 ) {
            child.normalize();
        }
    }
};

}() );