/* Copyright © 2011-2013 by Neil Jenkins. MIT Licensed. */

( function ( doc ) {

"use strict";
/*global doc, navigator */

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
var body = doc.body;

var ua = navigator.userAgent;
var isGecko = /Gecko\//.test( ua );
var isIE = /Trident\//.test( ua );
var isIE8 = ( win.ie === 8 );
var isIOS = /iP(?:ad|hone|od)/.test( ua );
var isOpera = !!win.opera;
var isWebKit = /WebKit\//.test( ua );

var useTextFixer = isIE || isOpera;
var cantFocusEmptyTextNodes = isIE || isWebKit;
var losesSelectionOnBlur = isIE;

var notWS = /\S/;

var indexOf = Array.prototype.indexOf;
/*global FILTER_ACCEPT */
/*jshint strict:false */

/*
    Native TreeWalker is buggy in IE and Opera:
    * IE9/10 sometimes throw errors when calling TreeWalker#nextNode or
      TreeWalker#previousNode. No way to feature detect this.
    * Some versions of Opera have a bug in TreeWalker#previousNode which makes
      it skip to the wrong node.

    Rather than risk further bugs, it's easiest just to implement our own
    (subset) of the spec in all browsers.
*/

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

function TreeWalker ( root, nodeType, filter ) {
    this.root = this.currentNode = root;
    this.nodeType = nodeType;
    this.filter = filter;
}

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
/*global
    ELEMENT_NODE,
    TEXT_NODE,
    SHOW_ELEMENT,
    FILTER_ACCEPT,
    FILTER_SKIP,
    doc,
    isOpera,
    useTextFixer,
    cantFocusEmptyTextNodes,

    TreeWalker,

    Text,

    setPlaceholderTextNode
*/
/*jshint strict:false */

var inlineNodeNames  = /^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:FN|EL)|EM|FONT|HR|I(?:NPUT|MG|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:U[BP]|PAN|TRONG|AMP)|U)$/;

var leafNodeNames = {
    BR: 1,
    IMG: 1,
    INPUT: 1
};

function every ( nodeList, fn ) {
    var l = nodeList.length;
    while ( l-- ) {
        if ( !fn( nodeList[l] ) ) {
            return false;
        }
    }
    return true;
}

// ---

function hasTagAttributes ( node, tag, attributes ) {
    if ( node.nodeName !== tag ) {
        return false;
    }
    for ( var attr in attributes ) {
        if ( node.getAttribute( attr ) !== attributes[ attr ] ) {
            return false;
        }
    }
    return true;
}
function areAlike ( node, node2 ) {
    return (
        node.nodeType === node2.nodeType &&
        node.nodeName === node2.nodeName &&
        node.className === node2.className &&
        ( ( !node.style && !node2.style ) ||
          node.style.cssText === node2.style.cssText )
    );
}

function isLeaf ( node ) {
    return node.nodeType === ELEMENT_NODE &&
        !!leafNodeNames[ node.nodeName ];
}
function isInline ( node ) {
    return inlineNodeNames.test( node.nodeName );
}
function isBlock ( node ) {
    return node.nodeType === ELEMENT_NODE &&
        !isInline( node ) && every( node.childNodes, isInline );
}
function isContainer ( node ) {
    return node.nodeType === ELEMENT_NODE &&
        !isInline( node ) && !isBlock( node );
}

function acceptIfBlock ( el ) {
    return isBlock( el ) ? FILTER_ACCEPT : FILTER_SKIP;
}
function getBlockWalker ( node ) {
    var doc = node.ownerDocument,
        walker = new TreeWalker(
            doc.body, SHOW_ELEMENT, acceptIfBlock, false );
    walker.currentNode = node;
    return walker;
}

function getPreviousBlock ( node ) {
    return getBlockWalker( node ).previousNode();
}
function getNextBlock ( node ) {
    return getBlockWalker( node ).nextNode();
}
function getNearest ( node, tag, attributes ) {
    do {
        if ( hasTagAttributes( node, tag, attributes ) ) {
            return node;
        }
    } while ( node = node.parentNode );
    return null;
}

function getPath ( node ) {
    var parent = node.parentNode,
        path, id, className, classNames;
    if ( !parent || node.nodeType !== ELEMENT_NODE ) {
        path = parent ? getPath( parent ) : '';
    } else {
        path = getPath( parent );
        path += ( path ? '>' : '' ) + node.nodeName;
        if ( id = node.id ) {
            path += '#' + id;
        }
        if ( className = node.className.trim() ) {
            classNames = className.split( /\s\s*/ );
            classNames.sort();
            path += '.';
            path += classNames.join( '.' );
        }
    }
    return path;
}

function getLength ( node ) {
    var nodeType = node.nodeType;
    return nodeType === ELEMENT_NODE ?
        node.childNodes.length : node.length || 0;
}

function detach ( node ) {
    var parent = node.parentNode;
    if ( parent ) {
        parent.removeChild( node );
    }
    return node;
}
function replaceWith ( node, node2 ) {
    var parent = node.parentNode;
    if ( parent ) {
        parent.replaceChild( node2, node );
    }
}
function empty ( node ) {
    var frag = node.ownerDocument.createDocumentFragment(),
        childNodes = node.childNodes,
        l = childNodes ? childNodes.length : 0;
    while ( l-- ) {
        frag.appendChild( node.firstChild );
    }
    return frag;
}

function fixCursor ( node ) {
    // In Webkit and Gecko, block level elements are collapsed and
    // unfocussable if they have no content. To remedy this, a <BR> must be
    // inserted. In Opera and IE, we just need a textnode in order for the
    // cursor to appear.
    var doc = node.ownerDocument,
        root = node,
        fixer, child;

    if ( node.nodeName === 'BODY' ) {
        if ( !( child = node.firstChild ) || child.nodeName === 'BR' ) {
            fixer = doc.createElement( 'DIV' );
            if ( child ) {
                node.replaceChild( fixer, child );
            }
            else {
                node.appendChild( fixer );
            }
            node = fixer;
            fixer = null;
        }
    }

    if ( isInline( node ) ) {
        if ( !node.firstChild ) {
            if ( cantFocusEmptyTextNodes ) {
                fixer = doc.createTextNode( '\u200B' );
                setPlaceholderTextNode( fixer );
            } else {
                fixer = doc.createTextNode( '' );
            }
        }
    } else {
        if ( useTextFixer ) {
            while ( node.nodeType !== TEXT_NODE && !isLeaf( node ) ) {
                child = node.firstChild;
                if ( !child ) {
                    fixer = doc.createTextNode( '' );
                    break;
                }
                node = child;
            }
            if ( node.nodeType === TEXT_NODE ) {
                // Opera will collapse the block element if it contains
                // just spaces (but not if it contains no data at all).
                if ( /^ +$/.test( node.data ) ) {
                    node.data = '';
                }
            } else if ( isLeaf( node ) ) {
                node.parentNode.insertBefore( doc.createTextNode( '' ), node );
            }
        }
        else if ( !node.querySelector( 'BR' ) ) {
            fixer = doc.createElement( 'BR' );
            while ( ( child = node.lastElementChild ) && !isInline( child ) ) {
                node = child;
            }
        }
    }
    if ( fixer ) {
        node.appendChild( fixer );
    }

    return root;
}

function split ( node, offset, stopNode ) {
    var nodeType = node.nodeType,
        parent, clone, next;
    if ( nodeType === TEXT_NODE ) {
        if ( node === stopNode ) {
            return offset;
        }
        return split( node.parentNode, node.splitText( offset ), stopNode );
    }
    if ( nodeType === ELEMENT_NODE ) {
        if ( typeof( offset ) === 'number' ) {
            offset = offset < node.childNodes.length ?
                node.childNodes[ offset ] : null;
        }
        if ( node === stopNode ) {
            return offset;
        }

        // Clone node without children
        parent = node.parentNode,
        clone = node.cloneNode( false );

        // Add right-hand siblings to the clone
        while ( offset ) {
            next = offset.nextSibling;
            clone.appendChild( offset );
            offset = next;
        }

        // DO NOT NORMALISE. This may undo the fixCursor() call
        // of a node lower down the tree!

        // We need something in the element in order for the cursor to appear.
        fixCursor( node );
        fixCursor( clone );

        // Inject clone after original node
        if ( next = node.nextSibling ) {
            parent.insertBefore( clone, next );
        } else {
            parent.appendChild( clone );
        }

        // Keep on splitting up the tree
        return split( parent, clone, stopNode );
    }
    return node;
}

function mergeInlines ( node, range ) {
    if ( node.nodeType !== ELEMENT_NODE ) {
        return;
    }
    var children = node.childNodes,
        l = children.length,
        frags = [],
        child, prev, len;
    while ( l-- ) {
        child = children[l];
        prev = l && children[ l - 1 ];
        if ( l && isInline( child ) && areAlike( child, prev ) &&
                !leafNodeNames[ child.nodeName ] ) {
            if ( range.startContainer === child ) {
                range.startContainer = prev;
                range.startOffset += getLength( prev );
            }
            if ( range.endContainer === child ) {
                range.endContainer = prev;
                range.endOffset += getLength( prev );
            }
            if ( range.startContainer === node ) {
                if ( range.startOffset > l ) {
                    range.startOffset -= 1;
                }
                else if ( range.startOffset === l ) {
                    range.startContainer = prev;
                    range.startOffset = getLength( prev );
                }
            }
            if ( range.endContainer === node ) {
                if ( range.endOffset > l ) {
                    range.endOffset -= 1;
                }
                else if ( range.endOffset === l ) {
                    range.endContainer = prev;
                    range.endOffset = getLength( prev );
                }
            }
            detach( child );
            if ( child.nodeType === TEXT_NODE ) {
                prev.appendData( child.data.replace( /\u200B/g, '' ) );
            }
            else {
                frags.push( empty( child ) );
            }
        }
        else if ( child.nodeType === ELEMENT_NODE ) {
            len = frags.length;
            while ( len-- ) {
                child.appendChild( frags.pop() );
            }
            mergeInlines( child, range );
        }
    }
}

function mergeWithBlock ( block, next, range ) {
    var container = next,
        last, offset, _range;
    while ( container.parentNode.childNodes.length === 1 ) {
        container = container.parentNode;
    }
    detach( container );

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

    block.appendChild( empty( next ) );
    mergeInlines( block, _range );

    range.setStart( _range.startContainer, _range.startOffset );
    range.collapse( true );

    // Opera inserts a BR if you delete the last piece of text
    // in a block-level element. Unfortunately, it then gets
    // confused when setting the selection subsequently and
    // refuses to accept the range that finishes just before the
    // BR. Removing the BR fixes the bug.
    // Steps to reproduce bug: Type "a-b-c" (where - is return)
    // then backspace twice. The cursor goes to the top instead
    // of after "b".
    if ( isOpera && ( last = block.lastChild ) && last.nodeName === 'BR' ) {
        block.removeChild( last );
    }
}

