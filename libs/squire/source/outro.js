/*jshint ignore:start */

if ( top !== win ) {
    win.editor = new Squire( doc );
    if ( win.onEditorLoad ) {
        win.onEditorLoad( win.editor );
        win.onEditorLoad = null;
    }
} else {
    if ( typeof exports === 'object' ) {
        module.exports = Squire;
    } else {
        win.Squire = Squire;
    }
}

}( document ) );
