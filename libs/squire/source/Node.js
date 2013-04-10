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
    if ( nodeType === TEXT_NODE && node !== stopNode ) {
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
    return offset;
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