function mergeContainers ( node ) {
    var prev = node.previousSibling,
        first = node.firstChild;
    if ( prev && areAlike( prev, node ) && isContainer( prev ) ) {
        detach( node );
        prev.appendChild( empty( node ) );
        if ( first ) {
            mergeContainers( first );
        }
    }
}

function createElement ( tag, props, children ) {
    var el = doc.createElement( tag ),
        attr, i, l;
    if ( props instanceof Array ) {
        children = props;
        props = null;
    }
    if ( props ) {
        for ( attr in props ) {
            el.setAttribute( attr, props[ attr ] );
        }
    }
    if ( children ) {
        for ( i = 0, l = children.length; i < l; i += 1 ) {
            el.appendChild( children[i] );
        }
    }
    return el;
}

// Fix IE8/9's buggy implementation of Text#splitText.
// If the split is at the end of the node, it doesn't insert the newly split
// node into the document, and sets its value to undefined rather than ''.
// And even if the split is not at the end, the original node is removed from
// the document and replaced by another, rather than just having its data
// shortened.
if ( function () {
    var div = doc.createElement( 'div' ),
        text = doc.createTextNode( '12' );
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
/*global
    ELEMENT_NODE,
    TEXT_NODE,
    SHOW_TEXT,
    FILTER_ACCEPT,
    START_TO_START,
    START_TO_END,
    END_TO_END,
    END_TO_START,
    indexOf,

    TreeWalker,

    isLeaf,
    isInline,
    isBlock,
    getPreviousBlock,
    getNextBlock,
    getLength,
    fixCursor,
    split,
    mergeWithBlock,
    mergeContainers,

    Range
*/
/*jshint strict:false */

var getNodeBefore = function ( node, offset ) {
    var children = node.childNodes;
    while ( offset && node.nodeType === ELEMENT_NODE ) {
        node = children[ offset - 1 ];
        children = node.childNodes;
        offset = children.length;
    }
    return node;
};

var getNodeAfter = function ( node, offset ) {
    if ( node.nodeType === ELEMENT_NODE ) {
        var children = node.childNodes;
        if ( offset < children.length ) {
            node = children[ offset ];
        } else {
            while ( node && !node.nextSibling ) {
                node = node.parentNode;
            }
            if ( node ) { node = node.nextSibling; }
        }
    }
    return node;
};

var RangePrototype = Range.prototype;

RangePrototype.forEachTextNode = function ( fn ) {
    var range = this.cloneRange();
    range.moveBoundariesDownTree();

    var startContainer = range.startContainer,
        endContainer = range.endContainer,
        root = range.commonAncestorContainer,
        walker = new TreeWalker(
            root, SHOW_TEXT, function ( node ) {
                return FILTER_ACCEPT;
        }, false ),
        textnode = walker.currentNode = startContainer;

    while ( !fn( textnode, range ) &&
        textnode !== endContainer &&
        ( textnode = walker.nextNode() ) ) {}
};

RangePrototype.getTextContent = function () {
    var textContent = '';
    this.forEachTextNode( function ( textnode, range ) {
        var value = textnode.data;
        if ( value && ( /\S/.test( value ) ) ) {
            if ( textnode === range.endContainer ) {
                value = value.slice( 0, range.endOffset );
            }
            if ( textnode === range.startContainer ) {
                value = value.slice( range.startOffset );
            }
            textContent += value;
        }
    });
    return textContent;
};

// ---

RangePrototype._insertNode = function ( node ) {
    // Insert at start.
    var startContainer = this.startContainer,
        startOffset = this.startOffset,
        endContainer = this.endContainer,
        endOffset = this.endOffset,
        parent, children, childCount, afterSplit;

    // If part way through a text node, split it.
    if ( startContainer.nodeType === TEXT_NODE ) {
        parent = startContainer.parentNode;
        children = parent.childNodes;
        if ( startOffset === startContainer.length ) {
            startOffset = indexOf.call( children, startContainer ) + 1;
            if ( this.collapsed ) {
                endContainer = parent;
                endOffset = startOffset;
            }
        } else {
            if ( startOffset ) {
                afterSplit = startContainer.splitText( startOffset );
                if ( endContainer === startContainer ) {
                    endOffset -= startOffset;
                    endContainer = afterSplit;
                }
                else if ( endContainer === parent ) {
                    endOffset += 1;
                }
                startContainer = afterSplit;
            }
            startOffset = indexOf.call( children, startContainer );
        }
        startContainer = parent;
    } else {
        children = startContainer.childNodes;
    }

    childCount = children.length;

    if ( startOffset === childCount) {
        startContainer.appendChild( node );
    } else {
        startContainer.insertBefore( node, children[ startOffset ] );
    }
    if ( startContainer === endContainer ) {
        endOffset += children.length - childCount;
    }

    this.setStart( startContainer, startOffset );
    this.setEnd( endContainer, endOffset );

    return this;
};

RangePrototype._extractContents = function ( common ) {
    var startContainer = this.startContainer,
        startOffset = this.startOffset,
        endContainer = this.endContainer,
        endOffset = this.endOffset;

    if ( !common ) {
        common = this.commonAncestorContainer;
    }

    if ( common.nodeType === TEXT_NODE ) {
        common = common.parentNode;
    }

    var endNode = split( endContainer, endOffset, common ),
        startNode = split( startContainer, startOffset, common ),
        frag = common.ownerDocument.createDocumentFragment(),
        next;

    // End node will be null if at end of child nodes list.
    while ( startNode !== endNode ) {
        next = startNode.nextSibling;
        frag.appendChild( startNode );
        startNode = next;
    }

    this.setStart( common, endNode ?
        indexOf.call( common.childNodes, endNode ) :
            common.childNodes.length );
    this.collapse( true );

    fixCursor( common );

    return frag;
};

RangePrototype._deleteContents = function () {
    // Move boundaries up as much as possible to reduce need to split.
    this.moveBoundariesUpTree();

    // Remove selected range
    this._extractContents();

    // If we split into two different blocks, merge the blocks.
    var startBlock = this.getStartBlock(),
        endBlock = this.getEndBlock();
    if ( startBlock && endBlock && startBlock !== endBlock ) {
        mergeWithBlock( startBlock, endBlock, this );
    }

    // Ensure block has necessary children
    if ( startBlock ) {
        fixCursor( startBlock );
    }

    // Ensure body has a block-level element in it.
    var body = this.endContainer.ownerDocument.body,
        child = body.firstChild;
    if ( !child || child.nodeName === 'BR' ) {
        fixCursor( body );
        this.selectNodeContents( body.firstChild );
    }

    // Ensure valid range (must have only block or inline containers)
    var isCollapsed = this.collapsed;
    this.moveBoundariesDownTree();
    if ( isCollapsed ) {
        // Collapse
        this.collapse( true );
    }

    return this;
};

// ---

RangePrototype.insertTreeFragment = function ( frag ) {
    // Check if it's all inline content
    var allInline = true,
        children = frag.childNodes,
        l = children.length;
    while ( l-- ) {
        if ( !isInline( children[l] ) ) {
            allInline = false;
            break;
        }
    }

    // Delete any selected content
    if ( !this.collapsed ) {
        this._deleteContents();
    }

    // Move range down into text ndoes
    this.moveBoundariesDownTree();

    // If inline, just insert at the current position.
    if ( allInline ) {
        this._insertNode( frag );
        this.collapse( false );
    }
    // Otherwise, split up to body, insert inline before and after split
    // and insert block in between split, then merge containers.
    else {
        var nodeAfterSplit = split( this.startContainer, this.startOffset,
                this.startContainer.ownerDocument.body ),
            nodeBeforeSplit = nodeAfterSplit.previousSibling,
            startContainer = nodeBeforeSplit,
            startOffset = startContainer.childNodes.length,
            endContainer = nodeAfterSplit,
            endOffset = 0,
            parent = nodeAfterSplit.parentNode,
            child, node;

        while ( ( child = startContainer.lastChild ) &&
                child.nodeType === ELEMENT_NODE &&
                child.nodeName !== 'BR' ) {
            startContainer = child;
            startOffset = startContainer.childNodes.length;
        }
        while ( ( child = endContainer.firstChild ) &&
                child.nodeType === ELEMENT_NODE &&
                child.nodeName !== 'BR' ) {
            endContainer = child;
        }
        while ( ( child = frag.firstChild ) && isInline( child ) ) {
            startContainer.appendChild( child );
        }
        while ( ( child = frag.lastChild ) && isInline( child ) ) {
            endContainer.insertBefore( child, endContainer.firstChild );
            endOffset += 1;
        }

        // Fix cursor then insert block(s)
        node = frag;
        while ( node = getNextBlock( node ) ) {
            fixCursor( node );
        }
        parent.insertBefore( frag, nodeAfterSplit );

        // Remove empty nodes created by split and merge inserted containers
        // with edges of split
        node = nodeAfterSplit.previousSibling;
        if ( !nodeAfterSplit.textContent ) {
            parent.removeChild( nodeAfterSplit );
        } else {
            mergeContainers( nodeAfterSplit );
        }
        if ( !nodeAfterSplit.parentNode ) {
            endContainer = node;
            endOffset = getLength( endContainer );
        }

        if ( !nodeBeforeSplit.textContent) {
            startContainer = nodeBeforeSplit.nextSibling;
            startOffset = 0;
            parent.removeChild( nodeBeforeSplit );
        } else {
            mergeContainers( nodeBeforeSplit );
        }

        this.setStart( startContainer, startOffset );
        this.setEnd( endContainer, endOffset );
        this.moveBoundariesDownTree();
    }
};

// ---

RangePrototype.containsNode = function ( node, partial ) {
    var range = this,
        nodeRange = node.ownerDocument.createRange();

    nodeRange.selectNode( node );

    if ( partial ) {
        // Node must not finish before range starts or start after range
        // finishes.
        var nodeEndBeforeStart = ( range.compareBoundaryPoints(
                END_TO_START, nodeRange ) > -1 ),
            nodeStartAfterEnd = ( range.compareBoundaryPoints(
                START_TO_END, nodeRange ) < 1 );
        return ( !nodeEndBeforeStart && !nodeStartAfterEnd );
    }
    else {
        // Node must start after range starts and finish before range
        // finishes
        var nodeStartAfterStart = ( range.compareBoundaryPoints(
                START_TO_START, nodeRange ) < 1 ),
            nodeEndBeforeEnd = ( range.compareBoundaryPoints(
                END_TO_END, nodeRange ) > -1 );
        return ( nodeStartAfterStart && nodeEndBeforeEnd );
    }
};

RangePrototype.moveBoundariesDownTree = function () {
    var startContainer = this.startContainer,
        startOffset = this.startOffset,
        endContainer = this.endContainer,
        endOffset = this.endOffset,
        child;

    while ( startContainer.nodeType !== TEXT_NODE ) {
        child = startContainer.childNodes[ startOffset ];
        if ( !child || isLeaf( child ) ) {
            break;
        }
        startContainer = child;
        startOffset = 0;
    }
    if ( endOffset ) {
        while ( endContainer.nodeType !== TEXT_NODE ) {
            child = endContainer.childNodes[ endOffset - 1 ];
            if ( !child || isLeaf( child ) ) {
                break;
            }
            endContainer = child;
            endOffset = getLength( endContainer );
        }
    } else {
        while ( endContainer.nodeType !== TEXT_NODE ) {
            child = endContainer.firstChild;
            if ( !child || isLeaf( child ) ) {
                break;
            }
            endContainer = child;
        }
    }

    // If collapsed, this algorithm finds the nearest text node positions
    // *outside* the range rather than inside, but also it flips which is
    // assigned to which.
    if ( this.collapsed ) {
        this.setStart( endContainer, endOffset );
        this.setEnd( startContainer, startOffset );
    } else {
        this.setStart( startContainer, startOffset );
        this.setEnd( endContainer, endOffset );
    }

    return this;
};

RangePrototype.moveBoundariesUpTree = function ( common ) {
    var startContainer = this.startContainer,
        startOffset = this.startOffset,
        endContainer = this.endContainer,
        endOffset = this.endOffset,
        parent;

    if ( !common ) {
        common = this.commonAncestorContainer;
    }

    while ( startContainer !== common && !startOffset ) {
        parent = startContainer.parentNode;
        startOffset = indexOf.call( parent.childNodes, startContainer );
        startContainer = parent;
    }

    while ( endContainer !== common &&
            endOffset === getLength( endContainer ) ) {
        parent = endContainer.parentNode;
        endOffset = indexOf.call( parent.childNodes, endContainer ) + 1;
        endContainer = parent;
    }

    this.setStart( startContainer, startOffset );
    this.setEnd( endContainer, endOffset );

    return this;
};

// Returns the first block at least partially contained by the range,
// or null if no block is contained by the range.
RangePrototype.getStartBlock = function () {
    var container = this.startContainer,
        block;

    // If inline, get the containing block.
    if ( isInline( container ) ) {
        block = getPreviousBlock( container );
    } else if ( isBlock( container ) ) {
        block = container;
    } else {
        block = getNodeBefore( container, this.startOffset );
        block = getNextBlock( block );
    }
    // Check the block actually intersects the range
    return block && this.containsNode( block, true ) ? block : null;
};

// Returns the last block at least partially contained by the range,
// or null if no block is contained by the range.
RangePrototype.getEndBlock = function () {
    var container = this.endContainer,
        block, child;

    // If inline, get the containing block.
    if ( isInline( container ) ) {
        block = getPreviousBlock( container );
    } else if ( isBlock( container ) ) {
        block = container;
    } else {
        block = getNodeAfter( container, this.endOffset );
        if ( !block ) {
            block = container.ownerDocument.body;
            while ( child = block.lastChild ) {
                block = child;
            }
        }
        block = getPreviousBlock( block );

    }
    // Check the block actually intersects the range
    return block && this.containsNode( block, true ) ? block : null;
};

RangePrototype.startsAtBlockBoundary = function () {
    var startContainer = this.startContainer,
        startOffset = this.startOffset,
        parent, child;

    while ( isInline( startContainer ) ) {
        if ( startOffset ) {
            return false;
        }
        parent = startContainer.parentNode;
        startOffset = indexOf.call( parent.childNodes, startContainer );
        startContainer = parent;
    }
    // Skip empty text nodes and <br>s.
    while ( startOffset &&
            ( child = startContainer.childNodes[ startOffset - 1 ] ) &&
            ( child.data === '' || child.nodeName === 'BR' ) ) {
        startOffset -= 1;
    }
    return !startOffset;
};

RangePrototype.endsAtBlockBoundary = function () {
    var endContainer = this.endContainer,
        endOffset = this.endOffset,
        length = getLength( endContainer ),
        parent, child;

    while ( isInline( endContainer ) ) {
        if ( endOffset !== length ) {
            return false;
        }
        parent = endContainer.parentNode;
        endOffset = indexOf.call( parent.childNodes, endContainer ) + 1;
        endContainer = parent;
        length = endContainer.childNodes.length;
    }
    // Skip empty text nodes and <br>s.
    while ( endOffset < length &&
            ( child = endContainer.childNodes[ endOffset ] ) &&
            ( child.data === '' || child.nodeName === 'BR' ) ) {
        endOffset += 1;
    }
    return endOffset === length;
};

RangePrototype.expandToBlockBoundaries = function () {
    var start = this.getStartBlock(),
        end = this.getEndBlock(),
        parent;

    if ( start && end ) {
        parent = start.parentNode;
        this.setStart( parent, indexOf.call( parent.childNodes, start ) );
        parent = end.parentNode;
        this.setEnd( parent, indexOf.call( parent.childNodes, end ) + 1 );
    }

    return this;
};
/*global
    DOCUMENT_POSITION_PRECEDING,
    ELEMENT_NODE,
    TEXT_NODE,
    SHOW_ELEMENT,
    SHOW_TEXT,
    FILTER_ACCEPT,
    FILTER_SKIP,
    doc,
    win,
    body,
    isGecko,
    isIE,
    isIE8,
    isIOS,
    isOpera,
    useTextFixer,
    cantFocusEmptyTextNodes,
    losesSelectionOnBlur,
    notWS,
    indexOf,

    TreeWalker,

    hasTagAttributes,
    isLeaf,
    isInline,
    isBlock,
    isContainer,
    getPreviousBlock,
    getNextBlock,
    getNearest,
    getPath,
    getLength,
    detach,
    replaceWith,
    empty,
    fixCursor,
    split,
    mergeInlines,
    mergeWithBlock,
    mergeContainers,
    createElement,

    Range,
    top,
    console,
    setTimeout
*/
/*jshint strict:false */

var editor;

// --- Events.js ---

// Subscribing to these events won't automatically add a listener to the
// document node, since these events are fired in a custom manner by the
// editor code.
var customEvents = {
    focus: 1, blur: 1,
    pathChange: 1, select: 1, input: 1, undoStateChange: 1
};

var events = {};

var fireEvent = function ( type, event ) {
    var handlers = events[ type ],
        i, l, obj;
    if ( handlers ) {
        if ( !event ) {
            event = {};
        }
        if ( event.type !== type ) {
            event.type = type;
        }
        for ( i = 0, l = handlers.length; i < l; i += 1 ) {
            obj = handlers[i];
            try {
                if ( obj.handleEvent ) {
                    obj.handleEvent( event );
                } else {
                    obj( event );
                }
            } catch ( error ) {
                editor.didError( error );
            }
        }
    }
};

var propagateEvent = function ( event ) {
    fireEvent( event.type, event );
};

var addEventListener = function ( type, fn ) {
    var handlers = events[ type ];
    if ( !handlers ) {
        handlers = events[ type ] = [];
        if ( !customEvents[ type ] ) {
            doc.addEventListener( type, propagateEvent, false );
        }
    }
    handlers.push( fn );
};

var removeEventListener = function ( type, fn ) {
    var handlers = events[ type ],
        l;
    if ( handlers ) {
        l = handlers.length;
        while ( l-- ) {
            if ( handlers[l] === fn ) {
                handlers.splice( l, 1 );
            }
        }
        if ( !handlers.length ) {
            delete events[ type ];
            if ( !customEvents[ type ] ) {
                doc.removeEventListener( type, propagateEvent, false );
            }
        }
    }
};

// --- Selection and Path ---

var createRange = function ( range, startOffset, endContainer, endOffset ) {
    if ( range instanceof Range ) {
        return range.cloneRange();
    }
    var domRange = doc.createRange();
    domRange.setStart( range, startOffset );
    if ( endContainer ) {
        domRange.setEnd( endContainer, endOffset );
    } else {
        domRange.setEnd( range, startOffset );
    }
    return domRange;
};

var sel = win.getSelection();
var lastSelection = null;

var setSelection = function ( range ) {
    if ( range ) {
        // iOS bug: if you don't focus the iframe before setting the
        // selection, you can end up in a state where you type but the input
        // doesn't get directed into the contenteditable area but is instead
        // lost in a black hole. Very strange.
        if ( isIOS ) {
            win.focus();
        }
        sel.removeAllRanges();
        sel.addRange( range );
    }
};

var getSelection = function () {
    if ( sel.rangeCount ) {
        lastSelection = sel.getRangeAt( 0 ).cloneRange();
        var startContainer = lastSelection.startContainer,
            endContainer = lastSelection.endContainer;
        // FF sometimes throws an error reading the isLeaf property. Let's
        // catch and log it to see if we can find what's going on.
        try {
            // FF can return the selection as being inside an <img>. WTF?
            if ( startContainer && isLeaf( startContainer ) ) {
                lastSelection.setStartBefore( startContainer );
            }
            if ( endContainer && isLeaf( endContainer ) ) {
                lastSelection.setEndBefore( endContainer );
            }
        } catch ( error ) {
            editor.didError({
                name: 'Squire#getSelection error',
                message: 'Starts: ' + startContainer.nodeName +
                    '\nEnds: ' + endContainer.nodeName
            });
        }
    }
    return lastSelection;
};

// IE loses selection state of iframe on blur, so make sure we
// cache it just before it loses focus.
if ( losesSelectionOnBlur ) {
    win.addEventListener( 'beforedeactivate', getSelection, true );
}

// --- Workaround for browsers that can't focus empty text nodes ---

// WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=15256

var placeholderTextNode = null;
var mayRemovePlaceholder = true;
var willEnablePlaceholderRemoval = false;

var enablePlaceholderRemoval = function () {
    mayRemovePlaceholder = true;
    willEnablePlaceholderRemoval = false;
};

var removePlaceholderTextNode = function () {
    if ( !mayRemovePlaceholder ) { return; }

    var node = placeholderTextNode,
        index;

    placeholderTextNode = null;

    if ( node.parentNode ) {
        while ( ( index = node.data.indexOf( '\u200B' ) ) > -1 ) {
            node.deleteData( index, 1 );
        }
        if ( !node.data && !node.nextSibling && !node.previousSibling &&
                isInline( node.parentNode ) ) {
            detach( node.parentNode );
        }
    }
};

var setPlaceholderTextNode = function ( node ) {
    if ( placeholderTextNode ) {
        mayRemovePlaceholder = true;
        removePlaceholderTextNode();
    }
    if ( !willEnablePlaceholderRemoval ) {
        setTimeout( enablePlaceholderRemoval, 0 );
        willEnablePlaceholderRemoval = true;
    }
    mayRemovePlaceholder = false;
    placeholderTextNode = node;
};

// --- Path change events ---

var lastAnchorNode;
var lastFocusNode;
var path = '';

var updatePath = function ( range, force ) {
    if ( placeholderTextNode && !force ) {
        removePlaceholderTextNode( range );
    }
    var anchor = range.startContainer,
        focus = range.endContainer,
        newPath;
    if ( force || anchor !== lastAnchorNode || focus !== lastFocusNode ) {
        lastAnchorNode = anchor;
        lastFocusNode = focus;
        newPath = ( anchor && focus ) ? ( anchor === focus ) ?
            getPath( focus ) : '(selection)' : '';
        if ( path !== newPath ) {
            path = newPath;
            fireEvent( 'pathChange', { path: newPath } );
        }
    }
    if ( anchor !== focus ) {
        fireEvent( 'select' );
    }
};
var updatePathOnEvent = function () {
    updatePath( getSelection() );
};
addEventListener( 'keyup', updatePathOnEvent );
addEventListener( 'mouseup', updatePathOnEvent );

// --- Focus ---

var focus = function () {
    // FF seems to need the body to be focussed
    // (at least on first load).
    if ( isGecko ) {
        body.focus();
    }
    win.focus();
};

var blur = function () {
    // IE will remove the whole browser window from focus if you call
    // win.blur() or body.blur(), so instead we call top.focus() to focus
    // the top frame, thus blurring this frame. This works in everything
    // except FF, so we need to call body.blur() in that as well.
    if ( isGecko ) {
        body.blur();
    }
    top.focus();
};

win.addEventListener( 'focus', propagateEvent, false );
win.addEventListener( 'blur', propagateEvent, false );

// --- Get/Set data ---

var getHTML = function () {
    return body.innerHTML;
};

var setHTML = function ( html ) {
    var node = body;
    node.innerHTML = html;
    do {
        fixCursor( node );
    } while ( node = getNextBlock( node ) );
};

var insertElement = function ( el, range ) {
    if ( !range ) { range = getSelection(); }
    range.collapse( true );
    if ( isInline( el ) ) {
        range._insertNode( el );
        range.setStartAfter( el );
    } else {
        // Get containing block node.
        var splitNode = range.getStartBlock() || body,
            parent, nodeAfterSplit;
        // While at end of container node, move up DOM tree.
        while ( splitNode !== body && !splitNode.nextSibling ) {
            splitNode = splitNode.parentNode;
        }
        // If in the middle of a container node, split up to body.
        if ( splitNode !== body ) {
            parent = splitNode.parentNode;
            nodeAfterSplit = split( parent, splitNode.nextSibling, body );
        }
        if ( nodeAfterSplit ) {
            body.insertBefore( el, nodeAfterSplit );
            range.setStart( nodeAfterSplit, 0 );
            range.setStart( nodeAfterSplit, 0 );
            range.moveBoundariesDownTree();
        } else {
            body.appendChild( el );
            // Insert blank line below block.
            body.appendChild( fixCursor( createElement( 'div' ) ) );
            range.setStart( el, 0 );
            range.setEnd( el, 0 );
        }
        focus();
        setSelection( range );
        updatePath( range );
    }
};

// --- Bookmarking ---

var startSelectionId = 'squire-selection-start';
var endSelectionId = 'squire-selection-end';

var saveRangeToBookmark = function ( range ) {
    var startNode = createElement( 'INPUT', {
            id: startSelectionId,
            type: 'hidden'
        }),
        endNode = createElement( 'INPUT', {
            id: endSelectionId,
            type: 'hidden'
        }),
        temp;

    range._insertNode( startNode );
    range.collapse( false );
    range._insertNode( endNode );

    // In a collapsed range, the start is sometimes inserted after the end!
    if ( startNode.compareDocumentPosition( endNode ) &
            DOCUMENT_POSITION_PRECEDING ) {
        startNode.id = endSelectionId;
        endNode.id = startSelectionId;
        temp = startNode;
        startNode = endNode;
        endNode = temp;
    }

    range.setStartAfter( startNode );
    range.setEndBefore( endNode );
};

var getRangeAndRemoveBookmark = function ( range ) {
    var start = doc.getElementById( startSelectionId ),
        end = doc.getElementById( endSelectionId );

    if ( start && end ) {
        var startContainer = start.parentNode,
            endContainer = end.parentNode,
            collapsed;

        var _range = {
            startContainer: startContainer,
            endContainer: endContainer,
            startOffset: indexOf.call( startContainer.childNodes, start ),
            endOffset: indexOf.call( endContainer.childNodes, end )
        };

        if ( startContainer === endContainer ) {
            _range.endOffset -= 1;
        }

        detach( start );
        detach( end );

        // Merge any text nodes we split
        mergeInlines( startContainer, _range );
        if ( startContainer !== endContainer ) {
            mergeInlines( endContainer, _range );
        }

        if ( !range ) {
            range = doc.createRange();
        }
        range.setStart( _range.startContainer, _range.startOffset );
        range.setEnd( _range.endContainer, _range.endOffset );
        collapsed = range.collapsed;

        range.moveBoundariesDownTree();
        if ( collapsed ) {
            range.collapse( true );
        }
    }
    return range || null;
};

// --- Undo ---

// These values are initialised in the editor.setHTML method,
// which is always called on initialisation.
var undoIndex; // = -1,
var undoStack; // = [],
var undoStackLength; // = 0,
var isInUndoState; // = false,
var docWasChanged = function () {
    if ( isInUndoState ) {
        isInUndoState = false;
        fireEvent( 'undoStateChange', {
            canUndo: true,
            canRedo: false
        });
    }
    fireEvent( 'input' );
};

addEventListener( 'keyup', function ( event ) {
    var code = event.keyCode;
    // Presume document was changed if:
    // 1. A modifier key (other than shift) wasn't held down
    // 2. The key pressed is not in range 16<=x<=20 (control keys)
    // 3. The key pressed is not in range 33<=x<=45 (navigation keys)
    if ( !event.ctrlKey && !event.metaKey && !event.altKey &&
            ( code < 16 || code > 20 ) &&
            ( code < 33 || code > 45 ) )  {
        docWasChanged();
    }
});

// Leaves bookmark
var recordUndoState = function ( range ) {
    // Don't record if we're already in an undo state
    if ( !isInUndoState ) {
        // Advance pointer to new position
        undoIndex += 1;

        // Truncate stack if longer (i.e. if has been previously undone)
        if ( undoIndex < undoStackLength) {
            undoStack.length = undoStackLength = undoIndex;
        }

        // Write out data
        if ( range ) {
            saveRangeToBookmark( range );
        }
        undoStack[ undoIndex ] = getHTML();
        undoStackLength += 1;
        isInUndoState = true;
    }
};

var undo = function () {
    // Sanity check: must not be at beginning of the history stack
    if ( undoIndex !== 0 || !isInUndoState ) {
        // Make sure any changes since last checkpoint are saved.
        recordUndoState( getSelection() );

        undoIndex -= 1;
        setHTML( undoStack[ undoIndex ] );
        var range = getRangeAndRemoveBookmark();
        if ( range ) {
            setSelection( range );
        }
        isInUndoState = true;
        fireEvent( 'undoStateChange', {
            canUndo: undoIndex !== 0,
            canRedo: true
        });
        fireEvent( 'input' );
    }
};

var redo = function () {
    // Sanity check: must not be at end of stack and must be in an undo
    // state.
    if ( undoIndex + 1 < undoStackLength && isInUndoState ) {
        undoIndex += 1;
        setHTML( undoStack[ undoIndex ] );
        var range = getRangeAndRemoveBookmark();
        if ( range ) {
            setSelection( range );
        }
        fireEvent( 'undoStateChange', {
            canUndo: true,
            canRedo: undoIndex + 1 < undoStackLength
        });
        fireEvent( 'input' );
    }
};

// --- Inline formatting ---

// Looks for matching tag and attributes, so won't work
// if <strong> instead of <b> etc.
var hasFormat = function ( tag, attributes, range ) {
    // 1. Normalise the arguments and get selection
    tag = tag.toUpperCase();
    if ( !attributes ) { attributes = {}; }
    if ( !range && !( range = getSelection() ) ) {
        return false;
    }

    // If the common ancestor is inside the tag we require, we definitely
    // have the format.
    var root = range.commonAncestorContainer,
        walker, node;
    if ( getNearest( root, tag, attributes ) ) {
        return true;
    }

    // If common ancestor is a text node and doesn't have the format, we
    // definitely don't have it.
    if ( root.nodeType === TEXT_NODE ) {
        return false;
    }

    // Otherwise, check each text node at least partially contained within
    // the selection and make sure all of them have the format we want.
    walker = new TreeWalker( root, SHOW_TEXT, function ( node ) {
        return range.containsNode( node, true ) ?
            FILTER_ACCEPT : FILTER_SKIP;
    }, false );

    var seenNode = false;
    while ( node = walker.nextNode() ) {
        if ( !getNearest( node, tag, attributes ) ) {
            return false;
        }
        seenNode = true;
    }

    return seenNode;
};

var addFormat = function ( tag, attributes, range ) {
    // If the range is collapsed we simply insert the node by wrapping
    // it round the range and focus it.
    var el, walker, startContainer, endContainer, startOffset, endOffset,
        textnode, needsFormat;

    if ( range.collapsed ) {
        el = fixCursor( createElement( tag, attributes ) );
        range._insertNode( el );
        range.setStart( el.firstChild, el.firstChild.length );
        range.collapse( true );
    }
    // Otherwise we find all the textnodes in the range (splitting
    // partially selected nodes) and if they're not already formatted
    // correctly we wrap them in the appropriate tag.
    else {
        // We don't want to apply formatting twice so we check each text
        // node to see if it has an ancestor with the formatting already.
        // Create an iterator to walk over all the text nodes under this
        // ancestor which are in the range and not already formatted
        // correctly.
        walker = new TreeWalker(
            range.commonAncestorContainer,
            SHOW_TEXT,
            function ( node ) {
                return range.containsNode( node, true ) ?
                    FILTER_ACCEPT : FILTER_SKIP;
            },
            false
        );

        // Start at the beginning node of the range and iterate through
        // all the nodes in the range that need formatting.
        startOffset = 0;
        endOffset = 0;
        textnode = walker.currentNode = range.startContainer;

        if ( textnode.nodeType !== TEXT_NODE ) {
            textnode = walker.nextNode();
        }

        do {
            needsFormat = !getNearest( textnode, tag, attributes );
            if ( textnode === range.endContainer ) {
                if ( needsFormat && textnode.length > range.endOffset ) {
                    textnode.splitText( range.endOffset );
                } else {
                    endOffset = range.endOffset;
                }
            }
            if ( textnode === range.startContainer ) {
                if ( needsFormat && range.startOffset ) {
                    textnode = textnode.splitText( range.startOffset );
                } else {
                    startOffset = range.startOffset;
                }
            }
            if ( needsFormat ) {
                el = createElement( tag, attributes );
                replaceWith( textnode, el );
                el.appendChild( textnode );
                endOffset = textnode.length;
            }
            endContainer = textnode;
            if ( !startContainer ) { startContainer = endContainer; }
        } while ( textnode = walker.nextNode() );

        // Now set the selection to as it was before
        range = createRange(
            startContainer, startOffset, endContainer, endOffset );
    }
    return range;
};

var removeFormat = function ( tag, attributes, range, partial ) {
    // Add bookmark
    saveRangeToBookmark( range );

    // We need a node in the selection to break the surrounding
    // formatted text.
    var fixer;
    if ( range.collapsed ) {
        if ( cantFocusEmptyTextNodes ) {
            fixer = doc.createTextNode( '\u200B' );
            setPlaceholderTextNode( fixer );
        } else {
            fixer = doc.createTextNode( '' );
        }
        range._insertNode( fixer );
    }

    // Find block-level ancestor of selection
    var root = range.commonAncestorContainer;
    while ( isInline( root ) ) {
        root = root.parentNode;
    }

    // Find text nodes inside formatTags that are not in selection and
    // add an extra tag with the same formatting.
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset,
        toWrap = [],
        examineNode = function ( node, exemplar ) {
            // If the node is completely contained by the range then
            // we're going to remove all formatting so ignore it.
            if ( range.containsNode( node, false ) ) {
                return;
            }

            var isText = ( node.nodeType === TEXT_NODE ),
                child, next;

            // If not at least partially contained, wrap entire contents
            // in a clone of the tag we're removing and we're done.
            if ( !range.containsNode( node, true ) ) {
                // Ignore bookmarks and empty text nodes
                if ( node.nodeName !== 'INPUT' &&
                        ( !isText || node.data ) ) {
                    toWrap.push([ exemplar, node ]);
                }
                return;
            }

            // Split any partially selected text nodes.
            if ( isText ) {
                if ( node === endContainer && endOffset !== node.length ) {
                    toWrap.push([ exemplar, node.splitText( endOffset ) ]);
                }
                if ( node === startContainer && startOffset ) {
                    node.splitText( startOffset );
                    toWrap.push([ exemplar, node ]);
                }
            }
            // If not a text node, recurse onto all children.
            // Beware, the tree may be rewritten with each call
            // to examineNode, hence find the next sibling first.
            else {
                for ( child = node.firstChild; child; child = next ) {
                    next = child.nextSibling;
                    examineNode( child, exemplar );
                }
            }
        },
        formatTags = Array.prototype.filter.call(
            root.getElementsByTagName( tag ), function ( el ) {
                return range.containsNode( el, true ) &&
                    hasTagAttributes( el, tag, attributes );
            }
        );

    if ( !partial ) {
        formatTags.forEach( function ( node ) {
            examineNode( node, node );
        });
    }

    // Now wrap unselected nodes in the tag
    toWrap.forEach( function ( item ) {
        // [ exemplar, node ] tuple
        var el = item[0].cloneNode( false ),
            node = item[1];
        replaceWith( node, el );
        el.appendChild( node );
    });
    // and remove old formatting tags.
    formatTags.forEach( function ( el ) {
        replaceWith( el, empty( el ) );
    });

    // Merge adjacent inlines:
    getRangeAndRemoveBookmark( range );
    if ( fixer ) {
        range.collapse( false );
    }
    var _range = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
    };
    mergeInlines( root, _range );
    range.setStart( _range.startContainer, _range.startOffset );
    range.setEnd( _range.endContainer, _range.endOffset );

    return range;
};

var changeFormat = function ( add, remove, range, partial ) {
    // Normalise the arguments and get selection
    if ( !range && !( range = getSelection() ) ) {
        return;
    }

    // Save undo checkpoint
    recordUndoState( range );
    getRangeAndRemoveBookmark( range );

    if ( remove ) {
        range = removeFormat( remove.tag.toUpperCase(),
            remove.attributes || {}, range, partial );
    }
    if ( add ) {
        range = addFormat( add.tag.toUpperCase(),
            add.attributes || {}, range );
    }

    setSelection( range );
    updatePath( range, true );

    // We're not still in an undo state
    docWasChanged();
};

// --- Block formatting ---

var tagAfterSplit = {
    DIV: 'DIV',
    PRE: 'DIV',
    H1:  'DIV',
    H2:  'DIV',
    H3:  'DIV',
    H4:  'DIV',
    H5:  'DIV',
    H6:  'DIV',
    P:   'DIV',
    DT:  'DD',
    DD:  'DT',
    LI:  'LI'
};

var splitBlock = function ( block, node, offset ) {
    var splitTag = tagAfterSplit[ block.nodeName ],
        nodeAfterSplit = split( node, offset, block.parentNode );

    // Make sure the new node is the correct type.
    if ( nodeAfterSplit.nodeName !== splitTag ) {
        block = createElement( splitTag );
        block.className = nodeAfterSplit.dir === 'rtl' ? 'dir-rtl' : '';
        block.dir = nodeAfterSplit.dir;
        replaceWith( nodeAfterSplit, block );
        block.appendChild( empty( nodeAfterSplit ) );
        nodeAfterSplit = block;
    }
    return nodeAfterSplit;
};

var forEachBlock = function ( fn, mutates, range ) {
    if ( !range && !( range = getSelection() ) ) {
        return;
    }

    // Save undo checkpoint
    if ( mutates ) {
        recordUndoState( range );
        getRangeAndRemoveBookmark( range );
    }

    var start = range.getStartBlock(),
        end = range.getEndBlock();
    if ( start && end ) {
        do {
            if ( fn( start ) || start === end ) { break; }
        } while ( start = getNextBlock( start ) );
    }

    if ( mutates ) {
        setSelection( range );

        // Path may have changed
        updatePath( range, true );

        // We're not still in an undo state
        docWasChanged();
    }
};

var modifyBlocks = function ( modify, range ) {
    if ( !range && !( range = getSelection() ) ) {
        return;
    }
    // 1. Stop firefox adding an extra <BR> to <BODY>
    // if we remove everything. Don't want to do this in Opera
    // as it can cause focus problems.
    if ( !isOpera ) {
        body.setAttribute( 'contenteditable', 'false' );
    }

    // 2. Save undo checkpoint and bookmark selection
    if ( isInUndoState ) {
        saveRangeToBookmark( range );
    } else {
        recordUndoState( range );
    }

    // 3. Expand range to block boundaries
    range.expandToBlockBoundaries();

    // 4. Remove range.
    range.moveBoundariesUpTree( body );
    var frag = range._extractContents( body );

    // 5. Modify tree of fragment and reinsert.
    range._insertNode( modify( frag ) );

    // 6. Merge containers at edges
    if ( range.endOffset < range.endContainer.childNodes.length ) {
        mergeContainers( range.endContainer.childNodes[ range.endOffset ] );
    }
    mergeContainers( range.startContainer.childNodes[ range.startOffset ] );

    // 7. Make it editable again
    if ( !isOpera ) {
        body.setAttribute( 'contenteditable', 'true' );
    }

    // 8. Restore selection
    getRangeAndRemoveBookmark( range );
    setSelection( range );
    updatePath( range, true );

    // 9. We're not still in an undo state
    docWasChanged();
};

var increaseBlockQuoteLevel = function ( frag ) {
    return createElement( 'BLOCKQUOTE', [
        frag
    ]);
};

var decreaseBlockQuoteLevel = function ( frag ) {
    var blockquotes = frag.querySelectorAll( 'blockquote' );
    Array.prototype.filter.call( blockquotes, function ( el ) {
        return !getNearest( el.parentNode, 'BLOCKQUOTE' );
    }).forEach( function ( el ) {
        replaceWith( el, empty( el ) );
    });
    return frag;
};

var removeBlockQuote = function ( frag ) {
    var blockquotes = frag.querySelectorAll( 'blockquote' ),
        l = blockquotes.length,
        bq;
    while ( l-- ) {
        bq = blockquotes[l];
        replaceWith( bq, empty( bq ) );
    }
    return frag;
};

var makeList = function ( nodes, type ) {
    var i, l, node, tag, prev, replacement;
    for ( i = 0, l = nodes.length; i < l; i += 1 ) {
        node = nodes[i];
        tag = node.nodeName;
        if ( isBlock( node ) ) {
            if ( tag !== 'LI' ) {
                replacement = createElement( 'LI', {
                    'class': node.dir === 'rtl' ? 'dir-rtl' : '',
                    dir: node.dir
                }, [
                    empty( node )
                ]);
                if ( node.parentNode.nodeName === type ) {
                    replaceWith( node, replacement );
                }
                else if ( ( prev = node.previousSibling ) &&
                        prev.nodeName === type ) {
                    prev.appendChild( replacement );
                    detach( node );
                    i -= 1;
                    l -= 1;
                }
                else {
                    replaceWith(
                        node,
                        createElement( type, [
                            replacement
                        ])
                    );
                }
            }
        } else if ( isContainer( node ) ) {
            if ( tag !== type && ( /^[DOU]L$/.test( tag ) ) ) {
                replaceWith( node, createElement( type, [ empty( node ) ] ) );
            } else {
                makeList( node.childNodes, type );
            }
        }
    }
};

var makeUnorderedList = function ( frag ) {
    makeList( frag.childNodes, 'UL' );
    return frag;
};

var makeOrderedList = function ( frag ) {
    makeList( frag.childNodes, 'OL' );
    return frag;
};

var decreaseListLevel = function ( frag ) {
    var lists = frag.querySelectorAll( 'UL, OL' );
    Array.prototype.filter.call( lists, function ( el ) {
        return !getNearest( el.parentNode, 'UL' ) &&
            !getNearest( el.parentNode, 'OL' );
    }).forEach( function ( el ) {
        var frag = empty( el ),
            children = frag.childNodes,
            l = children.length,
            child;
        while ( l-- ) {
            child = children[l];
            if ( child.nodeName === 'LI' ) {
                frag.replaceChild( createElement( 'DIV', {
                    'class': child.dir === 'rtl' ? 'dir-rtl' : '',
                    dir: child.dir
                }, [
                    empty( child )
                ]), child );
            }
        }
        replaceWith( el, frag );
    });
    return frag;
};

// --- Clean ---

var linkRegExp = /\b((?:(?:ht|f)tps?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\([^\s()<>]+\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])|(?:[\w\-.%+]+@(?:[\w\-]+\.)+[A-Z]{2,4}))/i;

var addLinks = function ( frag ) {
    var doc = frag.ownerDocument,
        walker = new TreeWalker( frag, SHOW_TEXT,
                function ( node ) {
            return getNearest( node, 'A' ) ? FILTER_SKIP : FILTER_ACCEPT;
        }, false ),
        node, parts, i, l, text, parent, next;
    while ( node = walker.nextNode() ) {
        parts = node.data.split( linkRegExp );
        l = parts.length;
        if ( l > 1 ) {
            parent = node.parentNode;
            next = node.nextSibling;
            for ( i = 0; i < l; i += 1 ) {
                text = parts[i];
                if ( i ) {
                    if ( i % 2 ) {
                        node = doc.createElement( 'A' );
                        node.textContent = text;
                        node.href = /@/.test( text ) ? 'mailto:' + text :
                            /^(?:ht|f)tps?:/.test( text ) ?
                            text : 'http://' + text;
                    } else {
                        node = doc.createTextNode( text );
                    }
                    if ( next ) {
                        parent.insertBefore( node, next );
                    } else {
                        parent.appendChild( node );
                    }
                } else {
                    node.data = text;
                }
            }
            walker.currentNode = node;
        }
    }
};

var allowedBlock = /^(?:A(?:DDRESS|RTICLE|SIDE)|BLOCKQUOTE|CAPTION|D(?:[DLT]|IV)|F(?:IGURE|OOTER)|H[1-6]|HEADER|L(?:ABEL|EGEND|I)|O(?:L|UTPUT)|P(?:RE)?|SECTION|T(?:ABLE|BODY|D|FOOT|H|HEAD|R)|UL)$/;

var fontSizes = {
    1: 10,
    2: 13,
    3: 16,
    4: 18,
    5: 24,
    6: 32,
    7: 48
};

var spanToSemantic = {
    backgroundColor: {
        regexp: notWS,
        replace: function ( colour ) {
            return createElement( 'SPAN', {
                'class': 'highlight',
                style: 'background-color: ' + colour
            });
        }
    },
    color: {
        regexp: notWS,
        replace: function ( colour ) {
            return createElement( 'SPAN', {
                'class': 'colour',
                style: 'color:' + colour
            });
        }
    },
    fontWeight: {
        regexp: /^bold/i,
        replace: function () {
            return createElement( 'B' );
        }
    },
    fontStyle: {
        regexp: /^italic/i,
        replace: function () {
            return createElement( 'I' );
        }
    },
    fontFamily: {
        regexp: notWS,
        replace: function ( family ) {
            return createElement( 'SPAN', {
                'class': 'font',
                style: 'font-family:' + family
            });
        }
    },
    fontSize: {
        regexp: notWS,
        replace: function ( size ) {
            return createElement( 'SPAN', {
                'class': 'size',
                style: 'font-size:' + size
            });
        }
    }
};

var stylesRewriters = {
    SPAN: function ( span, parent ) {
        var style = span.style,
            attr, converter, css, newTreeBottom, newTreeTop, el;

        for ( attr in spanToSemantic ) {
            converter = spanToSemantic[ attr ];
            css = style[ attr ];
            if ( css && converter.regexp.test( css ) ) {
                el = converter.replace( css );
                if ( newTreeBottom ) {
                    newTreeBottom.appendChild( el );
                }
                newTreeBottom = el;
                if ( !newTreeTop ) {
                    newTreeTop = el;
                }
            }
        }

        if ( newTreeTop ) {
            newTreeBottom.appendChild( empty( span ) );
            parent.replaceChild( newTreeTop, span );
        }

        return newTreeBottom || span;
    },
    STRONG: function ( node, parent ) {
        var el = createElement( 'B' );
        parent.replaceChild( el, node );
        el.appendChild( empty( node ) );
        return el;
    },
    EM: function ( node, parent ) {
        var el = createElement( 'I' );
        parent.replaceChild( el, node );
        el.appendChild( empty( node ) );
        return el;
    },
    FONT: function ( node, parent ) {
        var face = node.face,
            size = node.size,
            fontSpan, sizeSpan,
            newTreeBottom, newTreeTop;
        if ( face ) {
            fontSpan = createElement( 'SPAN', {
                'class': 'font',
                style: 'font-family:' + face
            });
        }
        if ( size ) {
            sizeSpan = createElement( 'SPAN', {
                'class': 'size',
                style: 'font-size:' + fontSizes[ size ] + 'px'
            });
            if ( fontSpan ) {
                fontSpan.appendChild( sizeSpan );
            }
        }
        newTreeTop = fontSpan || sizeSpan || createElement( 'SPAN' );
        newTreeBottom = sizeSpan || fontSpan || newTreeTop;
        parent.replaceChild( newTreeTop, node );
        newTreeBottom.appendChild( empty( node ) );
        return newTreeBottom;
    },
    TT: function ( node, parent ) {
        var el = createElement( 'SPAN', {
            'class': 'font',
            style: 'font-family:menlo,consolas,"courier new",monospace'
        });
        parent.replaceChild( el, node );
        el.appendChild( empty( node ) );
        return el;
    }
};

var removeEmptyInlines = function ( root ) {
    var children = root.childNodes,
        l = children.length,
        child;
    while ( l-- ) {
        child = children[l];
        if ( child.nodeType === ELEMENT_NODE ) {
            removeEmptyInlines( child );
            if ( isInline( child ) && !child.firstChild ) {
                root.removeChild( child );
            }
        }
    }
};

/*
    Two purposes:

    1. Remove nodes we don't want, such as weird <o:p> tags, comment nodes
       and whitespace nodes.
    2. Convert inline tags into our preferred format.
*/
var cleanTree = function ( node, allowStyles ) {
    var children = node.childNodes,
        i, l, child, nodeName, nodeType, rewriter, childLength;
    for ( i = 0, l = children.length; i < l; i += 1 ) {
        child = children[i];
        nodeName = child.nodeName;
        nodeType = child.nodeType;
        rewriter = stylesRewriters[ nodeName ];
        if ( nodeType === ELEMENT_NODE ) {
            childLength = child.childNodes.length;
            if ( rewriter ) {
                child = rewriter( child, node );
            } else if ( !allowedBlock.test( nodeName ) &&
                    !isInline( child ) ) {
                i -= 1;
                l += childLength - 1;
                node.replaceChild( empty( child ), child );
                continue;
            } else if ( !allowStyles && child.style.cssText ) {
                child.removeAttribute( 'style' );
            }
            if ( childLength ) {
                cleanTree( child, allowStyles );
            }
        } else if ( nodeType !== TEXT_NODE || (
                !( notWS.test( child.data ) ) &&
                !( i > 0 && isInline( children[ i - 1 ] ) ) &&
                !( i + 1 < l && isInline( children[ i + 1 ] ) )
                ) ) {
            node.removeChild( child );
            i -= 1;
            l -= 1;
        }
    }
    return node;
};

var wrapTopLevelInline = function ( root, tag ) {
    var children = root.childNodes,
        wrapper = null,
        i, l, child, isBR;
    for ( i = 0, l = children.length; i < l; i += 1 ) {
        child = children[i];
        isBR = child.nodeName === 'BR';
        if ( !isBR && isInline( child ) ) {
            if ( !wrapper ) { wrapper = createElement( tag ); }
            wrapper.appendChild( child );
            i -= 1;
            l -= 1;
        } else if ( isBR || wrapper ) {
            if ( !wrapper ) { wrapper = createElement( tag ); }
            fixCursor( wrapper );
            if ( isBR ) {
                root.replaceChild( wrapper, child );
            } else {
                root.insertBefore( wrapper, child );
                i += 1;
                l += 1;
            }
            wrapper = null;
        }
    }
    if ( wrapper ) {
        root.appendChild( fixCursor( wrapper ) );
    }
    return root;
};

var notWSTextNode = function ( node ) {
    return ( node.nodeType === ELEMENT_NODE ?
        node.nodeName === 'BR' :
        notWS.test( node.data ) ) ?
        FILTER_ACCEPT : FILTER_SKIP;
};
var isLineBreak = function ( br ) {
    var block = br.parentNode,
        walker;
    while ( isInline( block ) ) {
        block = block.parentNode;
    }
    walker = new TreeWalker(
        block, SHOW_ELEMENT|SHOW_TEXT, notWSTextNode );
    walker.currentNode = br;
    return !!walker.nextNode();
};

// <br> elements are treated specially, and differently depending on the
// browser, when in rich text editor mode. When adding HTML from external
// sources, we must remove them, replacing the ones that actually affect
// line breaks with a split of the block element containing it (and wrapping
// any not inside a block). Browsers that want <br> elements at the end of
// each block will then have them added back in a later fixCursor method
// call.
var cleanupBRs = function ( root ) {
    var brs = root.querySelectorAll( 'BR' ),
        brBreaksLine = [],
        l = brs.length,
        i, br, block;

    // Must calculate whether the <br> breaks a line first, because if we
    // have two <br>s next to each other, after the first one is converted
    // to a block split, the second will be at the end of a block and
    // therefore seem to not be a line break. But in its original context it
    // was, so we should also convert it to a block split.
    for ( i = 0; i < l; i += 1 ) {
        brBreaksLine[i] = isLineBreak( brs[i] );
    }
    while ( l-- ) {
        br = brs[l];
        // Cleanup may have removed it
        block = br.parentNode;
        if ( !block ) { continue; }
        while ( isInline( block ) ) {
            block = block.parentNode;
        }
        // If this is not inside a block, replace it by wrapping
        // inlines in DIV.
        if ( !isBlock( block ) || !tagAfterSplit[ block.nodeName ] ) {
            wrapTopLevelInline( block, 'DIV' );
        }
        // If in a block we can split, split it instead, but only if there
        // is actual text content in the block. Otherwise, the <br> is a
        // placeholder to stop the block from collapsing, so we must leave
        // it.
        else {
            if ( brBreaksLine[l] ) {
                splitBlock( block, br.parentNode, br );
            }
            detach( br );
        }
    }
};

// --- Cut and Paste ---

var afterCut = function () {
    try {
        // If all content removed, ensure div at start of body.
        fixCursor( body );
    } catch ( error ) {
        editor.didError( error );
    }
};

addEventListener( isIE ? 'beforecut' : 'cut', function () {
    // Save undo checkpoint
    var range = getSelection();
    recordUndoState( range );
    getRangeAndRemoveBookmark( range );
    setSelection( range );
    setTimeout( afterCut, 0 );
});

// IE sometimes fires the beforepaste event twice; make sure it is not run
// again before our after paste function is called.
var awaitingPaste = false;

addEventListener( isIE ?  'beforepaste' : 'paste', function ( event ) {
    if ( awaitingPaste ) { return; }

    // Treat image paste as a drop of an image file.
    var clipboardData = event.clipboardData,
        items = clipboardData && clipboardData.items,
        fireDrop = false,
        l;
    if ( items ) {
        l = items.length;
        while ( l-- ) {
            if ( /^image\/.*/.test( items[l].type ) ) {
                event.preventDefault();
                fireEvent( 'dragover', {
                    dataTransfer: clipboardData,
                    /*jshint loopfunc: true */
                    preventDefault: function () {
                        fireDrop = true;
                    }
                    /*jshint loopfunc: false */
                });
                if ( fireDrop ) {
                    fireEvent( 'drop', {
                        dataTransfer: clipboardData
                    });
                }
                return;
            }
        }
    }

    awaitingPaste = true;

    var range = getSelection(),
        startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset;

    var pasteArea = createElement( 'DIV', {
        style: 'position: absolute; overflow: hidden; top:' +
            (body.scrollTop + 30) + 'px; left: 0; width: 1px; height: 1px;'
    });
    body.appendChild( pasteArea );
    range.selectNodeContents( pasteArea );
    setSelection( range );

    // A setTimeout of 0 means this is added to the back of the
    // single javascript thread, so it will be executed after the
    // paste event.
    setTimeout( function () {
        try {
            // Get the pasted content and clean
            var frag = empty( detach( pasteArea ) ),
                first = frag.firstChild,
                range = createRange(
                    startContainer, startOffset, endContainer, endOffset );

            // Was anything actually pasted?
            if ( first ) {
                // Safari and IE like putting extra divs around things.
                if ( first === frag.lastChild &&
                        first.nodeName === 'DIV' ) {
                    frag.replaceChild( empty( first ), first );
                }

                frag.normalize();
                addLinks( frag );
                cleanTree( frag, false );
                cleanupBRs( frag );
                removeEmptyInlines( frag );

                var node = frag,
                    doPaste = true;
                while ( node = getNextBlock( node ) ) {
                    fixCursor( node );
                }

                fireEvent( 'willPaste', {
                    fragment: frag,
                    preventDefault: function () {
                        doPaste = false;
                    }
                });

                // Insert pasted data
                if ( doPaste ) {
                    range.insertTreeFragment( frag );
                    docWasChanged();

                    range.collapse( false );
                }
            }

            setSelection( range );
            updatePath( range, true );

            awaitingPaste = false;
        } catch ( error ) {
            editor.didError( error );
        }
    }, 0 );
});

// --- Keyboard interaction ---

var keys = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    32: 'space',
    46: 'delete'
};

