'use strict';

var Editor = require('../src/js/editor');

describe('Editor', function() {
    var editor,
        em;

    describe('Api', function() {
        beforeEach(function(done) {
            $('body').empty();

            editor = new Editor({
                el: $('body'),
                height: 300,
                events: {
                    'load': function(editor) {
                        em = editor.eventManager;
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
        });
    });
});

