'use strict';

var extManager = require('../extManager');

extManager.defineExtension('textPalette', function(editor) {
    var $layer = $('<div style="z-index:9999"><input type="text" style="background:white" /></div>');
    var triggers = editor.options.textPalette.triggers,
        querySender = editor.options.textPalette.querySender;

    $(editor.options.el).append($layer);

    $layer.find('input').on('keyup', function(e) {
        var query = $layer.find('input').val();

        if (e.which === 13) {
            editor.getCurrentModeEditor().replaceSelection(query);
            hideUI($layer);
        } else {
            querySender(query, function(list) {
                updateUI($layer, list);
            });
        }
    });

    editor.eventManager.listen('change', function(ev) {
        if (triggers.indexOf(ev.textContent[ev.caretOffset]) !== -1) {
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

function updateUI($layer, list) {
    console.log(list);
}
