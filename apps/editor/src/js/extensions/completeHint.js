'use strict';

var extManager = require('../extManager');

extManager.defineExtension('completeHint', function(editor) {
    var $layer = $('<div style="z-index:9999"><input type="text" style="background:white" /></div>');

    $(editor.options.el).append($layer);

    $layer.find('input').on('click', function() {
        hideUI($layer);
        editor.getCurrentModeEditor().replaceSelection('awefawefweaf');
    });

    editor.eventManager.listen('change', function(ev) {
        if (ev.textContent[ev.caretOffset] === '@') {
            editor.addWidget(ev.selection, $layer[0], 'over');
            showUI($layer);
        }
    });
});

function showUI($layer) {
    $layer.show();
    $layer.find('input').focus();
}

function hideUI($layer) {
    $layer.hide();
    $layer.find('input').val('');
}

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
