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

var extractContentsOfRange = function ( range, common, root ) {
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

    var endNode = split( endContainer, endOffset, common, root ),
        startNode = split( startContainer, startOffset, common, root ),
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

    fixCursor( common, root );

    return frag;
};

var deleteContentsOfRange = function ( range, root ) {
    var startBlock = getStartBlockOfRange( range, root );
    var endBlock = getEndBlockOfRange( range, root );
    var needsMerge = ( startBlock !== endBlock );
    var frag, child;

    // Move boundaries up as much as possible without exiting block,
    // to reduce need to split.
    moveRangeBoundariesDownTree( range );
    moveRangeBoundariesUpTree( range, startBlock, endBlock, root );

    // Remove selected range
    frag = extractContentsOfRange( range, null, root );

    // Move boundaries back down tree as far as possible.
    moveRangeBoundariesDownTree( range );

    // If we split into two different blocks, merge the blocks.
    if ( needsMerge ) {
        // endBlock will have been split, so need to refetch
        endBlock = getEndBlockOfRange( range, root );
        if ( startBlock && endBlock && startBlock !== endBlock ) {
            mergeWithBlock( startBlock, endBlock, range, root );
        }
    }

    // Ensure block has necessary children
    if ( startBlock ) {
        fixCursor( startBlock, root );
    }

    // Ensure root has a block-level element in it.
    child = root.firstChild;
    if ( !child || child.nodeName === 'BR' ) {
        fixCursor( root, root );
        range.selectNodeContents( root.firstChild );
    } else {
        range.collapse( true );
    }
    return frag;
};

// ---

