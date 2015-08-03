'use strict';

var extManager = require('../extManager');

var FIND_TASK_RX = /^\s*\* \[[xX ]\] [^\n]*/mg;
var FIND_CHECKED_TASK_RX = /^\s*\* \[[xX]\] [^\n]*/mg;

extManager.defineExtension('taskCounter', function(editor) {
    editor.getTaskCount = function() {
        var found;

        if (editor.isMarkdownMode()) {
            found = editor.mdEditor.getValue().match(FIND_TASK_RX);
            return found ? found.length : 0;
        } else {
            return editor.wwEditor.get$Body().find('input').length;
        }
    }

    editor.getCheckedTaskCount = function() {
        var found;

        if (editor.isMarkdownMode()) {
            found = editor.mdEditor.getValue().match(FIND_CHECKED_TASK_RX);
            return found ? found.length : 0;
        } else {
            return editor.wwEditor.get$Body().find('input:checked').length;
        }
    }
});
