/* Copyright © 2011-2012 by Neil Jenkins. Licensed under the MIT license.

   IE TextRange <-> W3C Range code adapted from Rangy:
   http://code.google.com/p/rangy/
   Copyright 2012, Tim Down. Licensed under the MIT license.
*/

var Range;

( function () {

/*global window, document */
/*jshint strict: false */

var indexOf = Array.prototype.indexOf;

var START_TO_START = 0;
var START_TO_END   = 1;
var END_TO_START   = 3;

var contains = function ( a, b ) {
    while ( b = b.parentNode ) {
        if ( a === b ) { return true; }
    }
    return false;
};

var getCommonAncestor = function ( a, b ) {
    var commonAncestor,
        aParents, bParents,
        aL, bL;

    if ( a === b || contains( a, b ) ) {
        commonAncestor = a;
    } else if ( contains( b, a ) ) {
        commonAncestor = b;
    } else {
        aParents = [];
        bParents = [];
        while ( a = a.parentNode ) {
            aParents.push( a );
        }
        while ( b = b.parentNode ) {
            bParents.push( b );
        }
        aL = aParents.length;
        bL = bParents.length;
        while ( aL-- && bL-- ) {
            if ( aParents[ aL ] !== bParents[ bL ] ) {
                commonAncestor = aParents[ aL + 1 ];
                break;
            }
        }
        if ( !commonAncestor ) {
            commonAncestor = ( aL === -1 ? aParents[0] : bParents[0] );
        }
    }
    return commonAncestor;
};

Range = function ( startContainer, startOffset, endContainer, endOffset ) {
    startContainer = startContainer || document;
    startOffset = startOffset || 0;

    this.startContainer = startContainer;
    this.startOffset = startOffset;
    this.endContainer = endContainer || startContainer;
    this.endOffset = endOffset !== undefined ? endOffset : startOffset;
    this._updateCollapsedAndAncestor();
};

Range.prototype = {
    constructor: Range,

    _updateCollapsedAndAncestor: function () {
        this.collapsed = (
            this.startContainer === this.endContainer &&
            this.startOffset === this.endOffset
        );
        this.commonAncestorContainer =
            getCommonAncestor( this.startContainer, this.endContainer );
    },
    setStart: function ( node, offset ) {
        this.startContainer = node;
        this.startOffset = offset;
        this._updateCollapsedAndAncestor();
    },
    setEnd: function ( node, offset ) {
        this.endContainer = node;
        this.endOffset = offset;
        this._updateCollapsedAndAncestor();
    },
    setStartAfter: function ( node ) {
        var parent = node.parentNode;
        this.setStart( parent, indexOf.call( parent.childNodes, node ) + 1 );
    },
    setEndBefore: function ( node ) {
        var parent = node.parentNode;
        this.setEnd( parent, indexOf.call( parent.childNodes, node ) );
    },
    selectNode: function ( node ) {
        var parent = node.parentNode,
            offset = indexOf.call( parent.childNodes, node );
        this.setStart( parent, offset );
        this.setEnd( parent, offset + 1 );
    },
    selectNodeContents: function ( node ) {
        this.setStart( node, 0 );
        this.setEnd( node, node.childNodes.length );
    },
    cloneRange: function () {
        return new Range(
            this.startContainer,
            this.startOffset,
            this.endContainer,
            this.endOffset
        );
    },
    collapse: function ( toStart ) {
        if ( toStart ) {
            this.setEnd( this.startContainer, this.startOffset );
        } else {
            this.setStart( this.endContainer, this.endOffset );
        }
    },
    compareBoundaryPoints: function ( how, sourceRange ) {
        var aContainer, aOffset, bContainer, bOffset, node, parent;
        if ( how === START_TO_START || how === END_TO_START ) {
            aContainer = this.startContainer;
            aOffset = this.startOffset;
        } else {
            aContainer = this.endContainer;
            aOffset = this.endOffset;
        }
        if ( how === START_TO_START || how === START_TO_END ) {
            bContainer = sourceRange.startContainer;
            bOffset = sourceRange.startOffset;
        } else {
            bContainer = sourceRange.endContainer;
            bOffset = sourceRange.endOffset;
        }
        if ( aContainer === bContainer ) {
            return aOffset < bOffset ? -1 :
                aOffset > bOffset ? 1 : 0;
        }

        node = aContainer;
        while ( parent = node.parentNode ) {
            if ( parent === bContainer ) {
                return indexOf.call( parent.childNodes, node ) < bOffset ?
                    -1 : 1;
            }
            node = parent;
        }
        node = bContainer;
        while ( parent = node.parentNode ) {
            if ( parent === aContainer ) {
                return indexOf.call( parent.childNodes, node ) < aOffset ?
                    1 : -1;
            }
            node = parent;
        }
        if ( aContainer.nodeType !== 1 ) {
            aContainer = aContainer.parentNode;
        }
        if ( bContainer.nodeType !== 1 ) {
            bContainer = bContainer.parentNode;
        }
        return aContainer.sourceIndex < bContainer.sourceIndex ? -1 :
            aContainer.sourceIndex > bContainer.sourceIndex ? 1 : 0;
    }
};

document.createRange = function () {
    return new Range();
};

// ---

var isAncestorOf = function ( ancestor, descendant ) {
    return ancestor === descendant || contains( ancestor, descendant );
};

var isCharacterDataNode = function ( node ) {
    var nodeType = node.nodeType;
    // Text, CDataSection or Comment
    return nodeType === 3 || nodeType === 4 || nodeType === 8;
};

var DomPosition = function ( node, offset ) {
    this.node = node;
    this.offset = offset;
};

var getTextRangeContainerElement = function ( textRange ) {
    var parentEl = textRange.parentElement(),
        range, startEl, endEl, startEndContainer;

    range = textRange.duplicate();
    range.collapse( true );
    startEl = range.parentElement();
    range = textRange.duplicate();
    range.collapse( false );
    endEl = range.parentElement();
    startEndContainer = ( startEl === endEl ) ?
        startEl : getCommonAncestor( startEl, endEl );

    return startEndContainer === parentEl ?
        startEndContainer : getCommonAncestor( parentEl, startEndContainer );
};

// Gets the boundary of a TextRange expressed as a node and an offset within
// that node. This function started out as an improved version of code found in
// Tim Cameron Ryan's IERange (http://code.google.com/p/ierange/) but has grown,
// fixing problems with line breaks in preformatted text, adding workaround for
// IE TextRange bugs, handling for inputs and images, plus optimizations.
var getTextRangeBoundaryPosition = function (
        textRange, wholeRangeContainerElement, isStart, isCollapsed ) {
    var workingRange = textRange.duplicate();

    workingRange.collapse( isStart );

    var containerElement = workingRange.parentElement();

    // Sometimes collapsing a TextRange that's at the start of a text node can
    // move it into the previous node, so check for that TODO: Find out when.
    // Workaround for wholeRangeContainerElement may break this
    if ( !isAncestorOf( wholeRangeContainerElement, containerElement ) ) {
        containerElement = wholeRangeContainerElement;
    }

    // Deal with nodes that cannot "contain rich HTML markup". In practice, this
    // means form inputs, images and similar. See
    // http://msdn.microsoft.com/en-us/library/aa703950%28VS.85%29.aspx
    if ( !containerElement.canHaveHTML ) {
        return new DomPosition(
            containerElement.parentNode,
            indexOf.call(
                containerElement.parentNode.childNodes, containerElement )
        );
    }

    var workingNode = document.createElement( 'span' ),
        workingComparisonType = isStart ? 'StartToStart' : 'StartToEnd',
        comparison, previousNode, nextNode, boundaryPosition, boundaryNode;

    // Move the working range through the container's children, starting at the
    // end and working backwards, until the working range reaches or goes past
    // the boundary we're interested in
    do {
        containerElement.insertBefore(
            workingNode, workingNode.previousSibling );
        workingRange.moveToElementText( workingNode );
        comparison =
            workingRange.compareEndPoints( workingComparisonType, textRange );
    } while ( comparison > 0 && workingNode.previousSibling );

    // We've now reached or gone past the boundary of the text range we're
    // interested in so have identified the node we want
    boundaryNode = workingNode.nextSibling;

    if ( comparison === -1 && boundaryNode &&
            isCharacterDataNode( boundaryNode ) ) {
        // This is a character data node (text, comment, cdata). The working
        // range is collapsed at the start of the node containing the text
        // range's boundary, so we move the end of the working range to the
        // boundary point and measure the length of its text to get the
        // boundary's offset within the node.
        workingRange.setEndPoint(
            isStart ? 'EndToStart' : 'EndToEnd', textRange );

        var offset;

        if ( /[\r\n]/.test( boundaryNode.data ) ||
             /[\r\n]/.test( workingRange.text ) ) {
            /*
            For the particular case of a boundary within a text node containing
            line breaks (within a <pre> element, for example), we need a
            slightly complicated approach to get the boundary's offset in IE.
            The facts:

            - Each line break is represented as \r in the text node's
              data/nodeValue properties
            - Each line break is represented as \r\n in the TextRange's 'text'
              property
            - The 'text' property of the TextRange does not contain trailing
              line breaks

            To get round the problem presented by the final fact above, we can
            use the fact that TextRange's moveStart() and moveEnd() methods
            return the actual number of characters moved, which is not
            necessarily the same as the number of characters it was instructed
            to move. The simplest approach is to use this to store the
            characters moved when moving both the start and end of the range to
            the start of the document body and subtracting the start offset from
            the end offset (the "move-negative-gazillion" method). However, this
            is extremely slow when the document is large and the range is near
            the end of it. Clearly doing the mirror image (i.e. moving the range
            boundaries to the end of the document) has the same problem.

            Another approach that works is to use moveStart() to move the start
            boundary of the range up to the end boundary one character at a time
            and incrementing a counter with the value returned by the
            moveStart() call. However, the check for whether the start boundary
            has reached the end boundary is expensive, so this method is slow
            (although unlike "move-negative-gazillion" is largely unaffected by
            the location of the range within the document).

            The method below is a hybrid of the two methods above. It uses the
            fact that a string containing the TextRange's 'text' property with
            each \r\n converted to a single \r character cannot be longer than
            the text of the TextRange, so the start of the range is moved that
            length initially and then a character at a time to make up for any
            trailing line breaks not contained in the 'text' property. This has
            good performance in most situations compared to the previous two
            methods.
            */
            var tempRange = workingRange.duplicate();
            var rangeLength = tempRange.text.replace( /\r\n/g, '\r' ).length;

            offset = tempRange.moveStart( 'character', rangeLength);
            while ( ( comparison =
                    tempRange.compareEndPoints( 'StartToEnd', tempRange )
                    ) === -1 ) {
                offset += 1;
                tempRange.moveStart( 'character', 1 );
            }
        } else {
            offset = workingRange.text.length;
        }
        boundaryPosition = new DomPosition( boundaryNode, offset );
    }
    else {
        // If the boundary immediately follows a character data node and this is
        // the end boundary, we should favour a position within that, and
        // likewise for a start boundary preceding a character data node
        previousNode = ( isCollapsed || !isStart ) &&
            workingNode.previousSibling;
        nextNode = ( isCollapsed || isStart ) && workingNode.nextSibling;

        if ( nextNode && isCharacterDataNode( nextNode ) ) {
            boundaryPosition = new DomPosition( nextNode, 0 );
        } else if ( previousNode && isCharacterDataNode( previousNode ) ) {
            // Strange bug: if we don't read the data property, the length
            // property is often returned incorrectly as 0. Don't ask me why.
            // Therefore get the length from the data property rather than
            // reading it directly from the node.
            boundaryPosition = new DomPosition(
                previousNode, previousNode.data.length );
        } else {
            boundaryPosition = new DomPosition(
                containerElement,
                indexOf.call( containerElement.childNodes, workingNode )
            );
        }
    }

    // Clean up
    workingNode.parentNode.removeChild( workingNode );

    return boundaryPosition;
};

// Returns a TextRange representing the boundary of a TextRange expressed as a
// node and an offset within that node. This function started out as an
// optimized version of code found in Tim Cameron Ryan's IERange
// (http://code.google.com/p/ierange/)
var createBoundaryTextRange = function ( boundaryPosition, isStart ) {
    var boundaryNode, boundaryParent, boundaryOffset = boundaryPosition.offset;
    var doc = document;
    var workingNode, childNodes, workingRange = doc.body.createTextRange();
    var nodeIsDataNode = isCharacterDataNode( boundaryPosition.node );

    if ( nodeIsDataNode ) {
        boundaryNode = boundaryPosition.node;
        boundaryParent = boundaryNode.parentNode;
    } else {
        childNodes = boundaryPosition.node.childNodes;
        boundaryNode = ( boundaryOffset < childNodes.length ) ?
            childNodes[ boundaryOffset ] : null;
        boundaryParent = boundaryPosition.node;
    }

    // Position the range immediately before the node containing the boundary
    workingNode = doc.createElement( 'span' );

    // Making the working element non-empty element persuades IE to consider the
    // TextRange boundary to be within the element rather than immediately
    // before or after it, which is what we want
    workingNode.innerHTML = '&#xfeff;';

    // insertBefore is supposed to work like appendChild if the second parameter
    // is null. However, a bug report for IERange suggests that it can crash the
    // browser: http://code.google.com/p/ierange/issues/detail?id=12
    if ( boundaryNode ) {
        boundaryParent.insertBefore( workingNode, boundaryNode );
    } else {
        boundaryParent.appendChild( workingNode );
    }

    workingRange.moveToElementText( workingNode );
    workingRange.collapse( !isStart );

    // Clean up
    boundaryParent.removeChild( workingNode );

    // Move the working range to the text offset, if required
    if ( nodeIsDataNode ) {
        workingRange[ isStart ? 'moveStart' : 'moveEnd' ](
            'character', boundaryOffset );
    }

    return workingRange;
};

var toDOMRange = function ( textRange ) {
    var rangeContainerElement = getTextRangeContainerElement( textRange ),
        start, end;

    if ( textRange.compareEndPoints( 'StartToEnd', textRange ) === 0 ) {
        start = end = getTextRangeBoundaryPosition(
            textRange, rangeContainerElement, true, true );
    } else {
        start = getTextRangeBoundaryPosition(
            textRange, rangeContainerElement, true, false );
        end = getTextRangeBoundaryPosition(
            textRange, rangeContainerElement, false, false );
    }
    return new Range(
        start.node,
        start.offset,
        end.node,
        end.offset
    );
};

var toTextRange = function ( range ) {
    var textRange, startRange, endRange;
    if ( range.collapsed ) {
        textRange = createBoundaryTextRange(
            new DomPosition( range.startContainer, range.startOffset ), true);
    } else {
        startRange = createBoundaryTextRange(
            new DomPosition( range.startContainer, range.startOffset ), true);
        endRange = createBoundaryTextRange(
            new DomPosition( range.endContainer, range.endOffset ), false );
        textRange = document.body.createTextRange();
        textRange.setEndPoint( 'StartToStart', startRange);
        textRange.setEndPoint( 'EndToEnd', endRange);
    }
    return textRange;
};

var selection = {
    rangeCount: 1,
    getRangeAt: function ( index ) {
        if ( index !== 0 ) { return undefined; }
        var sel = document.selection.createRange();
        // Check if we have a control range.
        if ( sel.add ) {
            var range = document.createRange();
            range.moveToElementText( sel.item( 0 ) );
            range.collapse( false );
            range.select();
            sel = range;
        }
        return toDOMRange( sel );
    },
    removeAllRanges: function () {},
    addRange: function ( range ) {
        toTextRange( range ).select();
    }
};

document.attachEvent( 'onbeforeactivate', function () {
    selection.rangeCount = 1;
});

document.attachEvent( 'ondeactivate', function () {
    selection.rangeCount = 0;
});

window.getSelection = function () {
    return selection;
};

}() );