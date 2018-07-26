/*jshint strict:false, undef:false, unused:false */

var fontSizes = {
    1: 10,
    2: 13,
    3: 16,
    4: 18,
    5: 24,
    6: 32,
    7: 48
};

var styleToSemantic = {
    backgroundColor: {
        regexp: notWS,
        replace: function ( doc, classNames, colour ) {
            return createElement( doc, 'SPAN', {
                'class': classNames.highlight,
                style: 'background-color:' + colour
            });
        }
    },
    color: {
        regexp: notWS,
        replace: function ( doc, classNames, colour ) {
            return createElement( doc, 'SPAN', {
                'class': classNames.colour,
                style: 'color:' + colour
            });
        }
    },
    fontWeight: {
        regexp: /^bold|^700/i,
        replace: function ( doc ) {
            return createElement( doc, 'B' );
        }
    },
    fontStyle: {
        regexp: /^italic/i,
        replace: function ( doc ) {
            return createElement( doc, 'I' );
        }
    },
    fontFamily: {
        regexp: notWS,
        replace: function ( doc, classNames, family ) {
            return createElement( doc, 'SPAN', {
                'class': classNames.fontFamily,
                style: 'font-family:' + family
            });
        }
    },
    fontSize: {
        regexp: notWS,
        replace: function ( doc, classNames, size ) {
            return createElement( doc, 'SPAN', {
                'class': classNames.fontSize,
                style: 'font-size:' + size
            });
        }
    },
    textDecoration: {
        regexp: /^underline/i,
        replace: function ( doc ) {
            return createElement( doc, 'U' );
        }
    }
};

var replaceWithTag = function ( tag ) {
    return function ( node, parent ) {
        var el = createElement( node.ownerDocument, tag );
        parent.replaceChild( el, node );
        el.appendChild( empty( node ) );
        return el;
    };
};

var replaceStyles = function ( node, parent, config ) {
    var style = node.style;
    var doc = node.ownerDocument;
    var attr, converter, css, newTreeBottom, newTreeTop, el;

    for ( attr in styleToSemantic ) {
        converter = styleToSemantic[ attr ];
        css = style[ attr ];
        if ( css && converter.regexp.test( css ) ) {
            el = converter.replace( doc, config.classNames, css );
            if ( !newTreeTop ) {
                newTreeTop = el;
            }
            if ( newTreeBottom ) {
                newTreeBottom.appendChild( el );
            }
            newTreeBottom = el;
            node.style[ attr ] = '';
        }
    }

    if ( newTreeTop ) {
        newTreeBottom.appendChild( empty( node ) );
        if ( node.nodeName === 'SPAN' ) {
            parent.replaceChild( newTreeTop, node );
        } else {
            node.appendChild( newTreeTop );
        }
    }

    return newTreeBottom || node;
};

var stylesRewriters = {
    P: replaceStyles,
    SPAN: replaceStyles,
    STRONG: replaceWithTag( 'B' ),
    EM: replaceWithTag( 'I' ),
    INS: replaceWithTag( 'U' ),
    STRIKE: replaceWithTag( 'S' ),
    FONT: function ( node, parent, config ) {
        var face = node.face;
        var size = node.size;
        var colour = node.color;
        var doc = node.ownerDocument;
        var classNames = config.classNames;
        var fontSpan, sizeSpan, colourSpan;
        var newTreeBottom, newTreeTop;
        if ( face ) {
            fontSpan = createElement( doc, 'SPAN', {
                'class': classNames.fontFamily,
                style: 'font-family:' + face
            });
            newTreeTop = fontSpan;
            newTreeBottom = fontSpan;
        }
        if ( size ) {
            sizeSpan = createElement( doc, 'SPAN', {
                'class': classNames.fontSize,
                style: 'font-size:' + fontSizes[ size ] + 'px'
            });
            if ( !newTreeTop ) {
                newTreeTop = sizeSpan;
            }
            if ( newTreeBottom ) {
                newTreeBottom.appendChild( sizeSpan );
            }
            newTreeBottom = sizeSpan;
        }
        if ( colour && /^#?([\dA-F]{3}){1,2}$/i.test( colour ) ) {
            if ( colour.charAt( 0 ) !== '#' ) {
                colour = '#' + colour;
            }
            colourSpan = createElement( doc, 'SPAN', {
                'class': classNames.colour,
                style: 'color:' + colour
            });
            if ( !newTreeTop ) {
                newTreeTop = colourSpan;
            }
            if ( newTreeBottom ) {
                newTreeBottom.appendChild( colourSpan );
            }
            newTreeBottom = colourSpan;
        }
        if ( !newTreeTop ) {
            newTreeTop = newTreeBottom = createElement( doc, 'SPAN' );
        }
        parent.replaceChild( newTreeTop, node );
        newTreeBottom.appendChild( empty( node ) );
        return newTreeBottom;
    },
    TT: function ( node, parent, config ) {
        var el = createElement( node.ownerDocument, 'SPAN', {
            'class': config.classNames.fontFamily,
            style: 'font-family:menlo,consolas,"courier new",monospace'
        });
        parent.replaceChild( el, node );
        el.appendChild( empty( node ) );
        return el;
    }
};

var allowedBlock = /^(?:A(?:DDRESS|RTICLE|SIDE|UDIO)|BLOCKQUOTE|CAPTION|D(?:[DLT]|IV)|F(?:IGURE|IGCAPTION|OOTER)|H[1-6]|HEADER|L(?:ABEL|EGEND|I)|O(?:L|UTPUT)|P(?:RE)?|SECTION|T(?:ABLE|BODY|D|FOOT|H|HEAD|R)|COL(?:GROUP)?|UL)$/;

var blacklist = /^(?:HEAD|META|STYLE)/;

