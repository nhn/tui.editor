/* Copyright © 2011 by Neil Jenkins. Licensed under the MIT license. */

( function () {

/*global Range, Node */

"use strict";

var implement = function ( constructor, props ) {
    var proto = constructor.prototype,
        prop;
    for ( prop in props ) {
        proto[ prop ] = props[ prop ];
    }
};

var indexOf = Array.prototype.indexOf;

var ELEMENT_NODE = 1,   // Node.ELEMENT_NODE
    TEXT_NODE = 3,      // Node.TEXT_NODE
    START_TO_START = 0, // Range.START_TO_START
    START_TO_END = 1,   // Range.START_TO_END
    END_TO_END = 2,     // Range.END_TO_END
    END_TO_START = 3;   // Range.END_TO_START

implement( Range, {
    _insertNode: function ( node ) {
        // Insert at start.
        var startContainer = this.startContainer,
            startOffset = this.startOffset,
            endContainer = this.endContainer,
            endOffset = this.endOffset,
            parent, children, childCount, afterSplit;

        if ( startContainer.nodeType === TEXT_NODE ) {
            parent = startContainer.parentNode;
            children = parent.childNodes;
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
    },

    _extractContents: function ( common ) {
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

        var uptoCommon = function ( node ) {
                return node === common;
            },
            endNode = endContainer.split( endOffset, uptoCommon ) || null,
            startNode = startContainer.split( startOffset, uptoCommon ),
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

        common.fixCursor();

        return frag;
    },
    
    _deleteContents: function () {
        // Move boundaries up as much as possible to reduce need to split.
        this.moveBoundariesUpTree();
        
        // Remove selected range
        this._extractContents();
        
        // If we split into two different blocks, merge the blocks.
        this.moveBoundariesDownTree();
        
        var startBlock = this.getStartBlock(),
            endBlock = this.getEndBlock();
        if ( startBlock && endBlock && startBlock !== endBlock ) {
            startBlock.mergeWithBlock( endBlock, this );
        }
        
        // Ensure body has a block-level element in it.
        var doc = startBlock.ownerDocument,
            body = doc.body,
            bodyFirstChild = body.firstChild;
        if ( !bodyFirstChild || bodyFirstChild.nodeName === 'BR' ) {
            startBlock = doc.createElement( 'DIV' ).fixCursor();
            if ( bodyFirstChild ) {
                body.replaceChild( startBlock, bodyFirstChild );
            }
            else {
                body.appendChild( startBlock );
            }
            this.selectNodeContents( startBlock );
        }
        
        return this;
    },
    
    // ---
    
    insertTreeFragment: function ( frag ) {
        // Check if it's all inline content
        var isInline = true,
            children = frag.childNodes,
            l = children.length;
        while ( l-- ) {
            if ( !children[l].isInline() ) {
                isInline = false;
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
        if ( isInline ) {
            this._insertNode( frag );
            this.collapse( false );
        }
        // Otherwise, split up to body, insert inline before and after split
        // and insert block in between split, then merge containers.
        else {
            var nodeAfterSplit = this.startContainer.split( this.startOffset,
                    function ( node ) { return node.nodeName === 'BODY'; }),
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
            while ( ( child = frag.firstChild ) && child.isInline() ) {
                startContainer.appendChild( child );
            }
            while ( ( child = frag.lastChild ) && child.isInline() ) {
                endContainer.insertBefore( child, endContainer.firstChild );
                endOffset += 1;
            }
            
            // Fix cursor before inserting block:
            node = frag;
            while ( node = node.getNextBlock() ) {
                node.fixCursor();
            }
            
            parent.insertBefore( frag, nodeAfterSplit );
            
            // 6. Merge containers at edges
            nodeAfterSplit.mergeContainers();
            nodeBeforeSplit.nextSibling.mergeContainers();
            
            // Merge containers
            this.setStart( startContainer, startOffset );
            this.setEnd( endContainer, endOffset );
        }
    },

    // ---
    
    containsNode: function ( node, partial ) {
        var range = this,
            nodeRange = node.ownerDocument.createRange();

        nodeRange.selectNodeContents( node );

        if ( partial ) {
            // Node must not finish before range starts or start after range
            // finishes.
            var nodeEndBeforeStart = ( range.compareBoundaryPoints(
                    END_TO_START, nodeRange ) === 1 ),
                nodeStartAfterEnd = ( range.compareBoundaryPoints(
                    START_TO_END, nodeRange ) === -1 );
            return ( !nodeEndBeforeStart && !nodeStartAfterEnd );
        }
        else {
            // Node must start after range starts and finish before range
            // finishes
            var nodeStartAfterStart = ( range.compareBoundaryPoints(
                    START_TO_START, nodeRange ) === -1 ),
                nodeEndBeforeEnd = ( range.compareBoundaryPoints(
                    END_TO_END, nodeRange ) === 1 );
            return ( nodeStartAfterStart && nodeEndBeforeEnd );
        }
    },
    
    moveBoundariesDownTree: function () {
        var startContainer = this.startContainer,
            startOffset = this.startOffset,
            endContainer = this.endContainer,
            endOffset = this.endOffset,
            child;

        while ( startContainer.nodeType !== TEXT_NODE ) {
            child = startContainer.childNodes[ startOffset ];
            if ( !child || child.nodeName === 'BR' ) {
                break;
            }
            startContainer = child;
            startOffset = 0;
        }
        if ( endOffset ) {
            while ( endContainer.nodeType !== TEXT_NODE ) {
                child = endContainer.childNodes[ endOffset - 1 ];
                if ( !child || child.nodeName === 'BR' ) {
                    break;
                }
                endContainer = child;
                endOffset = endContainer.getLength();
            }
        } else {
            while ( endContainer.nodeType !== TEXT_NODE ) {
                child = endContainer.firstChild;
                if ( !child || child.nodeName === 'BR' ) {
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
    },

    moveBoundariesUpTree: function ( common ) {
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
                endOffset === endContainer.getLength() ) {
            parent = endContainer.parentNode;
            endOffset = indexOf.call( parent.childNodes, endContainer ) + 1;
            endContainer = parent;
        }

        this.setStart( startContainer, startOffset );
        this.setEnd( endContainer, endOffset );

        return this;
    },

    // First block that starts before or at range beginning.
    getStartBlock: function () {
        var node = this.startContainer,
            offset = this.startOffset,
            children = node.childNodes;
        if ( node.nodeType === ELEMENT_NODE &&
                offset < children.length ) {
            node = children[ offset ];
        }
        if ( !node.isBlock() ) {
            node = node.getPreviousBlock() ||
                this.startContainer.ownerDocument.body.getNextBlock();
        }
        return node;
    },
    
    // First block that starts before the range ends.
    getEndBlock: function () {
        var node = this.endContainer,
            offset = this.endOffset,
            children = node.childNodes;
            
        if ( offset < children.length ) {
            node = children[ offset ].getPreviousBlock();
        } else {
            while ( node && !node.nextSibling ) {
                node = node.parentNode;
            }
            if ( node ) {
                node = node.nextSibling.getPreviousBlock();
            } else {
                node = this.startContainer.ownerDocument.body.lastChild;
                if ( node ) { node = node.getPreviousBlock(); }
            }
        }
        return node;
    },

    startsAtBlockBoundary: function () {
        var startContainer = this.startContainer,
            startOffset = this.startOffset,
            parent, child;

        while ( startContainer.isInline() ) {
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
    },

    endsAtBlockBoundary: function () {
        var endContainer = this.endContainer,
            endOffset = this.endOffset,
            length = endContainer.getLength(),
            parent, child;

        while ( endContainer.isInline() ) {
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
    },

    expandToBlockBoundaries: function () {
        var start = this.getStartBlock(),
            end = this.getEndBlock(),
            parent = start.parentNode;

        this.setStart( parent, indexOf.call( parent.childNodes, start ) );
        parent = end.parentNode;
        this.setEnd( parent, indexOf.call( parent.childNodes, end ) + 1 );

        return this;
    }
});

}() );