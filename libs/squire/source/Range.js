/*jshint strict:false, undef:false, unused:false, latedef:false */

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

// ---

var forEachTextNodeInRange = function ( range, fn ) {
    range = range.cloneRange();
    moveRangeBoundariesDownTree( range );

    var startContainer = range.startContainer,
        endContainer = range.endContainer,
        root = range.commonAncestorContainer,
        walker = new TreeWalker(
            root, SHOW_TEXT, function (/* node */) {
                return true;
        }, false ),
        textnode = walker.currentNode = startContainer;

    while ( !fn( textnode, range ) &&
        textnode !== endContainer &&
        ( textnode = walker.nextNode() ) ) {}
};

var getTextContentInRange = function ( range ) {
    var textContent = '';
    forEachTextNodeInRange( range, function ( textnode, range ) {
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

var insertNodeInRange = function ( range, node ) {
    // Insert at start.
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset,
        parent, children, childCount, afterSplit;

    // If part way through a text node, split it.
    if ( startContainer.nodeType === TEXT_NODE ) {
        parent = startContainer.parentNode;
        children = parent.childNodes;
        if ( startOffset === startContainer.length ) {
            startOffset = indexOf.call( children, startContainer ) + 1;
            if ( range.collapsed ) {
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

    range.setStart( startContainer, startOffset );
    range.setEnd( endContainer, endOffset );
};

var extractContentsOfRange = function ( range, common ) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset;

    if ( !common ) {
        common = range.commonAncestorContainer;
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

    range.setStart( common, endNode ?
        indexOf.call( common.childNodes, endNode ) :
            common.childNodes.length );
    range.collapse( true );

    fixCursor( common );

    return frag;
};

var deleteContentsOfRange = function ( range ) {
    // Move boundaries up as much as possible to reduce need to split.
    moveRangeBoundariesUpTree( range );

    // Remove selected range
    extractContentsOfRange( range );

    // Move boundaries back down tree so that they are inside the blocks.
    // If we don't do this, the range may be collapsed to a point between
    // two blocks, so get(Start|End)BlockOfRange will return null.
    moveRangeBoundariesDownTree( range );

    // If we split into two different blocks, merge the blocks.
    var startBlock = getStartBlockOfRange( range ),
        endBlock = getEndBlockOfRange( range );
    if ( startBlock && endBlock && startBlock !== endBlock ) {
        mergeWithBlock( startBlock, endBlock, range );
    }

    // Ensure block has necessary children
    if ( startBlock ) {
        fixCursor( startBlock );
    }

    // Ensure body has a block-level element in it.
    var body = range.endContainer.ownerDocument.body,
        child = body.firstChild;
    if ( !child || child.nodeName === 'BR' ) {
        fixCursor( body );
        range.selectNodeContents( body.firstChild );
    }
};

// ---

var insertTreeFragmentIntoRange = function ( range, frag ) {
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
    if ( !range.collapsed ) {
        deleteContentsOfRange( range );
    }

    // Move range down into text ndoes
    moveRangeBoundariesDownTree( range );

    // If inline, just insert at the current position.
    if ( allInline ) {
        insertNodeInRange( range, frag );
        range.collapse( false );
    }
    // Otherwise, split up to body, insert inline before and after split
    // and insert block in between split, then merge containers.
    else {
        var nodeAfterSplit = split( range.startContainer, range.startOffset,
                range.startContainer.ownerDocument.body ),
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

        range.setStart( startContainer, startOffset );
        range.setEnd( endContainer, endOffset );
        moveRangeBoundariesDownTree( range );
    }
};

// ---

var isNodeContainedInRange = function ( range, node, partial ) {
    var nodeRange = node.ownerDocument.createRange();

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

var moveRangeBoundariesDownTree = function ( range ) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset,
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
    if ( range.collapsed ) {
        range.setStart( endContainer, endOffset );
        range.setEnd( startContainer, startOffset );
    } else {
        range.setStart( startContainer, startOffset );
        range.setEnd( endContainer, endOffset );
    }
};

var moveRangeBoundariesUpTree = function ( range, common ) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset,
        parent;

    if ( !common ) {
        common = range.commonAncestorContainer;
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

    range.setStart( startContainer, startOffset );
    range.setEnd( endContainer, endOffset );
};

// Returns the first block at least partially contained by the range,
// or null if no block is contained by the range.
var getStartBlockOfRange = function ( range ) {
    var container = range.startContainer,
        block;

    // If inline, get the containing block.
    if ( isInline( container ) ) {
        block = getPreviousBlock( container );
    } else if ( isBlock( container ) ) {
        block = container;
    } else {
        block = getNodeBefore( container, range.startOffset );
        block = getNextBlock( block );
    }
    // Check the block actually intersects the range
    return block && isNodeContainedInRange( range, block, true ) ? block : null;
};

// Returns the last block at least partially contained by the range,
// or null if no block is contained by the range.
var getEndBlockOfRange = function ( range ) {
    var container = range.endContainer,
        block, child;

    // If inline, get the containing block.
    if ( isInline( container ) ) {
        block = getPreviousBlock( container );
    } else if ( isBlock( container ) ) {
        block = container;
    } else {
        block = getNodeAfter( container, range.endOffset );
        if ( !block ) {
            block = container.ownerDocument.body;
            while ( child = block.lastChild ) {
                block = child;
            }
        }
        block = getPreviousBlock( block );

    }
    // Check the block actually intersects the range
    return block && isNodeContainedInRange( range, block, true ) ? block : null;
};

var contentWalker = new TreeWalker( null,
    SHOW_TEXT|SHOW_ELEMENT,
    function ( node ) {
        return node.nodeType === TEXT_NODE ?
            notWS.test( node.data ) :
            node.nodeName === 'IMG';
    }
);

var rangeDoesStartAtBlockBoundary = function ( range ) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset;

    // If in the middle or end of a text node, we're not at the boundary.
    if ( startContainer.nodeType === TEXT_NODE ) {
        if ( startOffset ) {
            return false;
        }
        contentWalker.currentNode = startContainer;
    } else {
        contentWalker.currentNode = getNodeAfter( startContainer, startOffset );
    }

    // Otherwise, look for any previous content in the same block.
    contentWalker.root = getStartBlockOfRange( range );

    return !contentWalker.previousNode();
};

var rangeDoesEndAtBlockBoundary = function ( range ) {
    var endContainer = range.endContainer,
        endOffset = range.endOffset,
        length;

    // If in a text node with content, and not at the end, we're not
    // at the boundary
    if ( endContainer.nodeType === TEXT_NODE ) {
        length = endContainer.data.length;
        if ( length && endOffset < length ) {
            return false;
        }
        contentWalker.currentNode = endContainer;
    } else {
        contentWalker.currentNode = getNodeBefore( endContainer, endOffset );
    }

    // Otherwise, look for any further content in the same block.
    contentWalker.root = getEndBlockOfRange( range );

    return !contentWalker.nextNode();
};

var expandRangeToBlockBoundaries = function ( range ) {
    var start = getStartBlockOfRange( range ),
        end = getEndBlockOfRange( range ),
        parent;

    if ( start && end ) {
        parent = start.parentNode;
        range.setStart( parent, indexOf.call( parent.childNodes, start ) );
        parent = end.parentNode;
        range.setEnd( parent, indexOf.call( parent.childNodes, end ) + 1 );
    }
};
