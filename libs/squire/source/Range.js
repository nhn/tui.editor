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

    if ( startOffset === childCount ) {
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
        next, before, after;

    // End node will be null if at end of child nodes list.
    while ( startNode !== endNode ) {
        next = startNode.nextSibling;
        frag.appendChild( startNode );
        startNode = next;
    }

    startContainer = common;
    startOffset = endNode ?
        indexOf.call( common.childNodes, endNode ) :
        common.childNodes.length;

    // Merge text nodes if adjacent. IE10 in particular will not focus
    // between two text nodes
    after = common.childNodes[ startOffset ];
    before = after && after.previousSibling;
    if ( before &&
            before.nodeType === TEXT_NODE &&
            after.nodeType === TEXT_NODE ) {
        startContainer = before;
        startOffset = before.length;
        before.appendData( after.data );
        detach( after );
    }

    range.setStart( startContainer, startOffset );
    range.collapse( true );

    fixCursor( common );

    return frag;
};

var deleteContentsOfRange = function ( range ) {
    // Move boundaries up as much as possible to reduce need to split.
    // But we need to check whether we've moved the boundary outside of a
    // block. If so, the entire block will be removed, so we shouldn't merge
    // later.
    moveRangeBoundariesUpTree( range );

    var startBlock = range.startContainer,
        endBlock = range.endContainer,
        needsMerge = ( isInline( startBlock ) || isBlock( startBlock ) ) &&
            ( isInline( endBlock ) || isBlock( endBlock ) );

    // Remove selected range
    extractContentsOfRange( range );

    // Move boundaries back down tree so that they are inside the blocks.
    // If we don't do this, the range may be collapsed to a point between
    // two blocks, so get(Start|End)BlockOfRange will return null.
    moveRangeBoundariesDownTree( range );

    // If we split into two different blocks, merge the blocks.
    if ( needsMerge ) {
        startBlock = getStartBlockOfRange( range );
        endBlock = getEndBlockOfRange( range );
        if ( startBlock && endBlock && startBlock !== endBlock ) {
            mergeWithBlock( startBlock, endBlock, range );
        }
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
    } else {
        range.collapse( false );
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

    // Move range down into text nodes
    moveRangeBoundariesDownTree( range );

    if ( allInline ) {
        // If inline, just insert at the current position.
        insertNodeInRange( range, frag );
        range.collapse( false );
    } else {
        // Otherwise...
        // 1. Split up to blockquote (if a parent) or body
        var splitPoint = range.startContainer,
            nodeAfterSplit = split( splitPoint, range.startOffset,
                getNearest( splitPoint.parentNode, 'BLOCKQUOTE' ) ||
                splitPoint.ownerDocument.body ),
            nodeBeforeSplit = nodeAfterSplit.previousSibling,
            startContainer = nodeBeforeSplit,
            startOffset = startContainer.childNodes.length,
            endContainer = nodeAfterSplit,
            endOffset = 0,
            parent = nodeAfterSplit.parentNode,
            child, node, prev, next, startAnchor;

        // 2. Move down into edge either side of split and insert any inline
        // nodes at the beginning/end of the fragment
        while ( ( child = startContainer.lastChild ) &&
                child.nodeType === ELEMENT_NODE ) {
            if ( child.nodeName === 'BR' ) {
                startOffset -= 1;
                break;
            }
            startContainer = child;
            startOffset = startContainer.childNodes.length;
        }
        while ( ( child = endContainer.firstChild ) &&
                child.nodeType === ELEMENT_NODE &&
                child.nodeName !== 'BR' ) {
            endContainer = child;
        }
        startAnchor = startContainer.childNodes[ startOffset ] || null;
        while ( ( child = frag.firstChild ) && isInline( child ) ) {
            startContainer.insertBefore( child, startAnchor );
        }
        while ( ( child = frag.lastChild ) && isInline( child ) ) {
            endContainer.insertBefore( child, endContainer.firstChild );
            endOffset += 1;
        }

        // 3. Fix cursor then insert block(s) in the fragment
        node = frag;
        while ( node = getNextBlock( node ) ) {
            fixCursor( node );
        }
        parent.insertBefore( frag, nodeAfterSplit );

        // 4. Remove empty nodes created either side of split, then
        // merge containers at the edges.
        next = nodeBeforeSplit.nextSibling;
        node = getPreviousBlock( next );
        if ( !/\S/.test( node.textContent ) ) {
            do {
                parent = node.parentNode;
                parent.removeChild( node );
                node = parent;
            } while ( parent && !parent.lastChild &&
                parent.nodeName !== 'BODY' );
        }
        if ( !nodeBeforeSplit.parentNode ) {
            nodeBeforeSplit = next.previousSibling;
        }
        if ( !startContainer.parentNode ) {
            startContainer = nodeBeforeSplit || next.parentNode;
            startOffset = nodeBeforeSplit ?
                nodeBeforeSplit.childNodes.length : 0;
        }
        // Merge inserted containers with edges of split
        if ( isContainer( next ) ) {
            mergeContainers( next );
        }

        prev = nodeAfterSplit.previousSibling;
        node = isBlock( nodeAfterSplit ) ?
            nodeAfterSplit : getNextBlock( nodeAfterSplit );
        if ( !/\S/.test( node.textContent ) ) {
            do {
                parent = node.parentNode;
                parent.removeChild( node );
                node = parent;
            } while ( parent && !parent.lastChild &&
                parent.nodeName !== 'BODY' );
        }
        if ( !nodeAfterSplit.parentNode ) {
            nodeAfterSplit = prev.nextSibling;
        }
        if ( !endOffset ) {
            endContainer = prev;
            endOffset = prev.childNodes.length;
        }
        // Merge inserted containers with edges of split
        if ( nodeAfterSplit && isContainer( nodeAfterSplit ) ) {
            mergeContainers( nodeAfterSplit );
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
    contentWalker.root = null;
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
    contentWalker.root = null;
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
