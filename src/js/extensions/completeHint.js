'use strict';

var extManager = require('../extManager');

extManager.defineExtension('completeHint', function(editor) {
    var caretPos,
        $hintLayer = $('#hint');

    editor.eventManager.listen('query', function(founded) {
        if (founded) {
            if (founded.currentText === '@' && !caretPos) {
                caretPos = editor.wwEditor.getCaretPosition();
                show($hintLayer, caretPos, founded.text);
            }
        } else {
            caretPos = null;
            hide($hintLayer);
        }
    });

    $hintLayer.on('change', function() {
        console.log($hintLayer.val());
        editor.wwEditor.editor.insertHTML('<input type="text" value="' + $(this).val() + '" readonly />');
        $hintLayer.css("display", "none");
    });
});


function show($layer, pos, query) {
    $layer.css({
        display: "block",
        left: pos.left,
        top: pos.top + 70
    });

    console.log(query);
}

function hide($layer) {
    $layer.css("display", "none");
}
