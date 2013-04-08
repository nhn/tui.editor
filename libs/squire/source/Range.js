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
