'use strict';

var task = require('../../src/js/markdownCommands/task');

var CodeMirror = window.CodeMirror;

describe('task', function() {
    var cm,
        doc;

    beforeEach(function() {
        var textArea = $('<textarea />'),
            sourceText;

        $('body').append(textArea);

        cm = CodeMirror.fromTextArea(textArea[0], {
            lineWrapping: true,
            mode: 'gfm',
            theme: 'default',
            dragDrop: false
        });

        sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

        cm.setValue(sourceText.join('\n'));
        doc = cm.getDoc();
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('add task', function() {
        it('added task', function() {
            doc.setCursor(0, 0);

            task.exec(cm);

            expect(doc.getLine(0)).toEqual('* [ ] mytext1');
        });
    });
});
