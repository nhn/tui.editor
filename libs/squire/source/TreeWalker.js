/* Copyright © 2011-2012 by Neil Jenkins. Licensed under the MIT license. */

( function ( doc ) {

/*global document, window */

"use strict";

// ---

var needsReplacement = !doc.createTreeWalker;

// IE9 sometimes throws errors when calling TreeWalker#nextNode or
// TreeWalker#previousNode. No way to feature detect this.
if ( window.ie === 9 ) {
    needsReplacement = true;
}

// Feature detect Opera bug in TreeWalker#previousNode
if ( !needsReplacement ) {
    ( function () {
    var div = doc.createElement( 'div' ),
        text = doc.createTextNode( '' );

    div.appendChild( text );

    var div1 = div.cloneNode( true ),
        div2 = div.cloneNode( true ),
        div3 = div.cloneNode( true ),
        walker = doc.createTreeWalker( div, 1, function ( node ) {
            return 1;
        }, false );
    div.appendChild( div1 );
    div.appendChild( div2 );
    div.appendChild( div3 );
    walker.currentNode = div3;
    if ( walker.previousNode() !== div2 ) {
        needsReplacement = true;
    }
    }() );
}

if ( !needsReplacement ) { return; }

// ---

var typeToBitArray = {
    // ELEMENT_NODE
    1: 1,
    // ATTRIBUTE_NODE
    2: 2,
    // TEXT_NODE
    3: 4,
    // COMMENT_NODE
    8: 128,
    // DOCUMENT_NODE
    9: 256,
    // DOCUMENT_FRAGMENT_NODE
    11: 1024
};

var FILTER_ACCEPT = 1;

var TreeWalker = function ( root, nodeType, filter ) {
    this.root = this.currentNode = root;
    this.nodeType = nodeType;
    this.filter = filter;
};

TreeWalker.prototype.nextNode = function () {
    var current = this.currentNode,
        root = this.root,
        nodeType = this.nodeType,
        filter = this.filter,
        node;
    while ( true ) {
        node = current.firstChild;
        while ( !node && current ) {
            if ( current === root ) {
                break;
            }
            node = current.nextSibling;
            if ( !node ) { current = current.parentNode; }
        }
        if ( !node ) {
            return null;
        }
        if ( ( typeToBitArray[ node.nodeType ] & nodeType ) &&
                filter( node ) === FILTER_ACCEPT ) {
            this.currentNode = node;
            return node;
        }
        current = node;
    }
};

TreeWalker.prototype.previousNode = function () {
    var current = this.currentNode,
        root = this.root,
        nodeType = this.nodeType,
        filter = this.filter,
        node;
    while ( true ) {
        if ( current === root ) {
            return null;
        }
        node = current.previousSibling;
        if ( node ) {
            while ( current = node.lastChild ) {
                node = current;
            }
        } else {
            node = current.parentNode;
        }
        if ( !node ) {
            return null;
        }
        if ( ( typeToBitArray[ node.nodeType ] & nodeType ) &&
                filter( node ) === FILTER_ACCEPT ) {
            this.currentNode = node;
            return node;
        }
        current = node;
    }
};

doc.createTreeWalker = function ( root, nodeType, filter ) {
    return new TreeWalker( root, nodeType, filter );
};

}( document ) );