var walker = new TreeWalker( null, SHOW_TEXT|SHOW_ELEMENT );

/*
    Two purposes:

    1. Remove nodes we don't want, such as weird <o:p> tags, comment nodes
       and whitespace nodes.
    2. Convert inline tags into our preferred format.
*/
var cleanTree = function cleanTree ( node, config, preserveWS ) {
    var children = node.childNodes,
        nonInlineParent, i, l, child, nodeName, nodeType, rewriter, childLength,
        startsWithWS, endsWithWS, data, sibling;

    nonInlineParent = node;
    while ( isInline( nonInlineParent ) ) {
        nonInlineParent = nonInlineParent.parentNode;
    }
    walker.root = nonInlineParent;

    for ( i = 0, l = children.length; i < l; i += 1 ) {
        child = children[i];
        nodeName = child.nodeName;
        nodeType = child.nodeType;
        rewriter = stylesRewriters[ nodeName ];
        if ( nodeType === ELEMENT_NODE ) {
            childLength = child.childNodes.length;
            if ( rewriter ) {
                child = rewriter( child, node, config );
            } else if ( blacklist.test( nodeName ) ) {
                node.removeChild( child );
                i -= 1;
                l -= 1;
                continue;
            } else if ( !allowedBlock.test( nodeName ) && !isInline( child ) ) {
                i -= 1;
                l += childLength - 1;
                node.replaceChild( empty( child ), child );
                continue;
            }
            if ( childLength ) {
                cleanTree( child, config,
                    preserveWS || ( nodeName === 'PRE' ) );
            }
        } else {
            if ( nodeType === TEXT_NODE ) {
                data = child.data;
                startsWithWS = !notWS.test( data.charAt( 0 ) );
                endsWithWS = !notWS.test( data.charAt( data.length - 1 ) );
                if ( preserveWS || ( !startsWithWS && !endsWithWS ) ) {
                    continue;
                }
                // Iterate through the nodes; if we hit some other content
                // before the start of a new block we don't trim
                if ( startsWithWS ) {
                    walker.currentNode = child;
                    while ( sibling = walker.previousPONode() ) {
                        nodeName = sibling.nodeName;
                        if ( nodeName === 'IMG' ||
                                ( nodeName === '#text' &&
                                    notWS.test( sibling.data ) ) ) {
                            break;
                        }
                        if ( !isInline( sibling ) ) {
                            sibling = null;
                            break;
                        }
                    }
                    data = data.replace( /^[ \t\r\n]+/g, sibling ? ' ' : '' );
                }
                if ( endsWithWS ) {
                    walker.currentNode = child;
                    while ( sibling = walker.nextNode() ) {
                        if ( nodeName === 'IMG' ||
                                ( nodeName === '#text' &&
                                    notWS.test( sibling.data ) ) ) {
                            break;
                        }
                        if ( !isInline( sibling ) ) {
                            sibling = null;
                            break;
                        }
                    }
                    data = data.replace( /[ \t\r\n]+$/g, sibling ? ' ' : '' );
                }
                if ( data ) {
                    child.data = data;
                    continue;
                }
            }
            node.removeChild( child );
            i -= 1;
            l -= 1;
        }
    }
    return node;
};

// ---

var removeEmptyInlines = function removeEmptyInlines ( node ) {
    var children = node.childNodes,
        l = children.length,
        child;
    while ( l-- ) {
        child = children[l];
        if ( child.nodeType === ELEMENT_NODE && !isLeaf( child ) ) {
            removeEmptyInlines( child );
            if ( isInline( child ) && !child.firstChild ) {
                node.removeChild( child );
            }
        } else if ( child.nodeType === TEXT_NODE && !child.data ) {
            node.removeChild( child );
        }
    }
};

// ---

var notWSTextNode = function ( node ) {
    return node.nodeType === ELEMENT_NODE ?
        node.nodeName === 'BR' :
        notWS.test( node.data );
};
var isLineBreak = function ( br, isLBIfEmptyBlock ) {
    var block = br.parentNode;
    var walker;
    while ( isInline( block ) ) {
        block = block.parentNode;
    }
    walker = new TreeWalker(
        block, SHOW_ELEMENT|SHOW_TEXT, notWSTextNode );
    walker.currentNode = br;
    return !!walker.nextNode() ||
        ( isLBIfEmptyBlock && !walker.previousNode() );
};

// <br> elements are treated specially, and differently depending on the
// browser, when in rich text editor mode. When adding HTML from external
// sources, we must remove them, replacing the ones that actually affect
// line breaks by wrapping the inline text in a <div>. Browsers that want <br>
// elements at the end of each block will then have them added back in a later
// fixCursor method call.
var cleanupBRs = function ( node, root, keepForBlankLine ) {
    var brs = node.querySelectorAll( 'BR' );
    var brBreaksLine = [];
    var l = brs.length;
    var i, br, parent;

    // Must calculate whether the <br> breaks a line first, because if we
    // have two <br>s next to each other, after the first one is converted
    // to a block split, the second will be at the end of a block and
    // therefore seem to not be a line break. But in its original context it
    // was, so we should also convert it to a block split.
    for ( i = 0; i < l; i += 1 ) {
        brBreaksLine[i] = isLineBreak( brs[i], keepForBlankLine );
    }
    while ( l-- ) {
        br = brs[l];
        // Cleanup may have removed it
        parent = br.parentNode;
        if ( !parent ) { continue; }
        // If it doesn't break a line, just remove it; it's not doing
        // anything useful. We'll add it back later if required by the
        // browser. If it breaks a line, wrap the content in div tags
        // and replace the brs.
        if ( !brBreaksLine[l] ) {
            detach( br );
        } else if ( !isInline( parent ) ) {
            fixContainer( parent, root );
        }
    }
};
