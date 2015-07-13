'use strict';

var extManager = require('../extManager');

extManager.defineExtension('completeHint', function(editor) {
    var $layer = $('<div><input type="text" /></div>');

    $(editor.options.el).append($layer);

    editor.eventManager.listen('change', function(ev) {
        if (ev.textContent[ev.caretOffset - 1] === '@') {
            $layer.find('input').focus();
        }
    });
});

/*
extManager.defineExtension('completeHint', function(editor) {
    var $hintLayer = $('#hint'),
        lastFounded;

    window.dd = editor.getSquire();

    editor.getSquire().setKeyHandler('ctrl-shift-enter', function() {
        console.log('enter');
    });

    editor.commandManager.addCommand('wysiwyg', {
        name: 'insertWithSelection',
        exec: function(sq, data, founded) {
            var range = document.createRange();
            range.setStart(founded.selection.commonAncestorContainer, founded.startOffset);
            range.setEnd(founded.selection.commonAncestorContainer, founded.caretOffset);
            sq.setSelection(range);
            sq.insertHTML('<input type="text" value="' + data + '" readonly />');
            sq.focus();
        }
    });

    editor.eventManager.listen('query', function(founded) {
        var caretPos;

        if (founded) {
            if (founded.currentText === '@' && !caretPos) {
                //caretPos = editor.wwEditor.getCaretPosition();
                caretPos = editor.mdEditor.getCaretPosition();
                show($hintLayer, caretPos, founded.text);
            }
            lastFounded = founded;
        } else {
            hide($hintLayer);
        }
    });

    $hintLayer.on('change', function() {
        editor.exec('insertWithSelection', $(this).val(), lastFounded);
        $hintLayer.css("display", "none");
    });
});

function show($layer, pos, query) {
    $layer.css({
        display: "block",
        left: pos.left,
        top: pos.top + 20
    });
}

function hide($layer) {
    $layer.css("display", "none");
}*/
