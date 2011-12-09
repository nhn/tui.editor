/* Copyright © 2011 by Neil Jenkins. Licensed under the MIT license. */

( function () {
    
/*global Node, Text, Element, window, document */

"use strict";

var implement = function ( constructor, props ) {
    var proto = constructor.prototype,
        prop;
    for ( prop in props ) {
        proto[ prop ] = props[ prop ];
    }
};

var every = function ( nodeList, fn ) {
    var l = nodeList.length;
    while ( l-- ) {
        if ( !fn( nodeList[l] ) ) {
            return false;
        }
    }
    return true;
};

var $False = function () { return false; };
var $True = function () { return true; };

var inlineNodeNames  = /^(?:A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:FN|EL)|EM|HR|I(?:NPUT|MG|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:U[BP]|PAN|TRONG|AMP)|U)$/;

var leafNodeNames = {
    BR: 1,
    IMG: 1,
    INPUT: 1
};

var swap = function( node, node2 ) {
    var parent = node2.parentNode;
    if ( parent ) {
        parent.replaceChild( node, node2 );
    }
    return node;
};

var ELEMENT_NODE = 1,  // Node.ELEMENT_NODE,
    TEXT_NODE = 3,     // Node.TEXT_NODE,
    SHOW_ELEMENT = 1,  // NodeFilter.SHOW_ELEMENT,
    FILTER_ACCEPT = 1, // NodeFilter.FILTER_ACCEPT,
    FILTER_SKIP = 3;   // NodeFilter.FILTER_SKIP;

var isBlock = function ( el ) {
    return el.isBlock() ? FILTER_ACCEPT : FILTER_SKIP;
};
var useTextFixer = !!( window.opera || window.ie );

implement( Node, {
    isInline: $False,
    isBlock: $False,
    isContainer: $False,
    getPath: function () {
        var parent = this.parentNode;
        return parent ? parent.getPath() : '';
    },
    detach: function () {
        var parent = this.parentNode;
        if ( parent ) {
            parent.removeChild( this );
        }
        return this;
    },
    replaceWith: function ( node ) {
        swap( node, this );
        return this;
    },
    replaces: function ( node ) {
        swap( this, node );
        return this;
    },
    nearest: function ( tag, attributes ) {
        var parent = this.parentNode;
        return parent ? parent.nearest( tag, attributes ) : null;
    },
    getPreviousBlock: function () {
        var doc = this.ownerDocument,
            walker = doc.createTreeWalker(
                doc.body, SHOW_ELEMENT, isBlock, false );
        walker.currentNode = this;
        return walker.previousNode();
    },
    getNextBlock: function () {
        var doc = this.ownerDocument,
            walker = doc.createTreeWalker(
                doc.body, SHOW_ELEMENT, isBlock, false );
        walker.currentNode = this;
        return walker.nextNode();
    },
    split: function ( node, stopNode ) {
        return node;
    },
    mergeContainers: function () {}
});

implement( Text, {
    isLeaf: $True,
    isInline: $True,
    getLength: function () {
        return this.length;
    },
    isLike: function ( node ) {
        return node.nodeType === TEXT_NODE;
    },
    split: function ( offset, stopNode ) {
        var node = this;
        if ( node === stopNode ) {
            return offset;
        }
        return node.parentNode.split( node.splitText( offset ), stopNode );
    }
});

implement( Element, {
    isLeaf: function () {
        return !!leafNodeNames[ this.nodeName ];
    },
    isInline: function () {
        return inlineNodeNames.test( this.nodeName );
    },
    isBlock: function () {
        return !this.isInline() && every( this.childNodes, function ( child ) {
            return child.isInline();
        });
    },
    isContainer: function () {
        return !this.isInline() && !this.isBlock();
    },
    getLength: function () {
        return this.childNodes.length;
    },
    getPath: function() {
        var tag = this.nodeName;
        if ( tag === 'BODY' ) {
            return tag;
        }
        var path = this.parentNode.getPath(),
            id = this.id,
            className = this.className.trim();
        
        path += '>' + tag;
        if ( id ) {
            path += '#' + id;
        }
        if ( className ) {
            className = className.split( /\s\s*/ );
            className.sort();
            path += '.';
            path += className.join( '.' );
        }
        return path;
    },
    wraps: function ( node ) {
        swap( this, node ).appendChild( node );
        return this;
    },
    empty: function () {
        var frag = this.ownerDocument.createDocumentFragment(),
            l = this.childNodes.length;
        while ( l-- ) {
            frag.appendChild( this.firstChild );
        }
        return frag;
    },
    is: function ( tag, attributes ) {
        if ( this.nodeName !== tag ) { return false; }
        var attr;
        for ( attr in attributes ) {
            if ( this.getAttribute( attr ) !== attributes[ attr ] ) {
                return false;
            }
        }
        return true;
    },
    nearest: function ( tag, attributes ) {
        var el = this;
        do {
            if ( el.is( tag, attributes ) ) {
                return el;
            }
        } while ( ( el = el.parentNode ) &&
            ( el.nodeType === ELEMENT_NODE ) );
        return null;
    },
    isLike: function ( node ) {
        return (
            node.nodeType === ELEMENT_NODE &&
            node.nodeName === this.nodeName &&
            node.className === this.className &&
            node.style.cssText === this.style.cssText
        );
    },
    mergeInlines: function ( range ) {
        var children = this.childNodes,
            l = children.length,
            frags = [],
            child, prev, len;
        while ( l-- ) {
            child = children[l];
            prev = l && children[ l - 1 ];
            if ( l && child.isInline() && child.isLike( prev ) &&
                    !leafNodeNames[ child.nodeName ] ) {
                if ( range.startContainer === child ) {
                    range.startContainer = prev;
                    range.startOffset += prev.getLength();
                }
                if ( range.endContainer === child ) {
                    range.endContainer = prev;
                    range.endOffset += prev.getLength();
                }
                if ( range.startContainer === this ) {
                    if ( range.startOffset > l ) {
                        range.startOffset -= 1;
                    }
                    else if ( range.startOffset === l ) {
                        range.startContainer = prev;
                        range.startOffset = prev.getLength();
                    }
                }
                if ( range.endContainer === this ) {
                    if ( range.endOffset > l ) {
                        range.endOffset -= 1;
                    }
                    else if ( range.endOffset === l ) {
                        range.endContainer = prev;
                        range.endOffset = prev.getLength();
                    }
                }
                child.detach();
                if ( child.nodeType === TEXT_NODE ) {
                    prev.appendData( child.data );
                }
                else {
                    frags.push( child.empty() );
                }
            }
            else if ( child.nodeType === ELEMENT_NODE ) {
                len = frags.length;
                while ( len-- ) {
                    child.appendChild( frags.pop() );
                }
                child.mergeInlines( range );
            }
        }
    },
    mergeWithBlock: function ( next, range ) {
        var block = this,
            container = next,
            last, offset, _range;
        while ( container.parentNode.childNodes.length === 1 ) {
            container = container.parentNode;
        }
        container.detach();
        
        offset = block.childNodes.length;
        
        // Remove extra <BR> fixer if present.
        last = block.lastChild;
        if ( last && last.nodeName === 'BR' ) {
            block.removeChild( last );
            offset -= 1;
        }
        
        _range = {
            startContainer: block,
            startOffset: offset,
            endContainer: block,
            endOffset: offset
        };
        
        block.appendChild( next.empty() );
        block.mergeInlines( _range );
        
        range.setStart(
            _range.startContainer, _range.startOffset );
        range.collapse( true );
        
        // Opera inserts a BR if you delete the last piece of text
        // in a block-level element. Unfortunately, it then gets
        // confused when setting the selection subsequently and
        // refuses to accept the range that finishes just before the
        // BR. Removing the BR fixes the bug.
        // Steps to reproduce bug: Type "a-b-c" (where - is return)
        // then backspace twice. The cursor goes to the top instead
        // of after "b".
        if ( window.opera && ( last = block.lastChild ) &&
                last.nodeName === 'BR' ) {
            block.removeChild( last );
        }
    },
    mergeContainers: function () {
        var prev = this.previousSibling,
            first = this.firstChild;
        if ( prev && prev.isLike( this ) && prev.isContainer() ) {
            prev.appendChild( this.detach().empty() );
            if ( first ) {
                first.mergeContainers();
            }
        }
    },
    split: function ( childNodeToSplitBefore, stopNode ) {
        var node = this;
        
        if ( typeof( childNodeToSplitBefore ) === 'number' ) {
            childNodeToSplitBefore =
                childNodeToSplitBefore < node.childNodes.length ?
                    node.childNodes[ childNodeToSplitBefore ] : null;
        }
        
        if ( node === stopNode ) {
            return childNodeToSplitBefore;
        }
        
        // Clone node without children
        var parent = node.parentNode,
            clone = node.cloneNode( false ),
            next;
        
        // Add right-hand siblings to the clone
        while ( childNodeToSplitBefore ) {
            next = childNodeToSplitBefore.nextSibling;
            clone.appendChild( childNodeToSplitBefore );
            childNodeToSplitBefore = next;
        }
        
        // DO NOT NORMALISE. This may undo the fixCursor() call
        // of a node lower down the tree!
        
        // We need something in the element in order for the cursor to appear.
        node.fixCursor();
        clone.fixCursor();
        
        // Inject clone after original node
        if ( next = node.nextSibling ) {
            parent.insertBefore( clone, next );
        } else {
            parent.appendChild( clone );
        }
        
        // Keep on splitting up the tree
        return parent.split( clone, stopNode );
    },
    fixCursor: function () {
        // In Webkit and Gecko, block level elements are collapsed and
        // unfocussable if they have no content. To remedy this, a <BR> must be
        // inserted. In Opera and IE, we just need a textnode in order for the
        // cursor to appear.
        var el = this,
            doc = el.ownerDocument,
            fixer, child;
        
        if ( el.nodeName === 'BODY' ) {
            if ( !( child = el.firstChild ) || child.nodeName === 'BR' ) {
                fixer = doc.createElement( 'DIV' );
                if ( child ) {
                    el.replaceChild( fixer, child );
                }
                else {
                    el.appendChild( fixer );
                }
                el = fixer;
                fixer = null;
            }
        }
        
        if ( el.isInline() ) {
            if ( !el.firstChild ) {
                fixer = doc.createTextNode( /* isWebkit ? '\u200B' :*/ '' );
            }
        } else {
            if ( useTextFixer ) {
                while ( !el.isLeaf() ) {
                    child = el.firstChild;
                    if ( !child ) {
                        fixer = doc.createTextNode( '' );
                        break;
                    }
                    el = child;
                }
                if ( el.isLeaf() ) {
                    if ( el.nodeType !== TEXT_NODE ) {
                        el.parentNode.insertBefore(
                            doc.createTextNode( '' ), el );
                    }
                    // Opera will collapse the block element if it contains
                    // just spaces (but not if it contains no data at all).
                    else if ( /^ +$/.test( el.data ) ) {
                        el.data = '';
                    }
                }
            }
            else if ( !el.querySelector( 'BR' ) ) {
                fixer = doc.createElement( 'BR' );
                while ( ( child = el.lastElementChild ) && !child.isInline() ) {
                    el = child;
                }
            }
        }
        if ( fixer ) {
            el.appendChild( fixer );
        }
        
        return this;
    }
});

// Fix IE9's buggy implementation of Text#splitText.
// If the split is at the end of the node, it doesn't insert the newly split
// node into the document, and sets its value to undefined rather than ''.
// And even if the split is not at the end, the original node is removed from
// the document and replaced by another, rather than just having its data
// shortened.
if ( function () {
    var div = document.createElement( 'div' ),
        text = document.createTextNode( '12' );
    div.appendChild( text );
    text.splitText( 2 );
    return div.childNodes.length !== 2;
}() ) {
    Text.prototype.splitText = function ( offset ) {
        var afterSplit = this.ownerDocument.createTextNode(
                this.data.slice( offset ) ),
            next = this.nextSibling,
            parent = this.parentNode,
            toDelete = this.length - offset;
        if ( next ) {
            parent.insertBefore( afterSplit, next );
        } else {
            parent.appendChild( afterSplit );
        }
        if ( toDelete ) {
            this.deleteData( offset, toDelete );
        }
        return afterSplit;
    };
}

}() );