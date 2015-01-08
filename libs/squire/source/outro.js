/*jshint ignore:start */

if ( top !== win ) {
    win.editor = new Squire( doc );
    if ( win.onEditorLoad ) {
        win.onEditorLoad( win.editor );
        win.onEditorLoad = null;
    }
} else {
    win.Squire = Squire;
}

}( document ) );