// Contents of range will be deleted.
// After method, range will be around inserted content
var insertTreeFragmentIntoRange = function ( range, frag, root ) {
    var node, block, blockContentsAfterSplit, stopPoint, container, offset;
    var firstBlockInFrag, nodeAfterSplit, nodeBeforeSplit, tempRange;

    // Fixup content: ensure no top-level inline, and add cursor fix elements.
    fixContainer( frag, root );
    node = frag;
    while ( ( node = getNextBlock( node, root ) ) ) {
        fixCursor( node, root );
    }

    // Delete any selected content.
    if ( !range.collapsed ) {
        deleteContentsOfRange( range, root );
    }

    // Move range down into text nodes.
    moveRangeBoundariesDownTree( range );
    range.collapse( false ); // collapse to end

    // Where will we split up to? First blockquote parent, otherwise root.
    stopPoint = getNearest( range.endContainer, root, 'BLOCKQUOTE' ) || root;

    // Merge the contents of the first block in the frag with the focused block.
    // If there are contents in the block after the focus point, collect this
    // up to insert in the last block later
    block = getStartBlockOfRange( range, root );
    firstBlockInFrag = getNextBlock( frag, frag );
    if ( block && firstBlockInFrag &&
            // Don't merge table cells or PRE elements into block
            !getNearest( firstBlockInFrag, frag, 'PRE' ) &&
            !getNearest( firstBlockInFrag, frag, 'TABLE' ) ) {
        moveRangeBoundariesUpTree( range, block, block, root );
        range.collapse( true ); // collapse to start
        container = range.endContainer;
        offset = range.endOffset;
        // Remove trailing <br> – we don't want this considered content to be
        // inserted again later
        cleanupBRs( block, root, false );
        if ( isInline( container ) ) {
            // Split up to block parent.
            nodeAfterSplit = split(
                container, offset, getPreviousBlock( container, root ), root );
            container = nodeAfterSplit.parentNode;
            offset = indexOf.call( container.childNodes, nodeAfterSplit );
        }
        if ( /*isBlock( container ) && */offset !== getLength( container ) ) {
            // Collect any inline contents of the block after the range point
            blockContentsAfterSplit =
                root.ownerDocument.createDocumentFragment();
            while ( ( node = container.childNodes[ offset ] ) ) {
                blockContentsAfterSplit.appendChild( node );
            }
        }
        // And merge the first block in.
        mergeWithBlock( container, firstBlockInFrag, range, root );

        // And where we will insert
        offset = indexOf.call( container.parentNode.childNodes, container ) + 1;
        container = container.parentNode;
        range.setEnd( container, offset );
    }

    // Is there still any content in the fragment?
    if ( getLength( frag ) ) {
        moveRangeBoundariesUpTree( range, stopPoint, stopPoint, root );
        // Now split after block up to blockquote (if a parent) or root
        nodeAfterSplit = split(
            range.endContainer, range.endOffset, stopPoint, root );
        nodeBeforeSplit = nodeAfterSplit ?
            nodeAfterSplit.previousSibling :
            stopPoint.lastChild;
        stopPoint.insertBefore( frag, nodeAfterSplit );
        if ( nodeAfterSplit ) {
            range.setEndBefore( nodeAfterSplit );
        } else {
            range.setEnd( stopPoint, getLength( stopPoint ) );
        }
        block = getEndBlockOfRange( range, root );

        // Get a reference that won't be invalidated if we merge containers.
        moveRangeBoundariesDownTree( range );
        container = range.endContainer;
        offset = range.endOffset;

        // Merge inserted containers with edges of split
        if ( nodeAfterSplit && isContainer( nodeAfterSplit ) ) {
            mergeContainers( nodeAfterSplit, root );
        }
        nodeAfterSplit = nodeBeforeSplit && nodeBeforeSplit.nextSibling;
        if ( nodeAfterSplit && isContainer( nodeAfterSplit ) ) {
            mergeContainers( nodeAfterSplit, root );
        }
        range.setEnd( container, offset );
    }

    // Insert inline content saved from before.
    if ( blockContentsAfterSplit ) {
        tempRange = range.cloneRange();
        mergeWithBlock( block, blockContentsAfterSplit, tempRange, root );
        range.setEnd( tempRange.endContainer, tempRange.endOffset );
    }
    moveRangeBoundariesDownTree( range );
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
        maySkipBR = true,
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
                if ( maySkipBR && child && child.nodeName === 'BR' ) {
                    endOffset -= 1;
                    maySkipBR = false;
                    continue;
                }
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

var moveRangeBoundariesUpTree = function ( range, startMax, endMax, root ) {
    var startContainer = range.startContainer;
    var startOffset = range.startOffset;
    var endContainer = range.endContainer;
    var endOffset = range.endOffset;
    var maySkipBR = true;
    var parent;

    if ( !startMax ) {
        startMax = range.commonAncestorContainer;
    }
    if ( !endMax ) {
        endMax = startMax;
    }

    while ( !startOffset &&
            startContainer !== startMax &&
            startContainer !== root ) {
        parent = startContainer.parentNode;
        startOffset = indexOf.call( parent.childNodes, startContainer );
        startContainer = parent;
    }

    while ( true ) {
        if ( maySkipBR &&
                endContainer.nodeType !== TEXT_NODE &&
                endContainer.childNodes[ endOffset ] &&
                endContainer.childNodes[ endOffset ].nodeName === 'BR' ) {
            endOffset += 1;
            maySkipBR = false;
        }
        if ( endContainer === endMax ||
                endContainer === root ||
                endOffset !== getLength( endContainer ) ) {
            break;
        }
        parent = endContainer.parentNode;
        endOffset = indexOf.call( parent.childNodes, endContainer ) + 1;
        endContainer = parent;
    }

    range.setStart( startContainer, startOffset );
    range.setEnd( endContainer, endOffset );
};

// Returns the first block at least partially contained by the range,
// or null if no block is contained by the range.
var getStartBlockOfRange = function ( range, root ) {
    var container = range.startContainer,
        block;

    // If inline, get the containing block.
    if ( isInline( container ) ) {
        block = getPreviousBlock( container, root );
    } else if ( container !== root && isBlock( container ) ) {
        block = container;
    } else {
        block = getNodeBefore( container, range.startOffset );
        block = getNextBlock( block, root );
    }
    // Check the block actually intersects the range
    return block && isNodeContainedInRange( range, block, true ) ? block : null;
};

// Returns the last block at least partially contained by the range,
// or null if no block is contained by the range.
var getEndBlockOfRange = function ( range, root ) {
    var container = range.endContainer,
        block, child;

    // If inline, get the containing block.
    if ( isInline( container ) ) {
        block = getPreviousBlock( container, root );
    } else if ( container !== root && isBlock( container ) ) {
        block = container;
    } else {
        block = getNodeAfter( container, range.endOffset );
        if ( !block || !isOrContains( root, block ) ) {
            block = root;
            while ( child = block.lastChild ) {
                block = child;
            }
        }
        block = getPreviousBlock( block, root );
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

var rangeDoesStartAtBlockBoundary = function ( range, root ) {
    var startContainer = range.startContainer;
    var startOffset = range.startOffset;
    var nodeAfterCursor;

    // If in the middle or end of a text node, we're not at the boundary.
    contentWalker.root = null;
    if ( startContainer.nodeType === TEXT_NODE ) {
        if ( startOffset ) {
            return false;
        }
        nodeAfterCursor = startContainer;
    } else {
        nodeAfterCursor = getNodeAfter( startContainer, startOffset );
        if ( nodeAfterCursor && !isOrContains( root, nodeAfterCursor ) ) {
            nodeAfterCursor = null;
        }
        // The cursor was right at the end of the document
        if ( !nodeAfterCursor ) {
            nodeAfterCursor = getNodeBefore( startContainer, startOffset );
            if ( nodeAfterCursor.nodeType === TEXT_NODE &&
                    nodeAfterCursor.length ) {
                return false;
            }
        }
    }

    // Otherwise, look for any previous content in the same block.
    contentWalker.currentNode = nodeAfterCursor;
    contentWalker.root = getStartBlockOfRange( range, root );

    return !contentWalker.previousNode();
};

var rangeDoesEndAtBlockBoundary = function ( range, root ) {
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
    contentWalker.root = getEndBlockOfRange( range, root );

    return !contentWalker.nextNode();
};

var expandRangeToBlockBoundaries = function ( range, root ) {
    var start = getStartBlockOfRange( range, root ),
        end = getEndBlockOfRange( range, root ),
        parent;

    if ( start && end ) {
        parent = start.parentNode;
        range.setStart( parent, indexOf.call( parent.childNodes, start ) );
        parent = end.parentNode;
        range.setEnd( parent, indexOf.call( parent.childNodes, end ) + 1 );
    }
};
