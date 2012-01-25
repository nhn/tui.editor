/* Copyright © 2011 by Neil Jenkins. Licensed under the MIT license. */

/*global Range, navigator, window, document, setTimeout */

( function ( doc ) {

    "use strict";

    // --- Constants ---

    var DOCUMENT_POSITION_PRECEDING = 2, // Node.DOCUMENT_POSITION_PRECEDING
        ELEMENT_NODE = 1,                // Node.ELEMENT_NODE,
        TEXT_NODE = 3,                   // Node.TEXT_NODE,
        SHOW_TEXT = 4,                   // NodeFilter.SHOW_TEXT,
        SHOW_ELEMENT = 1,                // NodeFilter.SHOW_ELEMENT,
        FILTER_ACCEPT = 1,               // NodeFilter.FILTER_ACCEPT,
        FILTER_SKIP = 3;                 // NodeFilter.FILTER_SKIP;

    var win = doc.defaultView,
        body = doc.body;

    var isOpera = !!win.opera;
    var isIE = !!win.ie;
    var isIOS = /iP(?:ad|hone|od)/.test( navigator.userAgent );
    var useTextFixer = isIE || isOpera;

    // --- DOM Sugar ---

    var createElement = function ( tag, props, children ) {
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
    };

    // --- Events ---

    var events = {},
        customEvents = {
            cut: 1, paste: 1, focus: 1, blur: 1,
            pathChange: 1, select: 1, input: 1, undoStateChange: 1
        };

    var fireEvent = function ( type, event ) {
        var handlers = events[ type ],
            l, obj;
        if ( handlers ) {
            if ( typeof event !== 'object' ) {
                event = {
                    data: event
                };
            }
            if ( event.type !== type ) {
                event.type = type;
            }
            l = handlers.length;
            while ( l-- ) {
                obj = handlers[l];
                if ( obj.handleEvent ) {
                    obj.handleEvent( event );
                } else {
                    obj( event );
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
    var getSelection = function () {
        if ( sel.rangeCount ) {
            lastSelection =
                sel.getRangeAt( 0 ).cloneRange();
        }
        return lastSelection;
    };

    // IE9 loses selection state of iframe on blur, so make sure we
    // cache it just before it loses focus.
    if ( win.ie ) {
        win.addEventListener( 'beforedeactivate', getSelection, true );
    }

    var lastAnchorNode;
    var lastFocusNode;
    var path = '';

    var updatePath = function ( _, force ) {
        var anchor = sel.anchorNode,
            focus = sel.focusNode,
            newPath;
        if ( force || anchor !== lastAnchorNode || focus !== lastFocusNode ) {
            lastAnchorNode = anchor;
            lastFocusNode = focus;
            newPath = ( anchor && focus ) ? ( anchor === focus ) ?
                focus.getPath() : '(selection)' : '';
            if ( path !== newPath ) {
                path = newPath;
                fireEvent( 'pathChange', newPath );
            }
        }
        if ( anchor !== focus ) {
            fireEvent( 'select' );
        }
    };
    addEventListener( 'keyup', updatePath );
    addEventListener( 'mouseup', updatePath );

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

    // --- Focus ---

    var focus = function () {
        win.focus();
    };

    var blur = function () {
        win.blur();
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
            node.fixCursor();
        } while ( node = node.getNextBlock() );
    };

    var insertElement = function ( el, range ) {
        if ( !range ) { range = getSelection(); }
        range.collapse( true );
        range._insertNode( el );
        range.setStartAfter( el );
        setSelection( range );
        updatePath();
    };

    // --- Bookmarking ---

    var startSelectionId = 'ss-' + Date.now() + '-' + Math.random();
    var endSelectionId = 'es-' + Date.now() + '-' + Math.random();

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

    var indexOf = Array.prototype.indexOf;

    var getRangeAndRemoveBookmark = function ( range ) {
        var start = doc.getElementById( startSelectionId ),
            end = doc.getElementById( endSelectionId );

        if ( start && end ) {
            var startContainer = start.parentNode,
                endContainer = end.parentNode;

            var _range = {
                startContainer: startContainer,
                endContainer: endContainer,
                startOffset: indexOf.call( startContainer.childNodes, start ),
                endOffset: indexOf.call( endContainer.childNodes, end )
            };

            if ( startContainer === endContainer ) {
                _range.endOffset -= 1;
            }

            start.detach();
            end.detach();

            // Merge any text nodes we split
            startContainer.mergeInlines( _range );
            if ( startContainer !== endContainer ) {
                endContainer.mergeInlines( _range );
            }

            if ( !range ) {
                range = doc.createRange();
            }
            range.setStart( _range.startContainer, _range.startOffset );
            range.setEnd( _range.endContainer, _range.endOffset );

            if ( !range.collapsed ) {
                range.moveBoundariesDownTree();
            }
        }
        return range;
    };

    // --- Undo ---

    var undoIndex, // = -1,
        undoStack, // = [],
        undoStackLength, // = 0,
        isInUndoState, // = false,
        docWasChanged = function () {
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
        if ( root.nearest( tag, attributes ) ) {
            return true;
        }

        // If common ancestor is a text node and doesn't have the format, we
        // definitely don't have it.
        if ( root.nodeType === TEXT_NODE ) {
            return false;
        }

        // Otherwise, check each text node at least partially contained within
        // the selection and make sure all of them have the format we want.
        walker = doc.createTreeWalker( root, SHOW_TEXT, function ( node ) {
            return range.containsNode( node, true ) ?
                FILTER_ACCEPT : FILTER_SKIP;
        }, false );

        var seenNode = false;
        while ( node = walker.nextNode() ) {
            if ( !node.nearest( tag, attributes ) ) {
                return false;
            }
            seenNode = true;
        }

        return seenNode;
    };

    var addFormat = function ( tag, attributes, range ) {
        // If the range is collapsed we simply insert the node by wrapping
        // it round the range and focus it.
        if ( range.collapsed ) {
            var el = createElement( tag, attributes ).fixCursor();
            range._insertNode( el );
            range.selectNodeContents( el );
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
            var walker = doc.createTreeWalker(
                range.commonAncestorContainer,
                SHOW_TEXT,
                function ( node ) {
                    return range.containsNode( node, true ) ?
                        FILTER_ACCEPT : FILTER_SKIP;
                }, false );

            // Start at the beginning node of the range and iterate through
            // all the nodes in the range that need formatting.
            var startContainer,
                endContainer,
                startOffset = 0,
                endOffset = 0,
                textnode = walker.currentNode = range.startContainer,
                needsFormat;

            if ( textnode.nodeType !== TEXT_NODE ) {
                textnode = walker.nextNode();
            }

            do {
                needsFormat = !textnode.nearest( tag, attributes );
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
                    createElement( tag, attributes ).wraps( textnode );
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
        if ( range.collapsed ) {
            range._insertNode( doc.createTextNode( '' ) );
        }

        // Find block-level ancestor of selection
        var root = range.commonAncestorContainer;
        while ( root.isInline() ) {
            root = root.parentNode;
        }

        // Find text nodes inside formatTags that are not in selection and
        // add an extra tag with the same formatting.
        var startContainer = range.startContainer,
            startOffset = range.startOffset,
            endContainer = range.endContainer,
            endOffset = range.endOffset,
            toWrap = [],
            examineNode = function examineNode ( node, exemplar ) {
                // If the node is completely contained by the range then
                // we're going to remove all formatting so ignore it.
                if ( range.containsNode( node, false ) ) {
                    return;
                }

                var isText = node.nodeType === TEXT_NODE,
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
                        el.is( tag, attributes );
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
            item[0].cloneNode( false ).wraps( item[1] );
        });
        // and remove old formatting tags.
        formatTags.forEach( function ( el ) {
            el.replaceWith( el.empty() );
        });

        // Merge adjacent inlines:
        range = getRangeAndRemoveBookmark();
        var _range = {
            startContainer: range.startContainer,
            startOffset: range.startOffset,
            endContainer: range.endContainer,
            endOffset: range.endOffset
        };
        root.mergeInlines( _range );
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
        updatePath( 0, true );

        // We're not still in an undo state
        docWasChanged();
    };

    // --- Block formatting ---

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
            while ( true ) {
                if ( fn( start ) || start === end ) { break; }
                start = start.getNextBlock();
            }
        }

        if ( mutates ) {
            setSelection( range );

            // Path may have changed
            updatePath( 0, true );

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
            range.endContainer.childNodes[ range.endOffset ].mergeContainers();
        }
        range.startContainer.childNodes[ range.startOffset ].mergeContainers();

        // 7. Make it editable again
        if ( !isOpera ) {
            body.setAttribute( 'contenteditable', 'true' );
        }

        // 8. Restore selection
        setSelection( getRangeAndRemoveBookmark() );
        updatePath( 0, true );

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
            return !el.parentNode.nearest( 'BLOCKQUOTE' );
        }).forEach( function ( el ) {
            el.replaceWith( el.empty() );
        });
        return frag;
    };

    var removeBlockQuote = function ( frag ) {
        var blockquotes = frag.querySelectorAll( 'blockquote' ),
            l = blockquotes.length,
            bq;
        while ( l-- ) {
            bq = blockquotes[l];
            bq.replaceWith( bq.empty() );
        }
        return frag;
    };

    var makeList = function makeList ( nodes, type ) {
        var i, l, node, tag, prev, replacement;
        for ( i = 0, l = nodes.length; i < l; i += 1 ) {
            node = nodes[i];
            tag = node.nodeName;
            if ( node.isBlock() ) {
                if ( tag !== 'LI' ) {
                    replacement = createElement( 'LI', [
                        node.empty()
                    ]);
                    if ( node.parentNode.nodeName === type ) {
                        node.replaceWith( replacement );
                    }
                    else if ( ( prev = node.previousSibling ) &&
                            prev.nodeName === type ) {
                        prev.appendChild( replacement );
                        node.detach();
                        i -= 1;
                        l -= 1;
                    }
                    else {
                        node.replaceWith(
                            createElement( type, [
                                replacement
                            ])
                        );
                    }
                }
            } else if ( node.isContainer() ) {
                if ( tag !== type && ( /^[DOU]L$/.test( tag ) ) ) {
                    node.replaceWith( createElement( type, [
                        node.empty()
                    ]) );
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
            return !el.parentNode.nearest( 'UL' ) &&
                !el.parentNode.nearest( 'OL' );
        }).forEach( function ( el ) {
            var frag = el.empty(),
                children = frag.childNodes,
                l = children.length,
                child;
            while ( l-- ) {
                child = children[l];
                if ( child.nodeName === 'LI' ) {
                    frag.replaceChild( createElement( 'DIV', [
                        child.empty()
                    ]), child );
                }
            }
            el.replaceWith( frag );
        });
        return frag;
    };

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
            nodeAfterSplit = node.split( offset, block.parentNode );

        // Make sure the new node is the correct type.
        if ( nodeAfterSplit.nodeName !== splitTag ) {
            block = createElement( splitTag );
            block.replaces( nodeAfterSplit )
                 .appendChild( nodeAfterSplit.empty() );
            nodeAfterSplit = block;
        }
        return nodeAfterSplit;
    };

    // --- Clean ---

    var urlRegExp = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\([^\s()<>]+\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
    var addLinks = function ( frag ) {
        var doc = frag.ownerDocument,
            walker = doc.createTreeWalker( frag, SHOW_TEXT,
                    function ( node ) {
                return node.nearest( 'A' ) ? FILTER_SKIP : FILTER_ACCEPT;
            }, false ),
            node, parts, i, l, text, parent, next;
        while ( node = walker.nextNode() ) {
            parts = node.data.split( urlRegExp );
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
                            node.href = /^https?:/.test( text ) ?
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

    var allowedBlock = /^A(?:DDRESS|RTICLE|SIDE)|BLOCKQUOTE|CAPTION|D(?:[DLT]|IV)|F(?:IGURE|OOTER)|H[1-6]|HEADER|L(?:ABEL|EGEND|I)|O(?:L|UTPUT)|P(?:RE)?|SECTION|T(?:ABLE|BODY|D|FOOT|H|HEAD|R)|UL$/;

    var spanToSemantic = {
        color: {
            regexp: /\S/,
            replace: function ( color ) {
                return createElement( 'SPAN', {
                    'class': 'colour',
                    style: 'color:' + color
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
            regexp: /\S/,
            replace: function ( family ) {
                return createElement( 'SPAN', {
                    'class': 'font',
                    style: 'font-family:' + family
                });
            }
        },
        fontSize: {
            regexp: /\S/,
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
                newTreeBottom.appendChild( span.empty() );
                parent.replaceChild( newTreeTop, span );
            }

            return newTreeBottom || span;
        },
        STRONG: function ( node, parent ) {
            var el = createElement( 'B' );
            parent.replaceChild( el, node );
            el.appendChild( node.empty() );
            return el;
        },
        EM: function ( node, parent ) {
            var el = createElement( 'I' );
            parent.replaceChild( el, node );
            el.appendChild( node.empty() );
            return el;
        },
        TT: function ( node, parent ) {
            var el = createElement( 'SPAN', {
                'class': 'font',
                style: 'font-family:menlo,consolas,"courier new",monospace'
            });
            parent.replaceChild( el, node );
            el.appendChild( node.empty() );
            return el;
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
                        !child.isInline() ) {
                    i -= 1;
                    l += childLength - 1;
                    node.replaceChild( child.empty(), child );
                    continue;
                }
                if ( !allowStyles && child.style.cssText ) {
                    child.removeAttribute( 'style' );
                }
                if ( childLength ) {
                    cleanTree( child, allowStyles );
                }
            } else {
                if ( ( nodeType !== TEXT_NODE ) ||
                        !( /\S/.test( child.data ) ) ) {
                    node.removeChild( child );
                    i -= 1;
                    l -= 1;
                }
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
            if ( !isBR && child.isInline() ) {
                if ( !wrapper ) { wrapper = createElement( tag ); }
                wrapper.appendChild( child );
                i -= 1;
                l -= 1;
            } else if ( isBR || wrapper ) {
                if ( !wrapper ) { wrapper = createElement( tag ); }
                wrapper.fixCursor();
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
            root.appendChild( wrapper.fixCursor() );
        }
        return root;
    };

    var cleanupBRs = function ( root ) {
        var brs = root.querySelectorAll( 'BR' ),
            l = brs.length,
            br, block, nodeAfterSplit, div, next;

        while ( l-- ) {
            br = brs[l];
            // Cleanup may have removed it
            block = br.parentNode;
            if ( !block ) { continue; }
            if ( br.nextSibling && br.previousSibling ) {
                while ( block.isInline() ) {
                    block = block.parentNode;
                }
                // If this is not inside a block, replace it by wrapping
                // inlines in DIV.
                if ( !block.isBlock() ) {
                    wrapTopLevelInline( block, 'DIV' );
                }
                // If in a block we can split, split it instead
                else if ( tagAfterSplit[ block.nodeName ] ) {
                    splitBlock( block, br.parentNode, br );
                    br.detach();
                }
                // Otherwise leave the br alone.
            } else {
                br.detach();
            }
        }
    };

    // --- Cut and Paste ---

    var afterCut = function () {
        // If all content removed, ensure div at start of body.
        body.fixCursor();
    };

    doc.addEventListener( isIE ? 'beforecut' : 'cut', function () {
        // Save undo checkpoint
        var range = getSelection();
        recordUndoState( range );
        getRangeAndRemoveBookmark( range );
        setTimeout( afterCut, 0 );
    }, false );

    // IE sometimes fires the beforepaste event twice; make sure it is not run
    // again before our after paste function is called.
    var awaitingPaste = false;

    doc.addEventListener( isIE ?  'beforepaste' : 'paste', function () {
        if ( awaitingPaste ) { return; }
        awaitingPaste = true;

        var range = getSelection(),
            startContainer = range.startContainer,
            startOffset = range.startOffset,
            endContainer = range.endContainer,
            endOffset = range.endOffset;

        var pasteArea = createElement( 'DIV', {
            style: 'position: absolute; overflow: hidden;' +
                'top: -100px; left: -100px; width: 1px; height: 1px;'
        });
        body.appendChild( pasteArea );
        range.selectNodeContents( pasteArea );
        setSelection( range );

        // A setTimeout of 0 means this is added to the back of the
        // single javascript thread, so it will be executed after the
        // paste event.
        setTimeout( function () {
            // Get the pasted content and clean
            var frag = pasteArea.detach().empty(),
                first = frag.firstChild,
                range = createRange(
                    startContainer, startOffset, endContainer, endOffset );

            // Was anything actually pasted?
            if ( first ) {
                // Safari likes putting extra divs around things.
                if ( first === frag.lastChild && first.nodeName === 'DIV' ) {
                    frag.replaceChild( first.empty(), first );
                }

                frag.normalize();
                addLinks( frag );
                cleanTree( frag, false );
                cleanupBRs( frag );

                var node = frag;
                while ( node = node.getNextBlock() ) {
                    node.fixCursor();
                }

                // Insert pasted data
                range.insertTreeFragment( frag );
                docWasChanged();

                range.collapse( false );
            }

            setSelection( range );
            updatePath( 0, true );

            awaitingPaste = false;
        }, 0 );
    }, false );

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

    var keyHandlers = {
        enter: function ( event ) {
            // We handle this ourselves
            event.preventDefault();

            // Must have some form of selection
            var range = getSelection();
            if ( !range ) { return; }

            // Save undo checkpoint
            recordUndoState( range );
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
                updatePath( 0, true );
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
                            splitOffset = splitNode.getLength();
                        }
                        if ( !splitNode || splitNode.nodeName === 'BR' ) {
                            replacement = createElement( 'DIV' ).fixCursor();
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
                if ( block.nearest( 'UL' ) || block.nearest( 'OL' ) ) {
                    return modifyBlocks( decreaseListLevel, range );
                }
                // Break blockquote
                else if ( block.nearest( 'BLOCKQUOTE' ) ) {
                    return modifyBlocks( removeBlockQuote, range );
                }
            }

            // Otherwise, split at cursor point.
            nodeAfterSplit = splitBlock( block, splitNode, splitOffset );

            // Focus cursor
            // If there's a <b>/<i> etc. at the beginning of the split
            // make sure we focus inside it.
            while ( nodeAfterSplit.nodeType === ELEMENT_NODE) {
                var child = nodeAfterSplit.firstChild,
                    next;

                // Don't continue links over a block break; unlikely to be the
                // desired outcome.
                if ( nodeAfterSplit.nodeName === 'A' ) {
                    nodeAfterSplit.replaceWith( nodeAfterSplit.empty() );
                    nodeAfterSplit = child;
                    continue;
                }

                while ( child && child.nodeType === TEXT_NODE && !child.data ) {
                    next = child.nextSibling;
                    if ( !next || next.nodeName === 'BR' ) {
                        break;
                    }
                    child.detach();
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
            setSelection( createRange( nodeAfterSplit, 0 ) );
            updatePath( 0, true );

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
                event.preventDefault();
                range._deleteContents();
                setSelection( range );
                updatePath( 0, true );
            }
            // If at beginning of block, merge with previous
            else if ( range.startsAtBlockBoundary() ) {
                event.preventDefault();
                var current = range.getStartBlock(),
                    previous = current.getPreviousBlock();
                // Must not be at the very beginning of the text area.
                if ( previous ) {
                    previous.mergeWithBlock( current, range );
                    // If deleted line between containers, merge newly adjacent
                    // containers.
                    current = previous.parentNode;
                    while ( current && !current.nextSibling ) {
                        current = current.parentNode;
                    }
                    if ( current && ( current = current.nextSibling ) ) {
                        current.mergeContainers();
                    }
                    setSelection( range );
                }
                // If at very beginning of text area, allow backspace
                // to break lists/blockquote.
                else {
                    // Break list
                    if ( current.nearest( 'UL' ) || current.nearest( 'OL' ) ) {
                        return modifyBlocks( decreaseListLevel, range );
                    }
                    // Break blockquote
                    else if ( current.nearest( 'BLOCKQUOTE' ) ) {
                        return modifyBlocks( decreaseBlockQuoteLevel, range );
                    }
                    setSelection( range );
                    updatePath( 0, true );
                }
            }
            // All other cases can be safely left to the browser (I hope!).
        },
        'delete': function ( event ) {
            var range = getSelection();
            // If not collapsed, delete contents
            if ( !range.collapsed ) {
                event.preventDefault();
                range._deleteContents();
                setSelection( range );
                updatePath( 0, true );
            }
            // If at end of block, merge next into this block
            else if ( range.endsAtBlockBoundary() ) {
                event.preventDefault();
                var current = range.getStartBlock(),
                    next = current.getNextBlock();
                // Must not be at the very end of the text area.
                if ( next ) {
                    current.mergeWithBlock( next, range );
                    // If deleted line between containers, merge newly adjacent
                    // containers.
                    next = current.parentNode;
                    while ( next && !next.nextSibling ) {
                        next = next.parentNode;
                    }
                    if ( next && ( next = next.nextSibling ) ) {
                        next.mergeContainers();
                    }
                    setSelection( range );
                    updatePath( 0, true );
                }
            }
            // All other cases can be safely left to the browser (I hope!).
        },
        space: function () {
            var range = getSelection();
            recordUndoState( range );
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

    addEventListener( 'keydown', function ( event ) {
        // Ref: http://unixpapa.com/js/key.html
        var code = event.keyCode || event.which,
            key = keys[ code ] || String.fromCharCode( code ).toLowerCase(),
            modifiers = '';

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

    var styleExtractor = /<style[^>]*>([\s\S]*?)<\/style>/gi;

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

    win.editor = {

        addEventListener: chain( addEventListener ),
        removeEventListener: chain( removeEventListener ),

        focus: chain( focus ),
        blur: chain( blur ),

        getDocument: function () {
            return doc;
        },

        addStyles: function ( styles ) {
            if ( styles ) {
                var style = createElement( 'STYLE', {
                        type: 'text/css'
                    });
                style.appendChild( doc.createTextNode( styles ) );
                doc.documentElement.firstChild.appendChild( style );
            }
            return this;
        },

        getHTML: function () {
            var brs = [],
                node, fixer, html, l;
            if ( useTextFixer ) {
                node = body;
                while ( node = node.getNextBlock() ) {
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
                    brs[l].detach();
                }
            }
            return html;
        },
        setHTML: function ( html ) {
            var frag = doc.createDocumentFragment(),
                div = createElement( 'DIV' ),
                child;

            // Parse HTML into DOM tree
            div.innerHTML = html;
            frag.appendChild( div.empty() );

            cleanTree( frag, true );
            cleanupBRs( frag );

            wrapTopLevelInline( frag, 'DIV' );

            // Fix cursor
            var node = frag;
            while ( node = node.getNextBlock() ) {
                node.fixCursor();
            }

            // Remove existing body children
            while ( child = body.lastChild ) {
                body.removeChild( child );
            }

            // And insert new content
            body.appendChild( frag );
            body.fixCursor();

            // Reset the undo stack
            undoIndex = -1;
            undoStack = [];
            undoStackLength = 0;
            isInUndoState = false;

            // Record undo state
            var range = createRange( body.firstChild, 0 );
            recordUndoState( range );
            setSelection( getRangeAndRemoveBookmark( range ) );
            updatePath( 0, true );

            return this;
        },

        getSelectedText: function () {
            return getSelection().getTextContent();
        },

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

        setTextAlignment: function ( dir ) {
            forEachBlock( function ( block ) {
                block.className = 'align-' + dir;
                block.style.textAlign = dir;
            }, true );
            focus();
            return this;
        },

        forEachBlock: chain( forEachBlock ),
        modifyBlocks: chain( modifyBlocks ),

        incQuoteLevel: command( modifyBlocks, increaseBlockQuoteLevel ),
        decQuoteLevel: command( modifyBlocks, decreaseBlockQuoteLevel ),

        makeUnorderedList: command( modifyBlocks, makeUnorderedList ),
        makeOrderedList: command( modifyBlocks, makeOrderedList ),
        removeList: command( modifyBlocks, decreaseListLevel )
    };

    // --- Initialise ---

    body.setAttribute( 'contenteditable', 'true' );
    win.editor.setHTML( '' );

    if ( win.onEditorLoad ) {
        win.onEditorLoad( win.editor );
        delete win.onEditorLoad;
    }

}( document ) );