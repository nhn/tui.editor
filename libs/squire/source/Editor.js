/*jshint strict:false, undef:false, unused:false */

var instances = [];

function getSquireInstance ( doc ) {
    var l = instances.length,
        instance;
    while ( l-- ) {
        instance = instances[l];
        if ( instance._doc === doc ) {
            return instance;
        }
    }
    return null;
}

function mergeObjects ( base, extras ) {
    var prop, value;
    if ( !base ) {
        base = {};
    }
    for ( prop in extras ) {
        value = extras[ prop ];
        base[ prop ] = ( value && value.constructor === Object ) ?
            mergeObjects( base[ prop ], value ) :
            value;
    }
    return base;
}

function Squire ( doc, config ) {
    var win = doc.defaultView;
    var body = doc.body;
    var mutation;

    this._win = win;
    this._doc = doc;
    this._body = body;

    this._events = {};

    this._lastSelection = null;

    // IE loses selection state of iframe on blur, so make sure we
    // cache it just before it loses focus.
    if ( losesSelectionOnBlur ) {
        this.addEventListener( 'beforedeactivate', this.getSelection );
    }

    this._hasZWS = false;

    this._lastAnchorNode = null;
    this._lastFocusNode = null;
    this._path = '';

    this.addEventListener( 'keyup', this._updatePathOnEvent );
    this.addEventListener( 'mouseup', this._updatePathOnEvent );

    win.addEventListener( 'focus', this, false );
    win.addEventListener( 'blur', this, false );

    this._undoIndex = -1;
    this._undoStack = [];
    this._undoStackLength = 0;
    this._isInUndoState = false;
    this._ignoreChange = false;

    if ( canObserveMutations ) {
        mutation = new MutationObserver( this._docWasChanged.bind( this ) );
        mutation.observe( body, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
        });
        this._mutation = mutation;
    } else {
        this.addEventListener( 'keyup', this._keyUpDetectChange );
    }

    // IE sometimes fires the beforepaste event twice; make sure it is not run
    // again before our after paste function is called.
    this._awaitingPaste = false;
    this.addEventListener( isIElt11 ? 'beforecut' : 'cut', onCut );
    this.addEventListener( isIElt11 ? 'beforepaste' : 'paste', onPaste );

    // Opera does not fire keydown repeatedly.
    this.addEventListener( isPresto ? 'keypress' : 'keydown', onKey );

    // Add key handlers
    this._keyHandlers = Object.create( keyHandlers );

    // Override default properties
    this.setConfig( config );

    // Fix IE<10's buggy implementation of Text#splitText.
    // If the split is at the end of the node, it doesn't insert the newly split
    // node into the document, and sets its value to undefined rather than ''.
    // And even if the split is not at the end, the original node is removed
    // from the document and replaced by another, rather than just having its
    // data shortened.
    // We used to feature test for this, but then found the feature test would
    // sometimes pass, but later on the buggy behaviour would still appear.
    // I think IE10 does not have the same bug, but it doesn't hurt to replace
    // its native fn too and then we don't need yet another UA category.
    if ( isIElt11 ) {
        win.Text.prototype.splitText = function ( offset ) {
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

    body.setAttribute( 'contenteditable', 'true' );

    // Remove Firefox's built-in controls
    try {
        doc.execCommand( 'enableObjectResizing', false, 'false' );
        doc.execCommand( 'enableInlineTableEditing', false, 'false' );
    } catch ( error ) {}

    instances.push( this );

    // Need to register instance before calling setHTML, so that the fixCursor
    // function can lookup any default block tag options set.
    this.setHTML( '' );
}

var proto = Squire.prototype;

proto.setConfig = function ( config ) {
    config = mergeObjects({
        blockTag: 'DIV',
        blockAttributes: null,
        tagAttributes: {
            blockquote: null,
            ul: null,
            ol: null,
            li: null
        }
    }, config );

    // Users may specify block tag in lower case
    config.blockTag = config.blockTag.toUpperCase();

    this._config = config;

    return this;
};

proto.createElement = function ( tag, props, children ) {
    return createElement( this._doc, tag, props, children );
};

proto.createDefaultBlock = function ( children ) {
    var config = this._config;
    return fixCursor(
        this.createElement( config.blockTag, config.blockAttributes, children )
    );
};

proto.didError = function ( error ) {
    console.log( error );
};

proto.getDocument = function () {
    return this._doc;
};

// --- Events ---

// Subscribing to these events won't automatically add a listener to the
// document node, since these events are fired in a custom manner by the
// editor code.
var customEvents = {
    focus: 1, blur: 1,
    pathChange: 1, select: 1, input: 1, undoStateChange: 1
};

proto.fireEvent = function ( type, event ) {
    var handlers = this._events[ type ],
        l, obj;
    if ( handlers ) {
        if ( !event ) {
            event = {};
        }
        if ( event.type !== type ) {
            event.type = type;
        }
        // Clone handlers array, so any handlers added/removed do not affect it.
        handlers = handlers.slice();
        l = handlers.length;
        while ( l-- ) {
            obj = handlers[l];
            try {
                if ( obj.handleEvent ) {
                    obj.handleEvent( event );
                } else {
                    obj.call( this, event );
                }
            } catch ( error ) {
                error.details = 'Squire: fireEvent error. Event type: ' + type;
                this.didError( error );
            }
        }
    }
    return this;
};

proto.destroy = function () {
    var win = this._win,
        doc = this._doc,
        events = this._events,
        type;
    win.removeEventListener( 'focus', this, false );
    win.removeEventListener( 'blur', this, false );
    for ( type in events ) {
        if ( !customEvents[ type ] ) {
            doc.removeEventListener( type, this, true );
        }
    }
    if ( this._mutation ) {
        this._mutation.disconnect();
    }
    var l = instances.length;
    while ( l-- ) {
        if ( instances[l] === this ) {
            instances.splice( l, 1 );
        }
    }
};

proto.handleEvent = function ( event ) {
    this.fireEvent( event.type, event );
};

proto.addEventListener = function ( type, fn ) {
    var handlers = this._events[ type ];
    if ( !fn ) {
        this.didError({
            name: 'Squire: addEventListener with null or undefined fn',
            message: 'Event type: ' + type
        });
        return this;
    }
    if ( !handlers ) {
        handlers = this._events[ type ] = [];
        if ( !customEvents[ type ] ) {
            this._doc.addEventListener( type, this, true );
        }
    }
    handlers.push( fn );
    return this;
};

proto.removeEventListener = function ( type, fn ) {
    var handlers = this._events[ type ],
        l;
    if ( handlers ) {
        l = handlers.length;
        while ( l-- ) {
            if ( handlers[l] === fn ) {
                handlers.splice( l, 1 );
            }
        }
        if ( !handlers.length ) {
            delete this._events[ type ];
            if ( !customEvents[ type ] ) {
                this._doc.removeEventListener( type, this, false );
            }
        }
    }
    return this;
};

// --- Selection and Path ---

proto._createRange =
        function ( range, startOffset, endContainer, endOffset ) {
    if ( range instanceof this._win.Range ) {
        return range.cloneRange();
    }
    var domRange = this._doc.createRange();
    domRange.setStart( range, startOffset );
    if ( endContainer ) {
        domRange.setEnd( endContainer, endOffset );
    } else {
        domRange.setEnd( range, startOffset );
    }
    return domRange;
};

proto._moveCursorTo = function ( toStart ) {
    var body = this._body,
        range = this._createRange( body, toStart ? 0 : body.childNodes.length );
    moveRangeBoundariesDownTree( range );
    this.setSelection( range );
    return this;
};
proto.moveCursorToStart = function () {
    return this._moveCursorTo( true );
};
proto.moveCursorToEnd = function () {
    return this._moveCursorTo( false );
};

proto.setSelection = function ( range ) {
    if ( range ) {
        // iOS bug: if you don't focus the iframe before setting the
        // selection, you can end up in a state where you type but the input
        // doesn't get directed into the contenteditable area but is instead
        // lost in a black hole. Very strange.
        if ( isIOS ) {
            this._win.focus();
        }
        var sel = this._getWindowSelection();
        if ( sel ) {
            sel.removeAllRanges();
            sel.addRange( range );
        }
    }
    return this;
};

proto._getWindowSelection = function () {
    return this._win.getSelection() || null;
};

proto.getSelection = function () {
    var sel = this._getWindowSelection(),
        selection, startContainer, endContainer;
    if ( sel && sel.rangeCount ) {
        selection  = sel.getRangeAt( 0 ).cloneRange();
        startContainer = selection.startContainer;
        endContainer = selection.endContainer;
        // FF can return the selection as being inside an <img>. WTF?
        if ( startContainer && isLeaf( startContainer ) ) {
            selection.setStartBefore( startContainer );
        }
        if ( endContainer && isLeaf( endContainer ) ) {
            selection.setEndBefore( endContainer );
        }
        this._lastSelection = selection;
    } else {
        selection = this._lastSelection;
    }
    if ( !selection ) {
        selection = this._createRange( this._body.firstChild, 0 );
    }
    return selection;
};

proto.getSelectedText = function () {
    var range = this.getSelection(),
        walker = new TreeWalker(
            range.commonAncestorContainer,
            SHOW_TEXT|SHOW_ELEMENT,
            function ( node ) {
                return isNodeContainedInRange( range, node, true );
            }
        ),
        startContainer = range.startContainer,
        endContainer = range.endContainer,
        node = walker.currentNode = startContainer,
        textContent = '',
        addedTextInBlock = false,
        value;

    if ( !walker.filter( node ) ) {
        node = walker.nextNode();
    }

    while ( node ) {
        if ( node.nodeType === TEXT_NODE ) {
            value = node.data;
            if ( value && ( /\S/.test( value ) ) ) {
                if ( node === endContainer ) {
                    value = value.slice( 0, range.endOffset );
                }
                if ( node === startContainer ) {
                    value = value.slice( range.startOffset );
                }
                textContent += value;
                addedTextInBlock = true;
            }
        } else if ( node.nodeName === 'BR' ||
                addedTextInBlock && !isInline( node ) ) {
            textContent += '\n';
            addedTextInBlock = false;
        }
        node = walker.nextNode();
    }

    return textContent;
};

proto.getPath = function () {
    return this._path;
};

// --- Workaround for browsers that can't focus empty text nodes ---

// WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=15256

var removeZWS = function ( root ) {
    var walker = new TreeWalker( root, SHOW_TEXT, function () {
            return true;
        }, false ),
        parent, node, index;
    while ( node = walker.nextNode() ) {
        while ( ( index = node.data.indexOf( ZWS ) ) > -1 ) {
            if ( node.length === 1 ) {
                do {
                    parent = node.parentNode;
                    parent.removeChild( node );
                    node = parent;
                } while ( isInline( node ) && !getLength( node ) );
                break;
            } else {
                node.deleteData( index, 1 );
            }
        }
    }
};

proto._didAddZWS = function () {
    this._hasZWS = true;
};
proto._removeZWS = function () {
    if ( !this._hasZWS ) {
        return;
    }
    removeZWS( this._body );
    this._hasZWS = false;
};

// --- Path change events ---

proto._updatePath = function ( range, force ) {
    var anchor = range.startContainer,
        focus = range.endContainer,
        newPath;
    if ( force || anchor !== this._lastAnchorNode ||
            focus !== this._lastFocusNode ) {
        this._lastAnchorNode = anchor;
        this._lastFocusNode = focus;
        newPath = ( anchor && focus ) ? ( anchor === focus ) ?
            getPath( focus ) : '(selection)' : '';
        if ( this._path !== newPath ) {
            this._path = newPath;
            this.fireEvent( 'pathChange', { path: newPath } );
        }
    }
    if ( !range.collapsed ) {
        this.fireEvent( 'select' );
    }
};

proto._updatePathOnEvent = function () {
    this._updatePath( this.getSelection() );
};

// --- Focus ---

proto.focus = function () {
    // FF seems to need the body to be focussed (at least on first load).
    // Chrome also now needs body to be focussed in order to show the cursor
    // (otherwise it is focussed, but the cursor doesn't appear).
    // Opera (Presto-variant) however will lose the selection if you call this!
    if ( !isPresto ) {
        this._body.focus();
    }
    this._win.focus();
    return this;
};

proto.blur = function () {
    // IE will remove the whole browser window from focus if you call
    // win.blur() or body.blur(), so instead we call top.focus() to focus
    // the top frame, thus blurring this frame. This works in everything
    // except FF, so we need to call body.blur() in that as well.
    if ( isGecko ) {
        this._body.blur();
    }
    top.focus();
    return this;
};

// --- Bookmarking ---

var startSelectionId = 'squire-selection-start';
var endSelectionId = 'squire-selection-end';

proto._saveRangeToBookmark = function ( range ) {
    var startNode = this.createElement( 'INPUT', {
            id: startSelectionId,
            type: 'hidden'
        }),
        endNode = this.createElement( 'INPUT', {
            id: endSelectionId,
            type: 'hidden'
        }),
        temp;

    insertNodeInRange( range, startNode );
    range.collapse( false );
    insertNodeInRange( range, endNode );

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

proto._getRangeAndRemoveBookmark = function ( range ) {
    var doc = this._doc,
        start = doc.getElementById( startSelectionId ),
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

        moveRangeBoundariesDownTree( range );
        if ( collapsed ) {
            range.collapse( true );
        }
    }
    return range || null;
};

// --- Undo ---

proto._keyUpDetectChange = function ( event ) {
    var code = event.keyCode;
    // Presume document was changed if:
    // 1. A modifier key (other than shift) wasn't held down
    // 2. The key pressed is not in range 16<=x<=20 (control keys)
    // 3. The key pressed is not in range 33<=x<=45 (navigation keys)
    if ( !event.ctrlKey && !event.metaKey && !event.altKey &&
            ( code < 16 || code > 20 ) &&
            ( code < 33 || code > 45 ) ) {
        this._docWasChanged();
    }
};

proto._docWasChanged = function () {
    if ( canObserveMutations && this._ignoreChange ) {
        this._ignoreChange = false;
        return;
    }
    if ( this._isInUndoState ) {
        this._isInUndoState = false;
        this.fireEvent( 'undoStateChange', {
            canUndo: true,
            canRedo: false
        });
    }
    this.fireEvent( 'input' );
};

// Leaves bookmark
proto._recordUndoState = function ( range ) {
    // Don't record if we're already in an undo state
    if ( !this._isInUndoState ) {
        // Advance pointer to new position
        var undoIndex = this._undoIndex += 1,
            undoStack = this._undoStack;

        // Truncate stack if longer (i.e. if has been previously undone)
        if ( undoIndex < this._undoStackLength ) {
            undoStack.length = this._undoStackLength = undoIndex;
        }

        // Write out data
        if ( range ) {
            this._saveRangeToBookmark( range );
        }
        undoStack[ undoIndex ] = this._getHTML();
        this._undoStackLength += 1;
        this._isInUndoState = true;
    }
};

proto.undo = function () {
    // Sanity check: must not be at beginning of the history stack
    if ( this._undoIndex !== 0 || !this._isInUndoState ) {
        // Make sure any changes since last checkpoint are saved.
        this._recordUndoState( this.getSelection() );

        this._undoIndex -= 1;
        this._setHTML( this._undoStack[ this._undoIndex ] );
        var range = this._getRangeAndRemoveBookmark();
        if ( range ) {
            this.setSelection( range );
        }
        this._isInUndoState = true;
        this.fireEvent( 'undoStateChange', {
            canUndo: this._undoIndex !== 0,
            canRedo: true
        });
        this.fireEvent( 'input' );
    }
    return this;
};

proto.redo = function () {
    // Sanity check: must not be at end of stack and must be in an undo
    // state.
    var undoIndex = this._undoIndex,
        undoStackLength = this._undoStackLength;
    if ( undoIndex + 1 < undoStackLength && this._isInUndoState ) {
        this._undoIndex += 1;
        this._setHTML( this._undoStack[ this._undoIndex ] );
        var range = this._getRangeAndRemoveBookmark();
        if ( range ) {
            this.setSelection( range );
        }
        this.fireEvent( 'undoStateChange', {
            canUndo: true,
            canRedo: undoIndex + 2 < undoStackLength
        });
        this.fireEvent( 'input' );
    }
    return this;
};

// --- Inline formatting ---

// Looks for matching tag and attributes, so won't work
// if <strong> instead of <b> etc.
proto.hasFormat = function ( tag, attributes, range ) {
    // 1. Normalise the arguments and get selection
    tag = tag.toUpperCase();
    if ( !attributes ) { attributes = {}; }
    if ( !range && !( range = this.getSelection() ) ) {
        return false;
    }

    // Sanitize range to prevent weird IE artifacts
    if ( !range.collapsed &&
            range.startContainer.nodeType === TEXT_NODE &&
            range.startOffset === range.startContainer.length &&
            range.startContainer.nextSibling ) {
        range.setStartBefore( range.startContainer.nextSibling );
    }
    if ( !range.collapsed &&
            range.endContainer.nodeType === TEXT_NODE &&
            range.endOffset === 0 &&
            range.endContainer.previousSibling ) {
        range.setEndAfter( range.endContainer.previousSibling );
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
        return isNodeContainedInRange( range, node, true );
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

// Extracts the font-family and font-size (if any) of the element
// holding the cursor. If there's a selection, returns an empty object.
proto.getFontInfo = function ( range ) {
    var fontInfo = {
            family: undefined,
            size: undefined
        },
        element, style;

    if ( !range && !( range = this.getSelection() ) ) {
        return fontInfo;
    }

    element = range.commonAncestorContainer;
    if ( range.collapsed || element.nodeType === TEXT_NODE ) {
        if ( element.nodeType === TEXT_NODE ) {
            element = element.parentNode;
        }
        while ( !( fontInfo.family && fontInfo.size ) &&
                element && ( style = element.style ) ) {
            if ( !fontInfo.family ) {
                fontInfo.family = style.fontFamily;
            }
            if ( !fontInfo.size ) {
                fontInfo.size = style.fontSize;
            }
            element = element.parentNode;
        }
    }
    return fontInfo;
 };

proto._addFormat = function ( tag, attributes, range ) {
    // If the range is collapsed we simply insert the node by wrapping
    // it round the range and focus it.
    var el, walker, startContainer, endContainer, startOffset, endOffset,
        node, needsFormat;

    if ( range.collapsed ) {
        el = fixCursor( this.createElement( tag, attributes ) );
        insertNodeInRange( range, el );
        range.setStart( el.firstChild, el.firstChild.length );
        range.collapse( true );
    }
    // Otherwise we find all the textnodes in the range (splitting
    // partially selected nodes) and if they're not already formatted
    // correctly we wrap them in the appropriate tag.
    else {
        // Create an iterator to walk over all the text nodes under this
        // ancestor which are in the range and not already formatted
        // correctly.
        //
        // In Blink/WebKit, empty blocks may have no text nodes, just a <br>.
        // Therefore we wrap this in the tag as well, as this will then cause it
        // to apply when the user types something in the block, which is
        // presumably what was intended.
        //
        // IMG tags are included because we may want to create a link around them,
        // and adding other styles is harmless.
        walker = new TreeWalker(
            range.commonAncestorContainer,
            SHOW_TEXT|SHOW_ELEMENT,
            function ( node ) {
                return ( node.nodeType === TEXT_NODE ||
                        node.nodeName === 'BR' ||
                        node.nodeName === 'IMG'
                    ) && isNodeContainedInRange( range, node, true );
            },
            false
        );

        // Start at the beginning node of the range and iterate through
        // all the nodes in the range that need formatting.
        startContainer = range.startContainer;
        startOffset = range.startOffset;
        endContainer = range.endContainer;
        endOffset = range.endOffset;

        // Make sure we start with a valid node.
        walker.currentNode = startContainer;
        if ( !walker.filter( startContainer ) ) {
            startContainer = walker.nextNode();
            startOffset = 0;
        }

        // If there are no interesting nodes in the selection, abort
        if ( !startContainer ) {
            return range;
        }

        do {
            node = walker.currentNode;
            needsFormat = !getNearest( node, tag, attributes );
            if ( needsFormat ) {
                // <br> can never be a container node, so must have a text node
                // if node == (end|start)Container
                if ( node === endContainer && node.length > endOffset ) {
                    node.splitText( endOffset );
                }
                if ( node === startContainer && startOffset ) {
                    node = node.splitText( startOffset );
                    if ( endContainer === startContainer ) {
                        endContainer = node;
                        endOffset -= startOffset;
                    }
                    startContainer = node;
                    startOffset = 0;
                }
                el = this.createElement( tag, attributes );
                replaceWith( node, el );
                el.appendChild( node );
            }
        } while ( walker.nextNode() );

        // If we don't finish inside a text node, offset may have changed.
        if ( endContainer.nodeType !== TEXT_NODE ) {
            if ( node.nodeType === TEXT_NODE ) {
                endContainer = node;
                endOffset = node.length;
            } else {
                // If <br>, we must have just wrapped it, so it must have only
                // one child
                endContainer = node.parentNode;
                endOffset = 1;
            }
        }

        // Now set the selection to as it was before
        range = this._createRange(
            startContainer, startOffset, endContainer, endOffset );
    }
    return range;
};

proto._removeFormat = function ( tag, attributes, range, partial ) {
    // Add bookmark
    this._saveRangeToBookmark( range );

    // We need a node in the selection to break the surrounding
    // formatted text.
    var doc = this._doc,
        fixer;
    if ( range.collapsed ) {
        if ( cantFocusEmptyTextNodes ) {
            fixer = doc.createTextNode( ZWS );
            this._didAddZWS();
        } else {
            fixer = doc.createTextNode( '' );
        }
        insertNodeInRange( range, fixer );
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
            if ( isNodeContainedInRange( range, node, false ) ) {
                return;
            }

            var isText = ( node.nodeType === TEXT_NODE ),
                child, next;

            // If not at least partially contained, wrap entire contents
            // in a clone of the tag we're removing and we're done.
            if ( !isNodeContainedInRange( range, node, true ) ) {
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
                return isNodeContainedInRange( range, el, true ) &&
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
    this._getRangeAndRemoveBookmark( range );
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

proto.changeFormat = function ( add, remove, range, partial ) {
    // Normalise the arguments and get selection
    if ( !range && !( range = this.getSelection() ) ) {
        return;
    }

    // Save undo checkpoint
    this._recordUndoState( range );
    this._getRangeAndRemoveBookmark( range );

    if ( remove ) {
        range = this._removeFormat( remove.tag.toUpperCase(),
            remove.attributes || {}, range, partial );
    }
    if ( add ) {
        range = this._addFormat( add.tag.toUpperCase(),
            add.attributes || {}, range );
    }

    this.setSelection( range );
    this._updatePath( range, true );

    // We're not still in an undo state
    if ( !canObserveMutations ) {
        this._docWasChanged();
    }

    return this;
};

// --- Block formatting ---

var tagAfterSplit = {
    DT:  'DD',
    DD:  'DT',
    LI:  'LI'
};

var splitBlock = function ( self, block, node, offset ) {
    var splitTag = tagAfterSplit[ block.nodeName ],
        splitProperties = null,
        nodeAfterSplit = split( node, offset, block.parentNode ),
        config = self._config;

    if ( !splitTag ) {
        splitTag = config.blockTag;
        splitProperties = config.blockAttributes;
    }

    // Make sure the new node is the correct type.
    if ( !hasTagAttributes( nodeAfterSplit, splitTag, splitProperties ) ) {
        block = createElement( nodeAfterSplit.ownerDocument,
            splitTag, splitProperties );
        if ( nodeAfterSplit.dir ) {
            block.dir = nodeAfterSplit.dir;
        }
        replaceWith( nodeAfterSplit, block );
        block.appendChild( empty( nodeAfterSplit ) );
        nodeAfterSplit = block;
    }
    return nodeAfterSplit;
};

proto.forEachBlock = function ( fn, mutates, range ) {
    if ( !range && !( range = this.getSelection() ) ) {
        return this;
    }

    // Save undo checkpoint
    if ( mutates ) {
        this._recordUndoState( range );
        this._getRangeAndRemoveBookmark( range );
    }

    var start = getStartBlockOfRange( range ),
        end = getEndBlockOfRange( range );
    if ( start && end ) {
        do {
            if ( fn( start ) || start === end ) { break; }
        } while ( start = getNextBlock( start ) );
    }

    if ( mutates ) {
        this.setSelection( range );

        // Path may have changed
        this._updatePath( range, true );

        // We're not still in an undo state
        if ( !canObserveMutations ) {
            this._docWasChanged();
        }
    }
    return this;
};

proto.modifyBlocks = function ( modify, range ) {
    if ( !range && !( range = this.getSelection() ) ) {
        return this;
    }

    // 1. Save undo checkpoint and bookmark selection
    if ( this._isInUndoState ) {
        this._saveRangeToBookmark( range );
    } else {
        this._recordUndoState( range );
    }

    // 2. Expand range to block boundaries
    expandRangeToBlockBoundaries( range );

    // 3. Remove range.
    var body = this._body,
        frag;
    moveRangeBoundariesUpTree( range, body );
    frag = extractContentsOfRange( range, body );

    // 4. Modify tree of fragment and reinsert.
    insertNodeInRange( range, modify.call( this, frag ) );

    // 5. Merge containers at edges
    if ( range.endOffset < range.endContainer.childNodes.length ) {
        mergeContainers( range.endContainer.childNodes[ range.endOffset ] );
    }
    mergeContainers( range.startContainer.childNodes[ range.startOffset ] );

    // 6. Restore selection
    this._getRangeAndRemoveBookmark( range );
    this.setSelection( range );
    this._updatePath( range, true );

    // 7. We're not still in an undo state
    if ( !canObserveMutations ) {
        this._docWasChanged();
    }

    return this;
};

var increaseBlockQuoteLevel = function ( frag ) {
    return this.createElement( 'BLOCKQUOTE',
        this._config.tagAttributes.blockquote, [
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

var removeBlockQuote = function (/* frag */) {
    return this.createDefaultBlock([
        this.createElement( 'INPUT', {
            id: startSelectionId,
            type: 'hidden'
        }),
        this.createElement( 'INPUT', {
            id: endSelectionId,
            type: 'hidden'
        })
    ]);
};

var makeList = function ( self, frag, type ) {
    var walker = getBlockWalker( frag ),
        node, tag, prev, newLi,
        tagAttributes = self._config.tagAttributes,
        listAttrs = tagAttributes[ type.toLowerCase() ],
        listItemAttrs = tagAttributes.li;

    while ( node = walker.nextNode() ) {
        tag = node.parentNode.nodeName;
        if ( tag !== 'LI' ) {
            newLi = self.createElement( 'LI', listItemAttrs );
            if ( node.dir ) {
                newLi.dir = node.dir;
            }

            // Have we replaced the previous block with a new <ul>/<ol>?
            if ( ( prev = node.previousSibling ) &&
                    prev.nodeName === type ) {
                prev.appendChild( newLi );
            }
            // Otherwise, replace this block with the <ul>/<ol>
            else {
                replaceWith(
                    node,
                    self.createElement( type, listAttrs, [
                        newLi
                    ])
                );
            }
            newLi.appendChild( node );
        } else {
            node = node.parentNode.parentNode;
            tag = node.nodeName;
            if ( tag !== type && ( /^[OU]L$/.test( tag ) ) ) {
                replaceWith( node,
                    self.createElement( type, listAttrs, [ empty( node ) ] )
                );
            }
        }
    }
};

var makeUnorderedList = function ( frag ) {
    makeList( this, frag, 'UL' );
    return frag;
};

var makeOrderedList = function ( frag ) {
    makeList( this, frag, 'OL' );
    return frag;
};

var removeList = function ( frag ) {
    var lists = frag.querySelectorAll( 'UL, OL' ),
        i, l, ll, list, listFrag, children, child;
    for ( i = 0, l = lists.length; i < l; i += 1 ) {
        list = lists[i];
        listFrag = empty( list );
        children = listFrag.childNodes;
        ll = children.length;
        while ( ll-- ) {
            child = children[ll];
            replaceWith( child, empty( child ) );
        }
        fixContainer( listFrag );
        replaceWith( list, listFrag );
    }
    return frag;
};

var increaseListLevel = function ( frag ) {
    var items = frag.querySelectorAll( 'LI' ),
        i, l, item,
        type, newParent,
        tagAttributes = this._config.tagAttributes,
        listItemAttrs = tagAttributes.li,
        listAttrs;
    for ( i = 0, l = items.length; i < l; i += 1 ) {
        item = items[i];
        if ( !isContainer( item.firstChild ) ) {
            // type => 'UL' or 'OL'
            type = item.parentNode.nodeName;
            newParent = item.previousSibling;
            if ( !newParent || !( newParent = newParent.lastChild ) ||
                    newParent.nodeName !== type ) {
                listAttrs = tagAttributes[ type.toLowerCase() ];
                replaceWith(
                    item,
                    this.createElement( 'LI', listItemAttrs, [
                        newParent = this.createElement( type, listAttrs )
                    ])
                );
            }
            newParent.appendChild( item );
        }
    }
    return frag;
};

var decreaseListLevel = function ( frag ) {
    var items = frag.querySelectorAll( 'LI' );
    Array.prototype.filter.call( items, function ( el ) {
        return !isContainer( el.firstChild );
    }).forEach( function ( item ) {
        var parent = item.parentNode,
            newParent = parent.parentNode,
            first = item.firstChild,
            node = first,
            next;
        if ( item.previousSibling ) {
            parent = split( parent, item, newParent );
        }
        while ( node ) {
            next = node.nextSibling;
            if ( isContainer( node ) ) {
                break;
            }
            newParent.insertBefore( node, parent );
            node = next;
        }
        if ( newParent.nodeName === 'LI' && first.previousSibling ) {
            split( newParent, first, newParent.parentNode );
        }
        while ( item !== frag && !item.childNodes.length ) {
            parent = item.parentNode;
            parent.removeChild( item );
            item = parent;
        }
    }, this );
    fixContainer( frag );
    return frag;
};

proto._ensureBottomLine = function () {
    var body = this._body,
        last = body.lastElementChild;
    if ( !last ||
            last.nodeName !== this._config.blockTag || !isBlock( last ) ) {
        body.appendChild( this.createDefaultBlock() );
    }
};

// --- Keyboard interaction ---

proto.setKeyHandler = function ( key, fn ) {
    this._keyHandlers[ key ] = fn;
    return this;
};

// --- Get/Set data ---

proto._getHTML = function () {
    return this._body.innerHTML;
};

proto._setHTML = function ( html ) {
    var node = this._body;
    node.innerHTML = html;
    do {
        fixCursor( node );
    } while ( node = getNextBlock( node ) );
    this._ignoreChange = true;
};

proto.getHTML = function ( withBookMark ) {
    var brs = [],
        node, fixer, html, l, range;
    if ( withBookMark && ( range = this.getSelection() ) ) {
        this._saveRangeToBookmark( range );
    }
    if ( useTextFixer ) {
        node = this._body;
        while ( node = getNextBlock( node ) ) {
            if ( !node.textContent && !node.querySelector( 'BR' ) ) {
                fixer = this.createElement( 'BR' );
                node.appendChild( fixer );
                brs.push( fixer );
            }
        }
    }
    html = this._getHTML().replace( /\u200B/g, '' );
    if ( useTextFixer ) {
        l = brs.length;
        while ( l-- ) {
            detach( brs[l] );
        }
    }
    if ( range ) {
        this._getRangeAndRemoveBookmark( range );
    }
    return html;
};

proto.setHTML = function ( html ) {
    var frag = this._doc.createDocumentFragment(),
        div = this.createElement( 'DIV' ),
        child;

    // Parse HTML into DOM tree
    div.innerHTML = html;
    frag.appendChild( empty( div ) );

    cleanTree( frag );
    cleanupBRs( frag );

    fixContainer( frag );

    // Fix cursor
    var node = frag;
    while ( node = getNextBlock( node ) ) {
        fixCursor( node );
    }

    // Don't fire an input event
    this._ignoreChange = true;

    // Remove existing body children
    var body = this._body;
    while ( child = body.lastChild ) {
        body.removeChild( child );
    }

    // And insert new content
    body.appendChild( frag );
    fixCursor( body );

    // Reset the undo stack
    this._undoIndex = -1;
    this._undoStack.length = 0;
    this._undoStackLength = 0;
    this._isInUndoState = false;

    // Record undo state
    var range = this._getRangeAndRemoveBookmark() ||
        this._createRange( body.firstChild, 0 );
    this._recordUndoState( range );
    this._getRangeAndRemoveBookmark( range );
    // IE will also set focus when selecting text so don't use
    // setSelection. Instead, just store it in lastSelection, so if
    // anything calls getSelection before first focus, we have a range
    // to return.
    if ( losesSelectionOnBlur ) {
        this._lastSelection = range;
    } else {
        this.setSelection( range );
    }
    this._updatePath( range, true );

    return this;
};

proto.insertElement = function ( el, range ) {
    if ( !range ) { range = this.getSelection(); }
    range.collapse( true );
    if ( isInline( el ) ) {
        insertNodeInRange( range, el );
        range.setStartAfter( el );
    } else {
        // Get containing block node.
        var body = this._body,
            splitNode = getStartBlockOfRange( range ) || body,
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
        } else {
            body.appendChild( el );
            // Insert blank line below block.
            nodeAfterSplit = this.createDefaultBlock();
            body.appendChild( nodeAfterSplit );
        }
        range.setStart( nodeAfterSplit, 0 );
        range.setEnd( nodeAfterSplit, 0 );
        moveRangeBoundariesDownTree( range );
    }
    this.focus();
    this.setSelection( range );
    this._updatePath( range );
    return this;
};

proto.insertImage = function ( src, attributes ) {
    var img = this.createElement( 'IMG', mergeObjects({
        src: src
    }, attributes ));
    this.insertElement( img );
    return img;
};

var linkRegExp = /\b((?:(?:ht|f)tps?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,}\/)(?:[^\s()<>]+|\([^\s()<>]+\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))|([\w\-.%+]+@(?:[\w\-]+\.)+[A-Z]{2,}\b)/i;

var addLinks = function ( frag ) {
    var doc = frag.ownerDocument,
        walker = new TreeWalker( frag, SHOW_TEXT,
                function ( node ) {
            return !getNearest( node, 'A' );
        }, false ),
        node, data, parent, match, index, endIndex, child;
    while ( node = walker.nextNode() ) {
        data = node.data;
        parent = node.parentNode;
        while ( match = linkRegExp.exec( data ) ) {
            index = match.index;
            endIndex = index + match[0].length;
            if ( index ) {
                child = doc.createTextNode( data.slice( 0, index ) );
                parent.insertBefore( child, node );
            }
            child = doc.createElement( 'A' );
            child.textContent = data.slice( index, endIndex );
            child.href = match[1] ?
                /^(?:ht|f)tps?:/.test( match[1] ) ?
                    match[1] :
                    'http://' + match[1] :
                'mailto:' + match[2];
            parent.insertBefore( child, node );
            node.data = data = data.slice( endIndex );
        }
    }
};

// Insert HTML at the cursor location. If the selection is not collapsed
// insertTreeFragmentIntoRange will delete the selection so that it is replaced
// by the html being inserted.
proto.insertHTML = function ( html, isPaste ) {
    var range = this.getSelection(),
        frag = this._doc.createDocumentFragment(),
        div = this.createElement( 'DIV' );

    // Parse HTML into DOM tree
    div.innerHTML = html;
    frag.appendChild( empty( div ) );

    // Record undo checkpoint
    this._recordUndoState( range );
    this._getRangeAndRemoveBookmark( range );

    try {
        var node = frag;
        var event = {
            fragment: frag,
            preventDefault: function () {
                this.defaultPrevented = true;
            },
            defaultPrevented: false
        };

        addLinks( frag );
        cleanTree( frag );
        cleanupBRs( frag );
        removeEmptyInlines( frag );
        frag.normalize();

        while ( node = getNextBlock( node ) ) {
            fixCursor( node );
        }

        if ( isPaste ) {
            this.fireEvent( 'willPaste', event );
        }

        if ( !event.defaultPrevented ) {
            insertTreeFragmentIntoRange( range, event.fragment );
            if ( !canObserveMutations ) {
                this._docWasChanged();
            }
            range.collapse( false );
            this._ensureBottomLine();
        }

        this.setSelection( range );
        this._updatePath( range, true );
    } catch ( error ) {
        this.didError( error );
    }
    return this;
};

proto.insertPlainText = function ( plainText, isPaste ) {
    var lines = plainText.split( '\n' ),
        i, l;
    for ( i = 1, l = lines.length - 1; i < l; i += 1 ) {
        lines[i] = '<DIV>' +
            lines[i].split( '&' ).join( '&amp;' )
                    .split( '<' ).join( '&lt;'  )
                    .split( '>' ).join( '&gt;'  )
                    .replace( / (?= )/g, '&nbsp;' ) +
        '</DIV>';
    }
    return this.insertHTML( lines.join( '' ), isPaste );
};

// --- Formatting ---

var command = function ( method, arg, arg2 ) {
    return function () {
        this[ method ]( arg, arg2 );
        return this.focus();
    };
};

proto.addStyles = function ( styles ) {
    if ( styles ) {
        var head = this._doc.documentElement.firstChild,
            style = this.createElement( 'STYLE', {
                type: 'text/css'
            });
        style.appendChild( this._doc.createTextNode( styles ) );
        head.appendChild( style );
    }
    return this;
};

proto.bold = command( 'changeFormat', { tag: 'B' } );
proto.italic = command( 'changeFormat', { tag: 'I' } );
proto.underline = command( 'changeFormat', { tag: 'U' } );
proto.strikethrough = command( 'changeFormat', { tag: 'S' } );
proto.subscript = command( 'changeFormat', { tag: 'SUB' }, { tag: 'SUP' } );
proto.superscript = command( 'changeFormat', { tag: 'SUP' }, { tag: 'SUB' } );

proto.removeBold = command( 'changeFormat', null, { tag: 'B' } );
proto.removeItalic = command( 'changeFormat', null, { tag: 'I' } );
proto.removeUnderline = command( 'changeFormat', null, { tag: 'U' } );
proto.removeStrikethrough = command( 'changeFormat', null, { tag: 'S' } );
proto.removeSubscript = command( 'changeFormat', null, { tag: 'SUB' } );
proto.removeSuperscript = command( 'changeFormat', null, { tag: 'SUP' } );

proto.makeLink = function ( url, attributes ) {
    var range = this.getSelection();
    if ( range.collapsed ) {
        var protocolEnd = url.indexOf( ':' ) + 1;
        if ( protocolEnd ) {
            while ( url[ protocolEnd ] === '/' ) { protocolEnd += 1; }
        }
        insertNodeInRange(
            range,
            this._doc.createTextNode( url.slice( protocolEnd ) )
        );
    }

    if ( !attributes ) {
        attributes = {};
    }
    attributes.href = url;

    this.changeFormat({
        tag: 'A',
        attributes: attributes
    }, {
        tag: 'A'
    }, range );
    return this.focus();
};
proto.removeLink = function () {
    this.changeFormat( null, {
        tag: 'A'
    }, this.getSelection(), true );
    return this.focus();
};

proto.setFontFace = function ( name ) {
    this.changeFormat({
        tag: 'SPAN',
        attributes: {
            'class': 'font',
            style: 'font-family: ' + name + ', sans-serif;'
        }
    }, {
        tag: 'SPAN',
        attributes: { 'class': 'font' }
    });
    return this.focus();
};
proto.setFontSize = function ( size ) {
    this.changeFormat({
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
    return this.focus();
};

proto.setTextColour = function ( colour ) {
    this.changeFormat({
        tag: 'SPAN',
        attributes: {
            'class': 'colour',
            style: 'color: ' + colour
        }
    }, {
        tag: 'SPAN',
        attributes: { 'class': 'colour' }
    });
    return this.focus();
};

proto.setHighlightColour = function ( colour ) {
    this.changeFormat({
        tag: 'SPAN',
        attributes: {
            'class': 'highlight',
            style: 'background-color: ' + colour
        }
    }, {
        tag: 'SPAN',
        attributes: { 'class': 'highlight' }
    });
    return this.focus();
};

proto.setTextAlignment = function ( alignment ) {
    this.forEachBlock( function ( block ) {
        block.className = ( block.className
            .split( /\s+/ )
            .filter( function ( klass ) {
                return !( /align/.test( klass ) );
            })
            .join( ' ' ) +
            ' align-' + alignment ).trim();
        block.style.textAlign = alignment;
    }, true );
    return this.focus();
};

proto.setTextDirection = function ( direction ) {
    this.forEachBlock( function ( block ) {
        block.dir = direction;
    }, true );
    return this.focus();
};

function removeFormatting ( self, root, clean ) {
    var node, next;
    for ( node = root.firstChild; node; node = next ) {
        next = node.nextSibling;
        if ( isInline( node ) ) {
            if ( node.nodeType === TEXT_NODE || node.nodeName === 'BR' || node.nodeName === 'IMG' ) {
                clean.appendChild( node );
                continue;
            }
        } else if ( isBlock( node ) ) {
            clean.appendChild( self.createDefaultBlock([
                removeFormatting(
                    self, node, self._doc.createDocumentFragment() )
            ]));
            continue;
        }
        removeFormatting( self, node, clean );
    }
    return clean;
}

proto.removeAllFormatting = function ( range ) {
    if ( !range && !( range = this.getSelection() ) || range.collapsed ) {
        return this;
    }

    var stopNode = range.commonAncestorContainer;
    while ( stopNode && !isBlock( stopNode ) ) {
        stopNode = stopNode.parentNode;
    }
    if ( !stopNode ) {
        expandRangeToBlockBoundaries( range );
        stopNode = this._body;
    }
    if ( stopNode.nodeType === TEXT_NODE ) {
        return this;
    }

    // Record undo point
    this._recordUndoState( range );
    this._getRangeAndRemoveBookmark( range );


    // Avoid splitting where we're already at edges.
    moveRangeBoundariesUpTree( range, stopNode );

    // Split the selection up to the block, or if whole selection in same
    // block, expand range boundaries to ends of block and split up to body.
    var doc = stopNode.ownerDocument;
    var startContainer = range.startContainer;
    var startOffset = range.startOffset;
    var endContainer = range.endContainer;
    var endOffset = range.endOffset;

    // Split end point first to avoid problems when end and start
    // in same container.
    var formattedNodes = doc.createDocumentFragment();
    var cleanNodes = doc.createDocumentFragment();
    var nodeAfterSplit = split( endContainer, endOffset, stopNode );
    var nodeInSplit = split( startContainer, startOffset, stopNode );
    var nextNode, _range, childNodes;

    // Then replace contents in split with a cleaned version of the same:
    // blocks become default blocks, text and leaf nodes survive, everything
    // else is obliterated.
    while ( nodeInSplit !== nodeAfterSplit ) {
        nextNode = nodeInSplit.nextSibling;
        formattedNodes.appendChild( nodeInSplit );
        nodeInSplit = nextNode;
    }
    removeFormatting( this, formattedNodes, cleanNodes );
    cleanNodes.normalize();
    nodeInSplit = cleanNodes.firstChild;
    nextNode = cleanNodes.lastChild;

    // Restore selection
    childNodes = stopNode.childNodes;
    if ( nodeInSplit ) {
        stopNode.insertBefore( cleanNodes, nodeAfterSplit );
        startOffset = indexOf.call( childNodes, nodeInSplit );
        endOffset = indexOf.call( childNodes, nextNode ) + 1;
    } else {
        startOffset = indexOf.call( childNodes, nodeAfterSplit );
        endOffset = startOffset;
    }

    // Merge text nodes at edges, if possible
    _range = {
        startContainer: stopNode,
        startOffset: startOffset,
        endContainer: stopNode,
        endOffset: endOffset
    };
    mergeInlines( stopNode, _range );
    range.setStart( _range.startContainer, _range.startOffset );
    range.setEnd( _range.endContainer, _range.endOffset );

    // And move back down the tree
    moveRangeBoundariesDownTree( range );

    this.setSelection( range );
    this._updatePath( range, true );

    return this.focus();
};

proto.increaseQuoteLevel = command( 'modifyBlocks', increaseBlockQuoteLevel );
proto.decreaseQuoteLevel = command( 'modifyBlocks', decreaseBlockQuoteLevel );

proto.makeUnorderedList = command( 'modifyBlocks', makeUnorderedList );
proto.makeOrderedList = command( 'modifyBlocks', makeOrderedList );
proto.removeList = command( 'modifyBlocks', removeList );

proto.increaseListLevel = command( 'modifyBlocks', increaseListLevel );
proto.decreaseListLevel = command( 'modifyBlocks', decreaseListLevel );
