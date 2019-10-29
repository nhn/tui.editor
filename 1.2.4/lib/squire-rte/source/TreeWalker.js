/*jshint strict:false */

/*
    Native TreeWalker is buggy in IE and Opera:
    * IE9/10 sometimes throw errors when calling TreeWalker#nextNode or
      TreeWalker#previousNode. No way to feature detect this.
    * Some versions of Opera have a bug in TreeWalker#previousNode which makes
      it skip to the wrong node.

    Rather than risk further bugs, it's easiest just to implement our own
    (subset) of the spec in all browsers.
*/

var typeToBitArray = {
    // ELEMENT_NODE
    1: 1,
    // ATTRIBUTE_NODE
    2: 2,
    // TEXT_NODE
    3: 4,
    // COMMENT_NODE
    8: 128,
    // DOCUMENT_NODE
    9: 256,
    // DOCUMENT_FRAGMENT_NODE
    11: 1024
};

function TreeWalker ( root, nodeType, filter ) {
    this.root = this.currentNode = root;
    this.nodeType = nodeType;
    this.filter = filter;
}

TreeWalker.prototype.nextNode = function () {
    var current = this.currentNode,
        root = this.root,
        nodeType = this.nodeType,
        filter = this.filter,
        node;
    while ( true ) {
        node = current.firstChild;
        while ( !node && current ) {
            if ( current === root ) {
                break;
            }
            node = current.nextSibling;
            if ( !node ) { current = current.parentNode; }
        }
        if ( !node ) {
            return null;
        }
        if ( ( typeToBitArray[ node.nodeType ] & nodeType ) &&
                filter( node ) ) {
            this.currentNode = node;
            return node;
        }
        current = node;
    }
};

TreeWalker.prototype.previousNode = function () {
    var current = this.currentNode,
        root = this.root,
        nodeType = this.nodeType,
        filter = this.filter,
        node;
    while ( true ) {
        if ( current === root ) {
            return null;
        }
        node = current.previousSibling;
        if ( node ) {
            while ( current = node.lastChild ) {
                node = current;
            }
        } else {
            node = current.parentNode;
        }
        if ( !node ) {
            return null;
        }
        if ( ( typeToBitArray[ node.nodeType ] & nodeType ) &&
                filter( node ) ) {
            this.currentNode = node;
            return node;
        }
        current = node;
    }
};

// Previous node in post-order.
TreeWalker.prototype.previousPONode = function () {
    var current = this.currentNode,
        root = this.root,
        nodeType = this.nodeType,
        filter = this.filter,
        node;
    while ( true ) {
        node = current.lastChild;
        while ( !node && current ) {
            if ( current === root ) {
                break;
            }
            node = current.previousSibling;
            if ( !node ) { current = current.parentNode; }
        }
        if ( !node ) {
            return null;
        }
        if ( ( typeToBitArray[ node.nodeType ] & nodeType ) &&
                filter( node ) ) {
            this.currentNode = node;
            return node;
        }
        current = node;
    }
};