var mapKeyTo = function ( fn ) {
    return function ( event ) {
        event.preventDefault();
        fn();
    };
};

var mapKeyToFormat = function ( tag ) {
    return function ( event ) {
        event.preventDefault();
        var range = getSelection();
        if ( hasFormat( tag, null, range ) ) {
            changeFormat( null, { tag: tag }, range );
        } else {
            changeFormat( { tag: tag }, null, range );
        }
    };
};

// If you delete the content inside a span with a font styling, Webkit will
// replace it with a <font> tag (!). If you delete all the text inside a
// link in Opera, it won't delete the link. Let's make things consistent. If
// you delete all text inside an inline tag, remove the inline tag.
var afterDelete = function () {
    try {
        var range = getSelection(),
            node = range.startContainer,
            parent;
        if ( node.nodeType === TEXT_NODE ) {
            node = node.parentNode;
        }
        // If focussed in empty inline element
        if ( isInline( node ) && !node.textContent ) {
            do {
                parent = node.parentNode;
            } while ( isInline( parent ) &&
                !parent.textContent && ( node = parent ) );
            range.setStart( parent,
                indexOf.call( parent.childNodes, node ) );
            range.collapse( true );
            parent.removeChild( node );
            if ( !isBlock( parent ) ) {
                parent = getPreviousBlock( parent );
            }
            fixCursor( parent );
            range.moveBoundariesDownTree();
            setSelection( range );
            updatePath( range );
        }
    } catch ( error ) {
        editor.didError( error );
    }
};

