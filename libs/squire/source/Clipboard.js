/*jshint strict:false, undef:false, unused:false */

var onCut = function () {
    // Save undo checkpoint
    var range = this.getSelection();
    var self = this;
    this._recordUndoState( range );
    this._getRangeAndRemoveBookmark( range );
    this.setSelection( range );
    setTimeout( function () {
        try {
            // If all content removed, ensure div at start of body.
            self._ensureBottomLine();
        } catch ( error ) {
            self.didError( error );
        }
    }, 0 );
};

var onPaste = function ( event ) {
    if ( this._awaitingPaste ) { return; }

    // Treat image paste as a drop of an image file.
    var clipboardData = event.clipboardData,
        items = clipboardData && clipboardData.items,
        fireDrop = false,
        hasImage = false,
        l, type;
    if ( items ) {
        l = items.length;
        while ( l-- ) {
            type = items[l].type;
            if ( type === 'text/html' ) {
                hasImage = false;
                break;
            }
            if ( /^image\/.*/.test( type ) ) {
                hasImage = true;
            }
        }
        if ( hasImage ) {
            event.preventDefault();
                this.fireEvent( 'dragover', {
                dataTransfer: clipboardData,
                /*jshint loopfunc: true */
                preventDefault: function () {
                    fireDrop = true;
                }
                /*jshint loopfunc: false */
            });
            if ( fireDrop ) {
                this.fireEvent( 'drop', {
                    dataTransfer: clipboardData
                });
            }
            return;
        }
    }

    this._awaitingPaste = true;

    var self = this,
        body = this._body,
        range = this.getSelection(),
        startContainer, startOffset, endContainer, endOffset, startBlock;

    // Record undo checkpoint
    self._recordUndoState( range );
    self._getRangeAndRemoveBookmark( range );

    // Note current selection. We must do this AFTER recording the undo
    // checkpoint, as this modifies the DOM.
    startContainer = range.startContainer;
    startOffset = range.startOffset;
    endContainer = range.endContainer;
    endOffset = range.endOffset;
    startBlock = getStartBlockOfRange( range );

    // We need to position the pasteArea in the visible portion of the screen
    // to stop the browser auto-scrolling.
    var pasteArea = this.createElement( 'DIV', {
        style: 'position: absolute; overflow: hidden; top:' +
            ( body.scrollTop +
                ( startBlock ? startBlock.getBoundingClientRect().top : 0 ) ) +
            'px; right: 150%; width: 1px; height: 1px;'
    });
    body.appendChild( pasteArea );
    range.selectNodeContents( pasteArea );
    this.setSelection( range );

    // A setTimeout of 0 means this is added to the back of the
    // single javascript thread, so it will be executed after the
    // paste event.
    setTimeout( function () {
        try {
            // Get the pasted content and clean
            var frag = self._doc.createDocumentFragment(),
                next = pasteArea,
                first, range;

            // #88: Chrome can apparently split the paste area if certain
            // content is inserted; gather them all up.
            while ( pasteArea = next ) {
                next = pasteArea.nextSibling;
                frag.appendChild( empty( detach( pasteArea ) ) );
            }

            first = frag.firstChild;
            range = self._createRange(
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
                    doPaste = true,
                    event = {
                        fragment: frag,
                        preventDefault: function () {
                            doPaste = false;
                        },
                        isDefaultPrevented: function () {
                            return !doPaste;
                        }
                    };
                while ( node = getNextBlock( node ) ) {
                    fixCursor( node );
                }

                self.fireEvent( 'willPaste', event );

                // Insert pasted data
                if ( doPaste ) {
                    insertTreeFragmentIntoRange( range, event.fragment );
                    if ( !canObserveMutations ) {
                        self._docWasChanged();
                    }
                    range.collapse( false );
                    self._ensureBottomLine();
                }
            }

            self.setSelection( range );
            self._updatePath( range, true );

            self._awaitingPaste = false;
        } catch ( error ) {
            self.didError( error );
        }
    }, 0 );
};
