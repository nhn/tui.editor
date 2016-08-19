

var extManager = require('../extManager');

var FIND_TASK_RX = /^\s*\* \[[xX ]\] [^\n]*/mg;
var FIND_CHECKED_TASK_RX = /^\s*\* \[[xX]\] [^\n]*/mg;

extManager.defineExtension('taskCounter', function(editor) {
    editor.getTaskCount = function() {
        var found, count;

        if (editor.isViewOnly()) {
            count = editor.preview.$el.find('.task-list-item').length;
        } else if (editor.isMarkdownMode()) {
            found = editor.mdEditor.getValue().match(FIND_TASK_RX);
            count = found ? found.length : 0;
        } else {
            count = editor.wwEditor.get$Body().find('.task-list-item').length;
        }

        return count;
    };

    editor.getCheckedTaskCount = function() {
        var found, count;

        if (editor.isViewOnly()) {
            count = editor.preview.$el.find('.task-list-item.checked').length;
        } else if (editor.isMarkdownMode()) {
            found = editor.mdEditor.getValue().match(FIND_CHECKED_TASK_RX);
            count = found ? found.length : 0;
        } else {
            count = editor.wwEditor.get$Body().find('.task-list-item.checked').length;
        }

        return count;
    };
});