// If you select all in IE8 then type, it makes a P; replace it with
// a DIV.
if ( isIE8 ) {
    addEventListener( 'keyup', function () {
        var firstChild = body.firstChild;
        if ( firstChild.nodeName === 'P' ) {
            saveRangeToBookmark( getSelection() );
            replaceWith( firstChild, createElement( 'DIV', [
                empty( firstChild )
            ]) );
            setSelection( getRangeAndRemoveBookmark() );
        }
    });
}

var keyHandlers = {
    enter: function ( event ) {
        // We handle this ourselves
        event.preventDefault();

        // Must have some form of selection
        var range = getSelection();
        if ( !range ) { return; }

        // Save undo checkpoint and add any links in the preceding section.
        recordUndoState( range );
        addLinks( range.startContainer );
        getRangeAndRemoveBookmark( range );

        // Selected text is overwritten, therefore delete the contents
        // to collapse selection.
        if ( !range.collapsed ) {
            range._deleteContents();
        }

        var block = range.getStartBlock(),
            tag = block ? block.nodeName : 'DIV',
            splitTag = tagAfterSplit[ tag ],
            nodeAfterSplit;

        // If this is a malformed bit of document, just play it safe
        // and insert a <br>.
        if ( !block ) {
            range._insertNode( createElement( 'BR' ) );
            range.collapse( false );
            setSelection( range );
            updatePath( range, true );
            docWasChanged();
            return;
        }

        // We need to wrap the contents in divs.
        var splitNode = range.startContainer,
            splitOffset = range.startOffset,
            replacement;
        if ( !splitTag ) {
            // If the selection point is inside the block, we're going to
            // rewrite it so our saved referece points won't be valid.
            // Pick a node at a deeper point in the tree to avoid this.
            if ( splitNode === block ) {
                splitNode = splitOffset ?
                    splitNode.childNodes[ splitOffset - 1 ] : null;
                splitOffset = 0;
                if ( splitNode ) {
                    if ( splitNode.nodeName === 'BR' ) {
                        splitNode = splitNode.nextSibling;
                    } else {
                        splitOffset = getLength( splitNode );
                    }
                    if ( !splitNode || splitNode.nodeName === 'BR' ) {
                        replacement = fixCursor( createElement( 'DIV' ) );
                        if ( splitNode ) {
                            block.replaceChild( replacement, splitNode );
                        } else {
                            block.appendChild( replacement );
                        }
                        splitNode = replacement;
                    }
                }
            }
            wrapTopLevelInline( block, 'DIV' );
            splitTag = 'DIV';
            if ( !splitNode ) {
                splitNode = block.firstChild;
            }
            range.setStart( splitNode, splitOffset );
            range.setEnd( splitNode, splitOffset );
            block = range.getStartBlock();
        }

        if ( !block.textContent ) {
            // Break list
            if ( getNearest( block, 'UL' ) || getNearest( block, 'OL' ) ) {
                return modifyBlocks( decreaseListLevel, range );
            }
            // Break blockquote
            else if ( getNearest( block, 'BLOCKQUOTE' ) ) {
                return modifyBlocks( removeBlockQuote, range );
            }
        }

        // Otherwise, split at cursor point.
        nodeAfterSplit = splitBlock( block, splitNode, splitOffset );

        // Focus cursor
        // If there's a <b>/<i> etc. at the beginning of the split
        // make sure we focus inside it.
        while ( nodeAfterSplit.nodeType === ELEMENT_NODE ) {
            var child = nodeAfterSplit.firstChild,
                next;

            // Don't continue links over a block break; unlikely to be the
            // desired outcome.
            if ( nodeAfterSplit.nodeName === 'A' ) {
                replaceWith( nodeAfterSplit, empty( nodeAfterSplit ) );
                nodeAfterSplit = child;
                continue;
            }

            while ( child && child.nodeType === TEXT_NODE && !child.data ) {
                next = child.nextSibling;
                if ( !next || next.nodeName === 'BR' ) {
                    break;
                }
                detach( child );
                child = next;
            }

            // 'BR's essentially don't count; they're a browser hack.
            // If you try to select the contents of a 'BR', FF will not let
            // you type anything!
            if ( !child || child.nodeName === 'BR' ||
                    ( child.nodeType === TEXT_NODE && !isOpera ) ) {
                break;
            }
            nodeAfterSplit = child;
        }
        range = createRange( nodeAfterSplit, 0 );
        setSelection( range );
        updatePath( range, true );

        // Scroll into view
        if ( nodeAfterSplit.nodeType === TEXT_NODE ) {
            nodeAfterSplit = nodeAfterSplit.parentNode;
        }
        if ( nodeAfterSplit.offsetTop + nodeAfterSplit.offsetHeight >
                ( doc.documentElement.scrollTop || body.scrollTop ) +
                body.offsetHeight ) {
            nodeAfterSplit.scrollIntoView( false );
        }

        // We're not still in an undo state
        docWasChanged();
    },
    backspace: function ( event ) {
        var range = getSelection();
        // If not collapsed, delete contents
        if ( !range.collapsed ) {
            recordUndoState( range );
            getRangeAndRemoveBookmark( range );
            event.preventDefault();
            range._deleteContents();
            setSelection( range );
            updatePath( range, true );
        }
        // If at beginning of block, merge with previous
        else if ( range.startsAtBlockBoundary() ) {
            recordUndoState( range );
            getRangeAndRemoveBookmark( range );
            event.preventDefault();
            var current = range.getStartBlock(),
                previous = current && getPreviousBlock( current );
            // Must not be at the very beginning of the text area.
            if ( previous ) {
                // If not editable, just delete whole block.
                if ( !previous.isContentEditable ) {
                    detach( previous );
                    return;
                }
                // Otherwise merge.
                mergeWithBlock( previous, current, range );
                // If deleted line between containers, merge newly adjacent
                // containers.
                current = previous.parentNode;
                while ( current && !current.nextSibling ) {
                    current = current.parentNode;
                }
                if ( current && ( current = current.nextSibling ) ) {
                    mergeContainers( current );
                }
                setSelection( range );
            }
            // If at very beginning of text area, allow backspace
            // to break lists/blockquote.
            else {
                // Break list
                if ( getNearest( current, 'UL' ) ||
                        getNearest( current, 'OL' ) ) {
                    return modifyBlocks( decreaseListLevel, range );
                }
                // Break blockquote
                else if ( getNearest( current, 'BLOCKQUOTE' ) ) {
                    return modifyBlocks( decreaseBlockQuoteLevel, range );
                }
                setSelection( range );
                updatePath( range, true );
            }
        }
        // Otherwise, leave to browser but check afterwards whether it has
        // left behind an empty inline tag.
        else {
            var text = range.startContainer.data || '';
            if ( !notWS.test( text.charAt( range.startOffset - 1 ) ) ) {
                recordUndoState( range );
                getRangeAndRemoveBookmark( range );
                setSelection( range );
            }
            setTimeout( afterDelete, 0 );
        }
    },
    'delete': function ( event ) {
        var range = getSelection();
        // If not collapsed, delete contents
        if ( !range.collapsed ) {
            recordUndoState( range );
            getRangeAndRemoveBookmark( range );
            event.preventDefault();
            range._deleteContents();
            setSelection( range );
            updatePath( range, true );
        }
        // If at end of block, merge next into this block
        else if ( range.endsAtBlockBoundary() ) {
            recordUndoState( range );
            getRangeAndRemoveBookmark( range );
            event.preventDefault();
            var current = range.getStartBlock(),
                next = current && getNextBlock( current );
            // Must not be at the very end of the text area.
            if ( next ) {
                // If not editable, just delete whole block.
                if ( !next.isContentEditable ) {
                    detach( next );
                    return;
                }
                // Otherwise merge.
                mergeWithBlock( current, next, range );
                // If deleted line between containers, merge newly adjacent
                // containers.
                next = current.parentNode;
                while ( next && !next.nextSibling ) {
                    next = next.parentNode;
                }
                if ( next && ( next = next.nextSibling ) ) {
                    mergeContainers( next );
                }
                setSelection( range );
                updatePath( range, true );
            }
        }
        // Otherwise, leave to browser but check afterwards whether it has
        // left behind an empty inline tag.
        else {
            // Record undo point if deleting whitespace
            var text = range.startContainer.data || '';
            if ( !notWS.test( text.charAt( range.startOffset ) ) ) {
                recordUndoState( range );
                getRangeAndRemoveBookmark( range );
                setSelection( range );
            }
            setTimeout( afterDelete, 0 );
        }
    },
    space: function () {
        var range = getSelection();
        recordUndoState( range );
        addLinks( range.startContainer );
        getRangeAndRemoveBookmark( range );
        setSelection( range );
    },
    'ctrl-b': mapKeyToFormat( 'B' ),
    'ctrl-i': mapKeyToFormat( 'I' ),
    'ctrl-u': mapKeyToFormat( 'U' ),
    'ctrl-y': mapKeyTo( redo ),
    'ctrl-z': mapKeyTo( undo ),
    'ctrl-shift-z': mapKeyTo( redo )
};

