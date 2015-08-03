'use strict';

var NeonEditor = require('../../src/js/editor');

describe('taskCounter', function() {
    var ned, em;

    beforeEach(function() {
        $('body').empty();
        $('body').html('<div id="editSection"></div>');
    });

    describe('wysiwyg', function() {
        beforeEach(function(done) {
            ned = new NeonEditor({
                el: $('#editSection'),
                previewStyle: 'tab',
                height: 300,
                delay: 300,
                initialEditType: 'wysiwyg',
                exts: ['taskCounter'],
                querySplitter: {
                    queryRx: /@[^@\s]*/
                },
                onload: function(editor) {
                    ned = editor;
                    em = editor.eventManager;
                    done();
                }
            });
        });

        it('get task count of content', function() {
            ned.setValue('* [ ] task1\n* [ ] task2');
            expect(ned.getTaskCount()).toEqual(2);

            ned.setValue('* [ ] task1');
            expect(ned.getTaskCount()).toEqual(1);

            ned.setValue('waefwaefwe* [ ] task1\n* [ ] task2');
            expect(ned.getTaskCount()).toEqual(1);

            ned.setValue('waefawefawefwef');
            expect(ned.getTaskCount()).toEqual(0);
        });

        it('get checked task count of content', function() {
            ned.setValue('* [ ] task1\n* [x] task2');
            expect(ned.getCheckedTaskCount()).toEqual(1);

            ned.setValue('* [x] task1');
            expect(ned.getCheckedTaskCount()).toEqual(1);

            ned.setValue('waefwaefwe* [ ] task1\n* [x] task2');
            expect(ned.getCheckedTaskCount()).toEqual(1);

            ned.setValue('waefawefawefwef');
            expect(ned.getCheckedTaskCount()).toEqual(0);
        });
    });

    describe('markdown', function() {
        beforeEach(function(done) {
            ned = new NeonEditor({
                el: $('#editSection'),
                previewStyle: 'tab',
                height: 300,
                delay: 300,
                initialEditType: 'markdown',
                exts: ['taskCounter'],
                querySplitter: {
                    queryRx: /@[^@\s]*/
                },
                onload: function(editor) {
                    ned = editor;
                    em = editor.eventManager;
                    done();
                }
            });
        });

        it('get task count of content', function() {
            ned.setValue('* [ ] task1\n    * [ ] task2');
            expect(ned.getTaskCount()).toEqual(2);

            ned.setValue('* [ ] task1');
            expect(ned.getTaskCount()).toEqual(1);

            ned.setValue('waefwaefwe* [ ] task1\n* [ ] task2');
            expect(ned.getTaskCount()).toEqual(1);

            ned.setValue('waefawefawefwef');
            expect(ned.getTaskCount()).toEqual(0);
        });

        it('get checked task count of content', function() {
            ned.setValue('* [ ] task1\n* [x] task2');
            expect(ned.getCheckedTaskCount()).toEqual(1);

            ned.setValue('* [x] task1');
            expect(ned.getCheckedTaskCount()).toEqual(1);

            ned.setValue('waefwaefwe* [ ] task1\n* [x] task2');
            expect(ned.getCheckedTaskCount()).toEqual(1);

            ned.setValue('waefawefawefwef');
            expect(ned.getCheckedTaskCount()).toEqual(0);
        });
    });
});

