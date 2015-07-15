'use strict';

var extManager = require('../extManager');

extManager.defineExtension('completeHint', function(editor) {
    var $layer = $('<div style="z-index:9999"><input type="text" style="background:white" /></div>');

    $(editor.options.el).append($layer);

    $layer.find('input').on('keyup', function(e) {
        if (e.which === 13) {
            hideUI($layer);
            editor.getCurrentModeEditor().replaceSelection('awefawefweaf');
        }
    });

    editor.eventManager.listen('change', function(ev) {
        if (ev.textContent[ev.caretOffset] === '@') {
            console.log(ev);
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