// Ref: http://unixpapa.com/js/key.html
// Opera does not fire keydown repeatedly.
addEventListener( isOpera ? 'keypress' : 'keydown',
        function ( event ) {
    var code = event.keyCode,
        key = keys[ code ] || String.fromCharCode( code ).toLowerCase(),
        modifiers = '';

    // On keypress, delete and '.' both have event.keyCode 46
    // Must check event.which to differentiate.
    if ( isOpera && event.which === 46 ) {
        key = '.';
    }

    // Function keys
    if ( 111 < code && code < 124 ) {
        key = 'f' + ( code - 111 );
    }

    if ( event.altKey ) { modifiers += 'alt-'; }
    if ( event.ctrlKey || event.metaKey ) { modifiers += 'ctrl-'; }
    if ( event.shiftKey ) { modifiers += 'shift-'; }

    key = modifiers + key;

    if ( keyHandlers[ key ] ) {
        keyHandlers[ key ]( event );
    }
});

// --- Export ---

var chain = function ( fn ) {
    return function () {
        fn.apply( null, arguments );
        return this;
    };
};

var command = function ( fn, arg, arg2 ) {
    return function () {
        fn( arg, arg2 );
        focus();
        return this;
    };
};

editor = win.editor = {

    didError: function ( error ) {
        console.log( error );
    },

    addEventListener: chain( addEventListener ),
    removeEventListener: chain( removeEventListener ),

    focus: chain( focus ),
    blur: chain( blur ),

    getDocument: function () {
        return doc;
    },

    addStyles: function ( styles ) {
        if ( styles ) {
            var head = doc.documentElement.firstChild,
                style = createElement( 'STYLE', {
                    type: 'text/css'
                });
            if ( style.styleSheet ) {
                // IE8: must append to document BEFORE adding styles
                // or you get the IE7 CSS parser!
                head.appendChild( style );
                style.styleSheet.cssText = styles;
            } else {
                // Everyone else
                style.appendChild( doc.createTextNode( styles ) );
                head.appendChild( style );
            }
        }
        return this;
    },

    getHTML: function ( withBookMark ) {
        var brs = [],
            node, fixer, html, l, range;
        if ( withBookMark && ( range = getSelection() ) ) {
            saveRangeToBookmark( range );
        }
        if ( useTextFixer ) {
            node = body;
            while ( node = getNextBlock( node ) ) {
                if ( !node.textContent && !node.querySelector( 'BR' ) ) {
                    fixer = createElement( 'BR' );
                    node.appendChild( fixer );
                    brs.push( fixer );
                }
            }
        }
        html = getHTML();
        if ( useTextFixer ) {
            l = brs.length;
            while ( l-- ) {
                detach( brs[l] );
            }
        }
        if ( range ) {
            getRangeAndRemoveBookmark( range );
        }
        return html;
    },
    setHTML: function ( html ) {
        var frag = doc.createDocumentFragment(),
            div = createElement( 'DIV' ),
            child;

        // Parse HTML into DOM tree
        div.innerHTML = html;
        frag.appendChild( empty( div ) );

        cleanTree( frag, true );
        cleanupBRs( frag );

        wrapTopLevelInline( frag, 'DIV' );

        // Fix cursor
        var node = frag;
        while ( node = getNextBlock( node ) ) {
            fixCursor( node );
        }

        // Remove existing body children
        while ( child = body.lastChild ) {
            body.removeChild( child );
        }

        // And insert new content
        body.appendChild( frag );
        fixCursor( body );

        // Reset the undo stack
        undoIndex = -1;
        undoStack = [];
        undoStackLength = 0;
        isInUndoState = false;

        // Record undo state
        var range = getRangeAndRemoveBookmark() ||
            createRange( body.firstChild, 0 );
        recordUndoState( range );
        getRangeAndRemoveBookmark( range );
        // IE will also set focus when selecting text so don't use
        // setSelection. Instead, just store it in lastSelection, so if
        // anything calls getSelection before first focus, we have a range
        // to return.
        if ( losesSelectionOnBlur ) {
            lastSelection = range;
        } else {
            setSelection( range );
        }
        updatePath( range, true );

        return this;
    },

    getSelectedText: function () {
        return getSelection().getTextContent();
    },

    insertElement: chain( insertElement ),
    insertImage: function ( src ) {
        var img = createElement( 'IMG', {
            src: src
        });
        insertElement( img );
        return img;
    },

    getPath: function () {
        return path;
    },
    getSelection: getSelection,
    setSelection: chain( setSelection ),

    undo: chain( undo ),
    redo: chain( redo ),

    hasFormat: hasFormat,
    changeFormat: chain( changeFormat ),

    bold: command( changeFormat, { tag: 'B' } ),
    italic: command( changeFormat, { tag: 'I' } ),
    underline: command( changeFormat, { tag: 'U' } ),

    removeBold: command( changeFormat, null, { tag: 'B' } ),
    removeItalic: command( changeFormat, null, { tag: 'I' } ),
    removeUnderline: command( changeFormat, null, { tag: 'U' } ),

    makeLink: function ( url ) {
        url = encodeURI( url );
        var range = getSelection();
        if ( range.collapsed ) {
            var protocolEnd = url.indexOf( ':' ) + 1;
            if ( protocolEnd ) {
                while ( url[ protocolEnd ] === '/' ) { protocolEnd += 1; }
            }
            range._insertNode(
                doc.createTextNode( url.slice( protocolEnd ) )
            );
        }
        changeFormat({
            tag: 'A',
            attributes: {
                href: url
            }
        }, {
            tag: 'A'
        }, range );
        focus();
        return this;
    },

    removeLink: function () {
        changeFormat( null, {
            tag: 'A'
        }, getSelection(), true );
        focus();
        return this;
    },

    setFontFace: function ( name ) {
        changeFormat({
            tag: 'SPAN',
            attributes: {
                'class': 'font',
                style: 'font-family: ' + name + ', sans-serif;'
            }
        }, {
            tag: 'SPAN',
            attributes: { 'class': 'font' }
        });
        focus();
        return this;
    },
    setFontSize: function ( size ) {
        changeFormat({
            tag: 'SPAN',
            attributes: {
                'class': 'size',
                style: 'font-size: ' +
                    ( typeof size === 'number' ? size + 'px' : size )
            }
        }, {
            tag: 'SPAN',
            attributes: { 'class': 'size' }
        });
        focus();
        return this;
    },

    setTextColour: function ( colour ) {
        changeFormat({
            tag: 'SPAN',
            attributes: {
                'class': 'colour',
                style: 'color: ' + colour
            }
        }, {
            tag: 'SPAN',
            attributes: { 'class': 'colour' }
        });
        focus();
        return this;
    },

    setHighlightColour: function ( colour ) {
        changeFormat({
            tag: 'SPAN',
            attributes: {
                'class': 'highlight',
                style: 'background-color: ' + colour
            }
        }, {
            tag: 'SPAN',
            attributes: { 'class': 'highlight' }
        });
        focus();
        return this;
    },

    setTextAlignment: function ( alignment ) {
        forEachBlock( function ( block ) {
            block.className = ( block.className
                .split( /\s+/ )
                .filter( function ( klass ) {
                    return !( /align/.test( klass ) );
                })
                .join( ' ' ) +
                ' align-' + alignment ).trim();
            block.style.textAlign = alignment;
        }, true );
        focus();
        return this;
    },

    setTextDirection: function ( direction ) {
        forEachBlock( function ( block ) {
            block.className = ( block.className
                .split( /\s+/ )
                .filter( function ( klass ) {
                    return !( /dir/.test( klass ) );
                })
                .join( ' ' ) +
                ' dir-' + direction ).trim();
            block.dir = direction;
        }, true );
        focus();
        return this;
    },

    forEachBlock: chain( forEachBlock ),
    modifyBlocks: chain( modifyBlocks ),

    increaseQuoteLevel: command( modifyBlocks, increaseBlockQuoteLevel ),
    decreaseQuoteLevel: command( modifyBlocks, decreaseBlockQuoteLevel ),

    makeUnorderedList: command( modifyBlocks, makeUnorderedList ),
    makeOrderedList: command( modifyBlocks, makeOrderedList ),
    removeList: command( modifyBlocks, decreaseListLevel )
};

// --- Initialise ---

body.setAttribute( 'contenteditable', 'true' );
editor.setHTML( '' );

if ( win.onEditorLoad ) {
    win.onEditorLoad( win.editor );
    win.onEditorLoad = null;
}
}( document ) );
