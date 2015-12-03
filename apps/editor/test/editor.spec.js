'use strict';

var Editor = require('../src/js/editor');

describe('Editor', function() {
    var editor;

    describe('Api', function() {
        beforeEach(function(done) {
            $('body').empty();

            editor = new Editor({
                el: $('body'),
                height: 300,
                events: {
                    'load': function() {
                        done();
                    }
                }
            });
        });

        describe('contentHeight()', function() {
            it('set content height', function() {
                editor.contentHeight(500);
                expect($('.mdContainer .editor').height()).toEqual(500);
                expect($('.preview').height()).toEqual(500);
                expect($('.wysiwygContainer .editor').height()).toEqual(500);
            });

            it('get content height', function() {
                expect(editor.contentHeight()).toEqual(300);
            });

            it('set content height "auto" to fit contents height of wysiwyg', function() {
                var height = $('.wysiwygContainer .editor').height();
                editor.contentHeight('auto');
                editor.setValue('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
                expect($('.wysiwygContainer .editor').height()).not.toEqual(height);
            });

            it('set content height "auto" to fit contents height of markdown', function() {
                var height = $('.mdContainer .editor').height();
                editor.changeMode('markdown');
                editor.contentHeight('auto');
                editor.setValue('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
                expect($('.mdContainer .editor').height()).not.toEqual(height);
            });
        });
    });
});

