'use strict';

var Editor = require('../src/js/editor');

describe('Editor', function() {
    var editor;

    describe('Api', function() {
        beforeEach(function() {
            editor = new Editor({
                el: $('body'),
                height: 300,
                initialEditType: 'markdown'
            });
        });

        //we need to wait squire input event process
        afterEach(function(done) {
            setTimeout(function() {
                $('body').empty();
                done();
            });
        });

        describe('contentHeight()', function() {
            it('set content height', function() {
                editor.contentHeight(500);
                expect($('.te-md-container .te-editor').height()).toEqual(500);
                expect($('.te-preview').height()).toEqual(500);
                expect($('.te-ww-container .te-editor').height()).toEqual(500);
            });

            it('get content height', function() {
                expect(editor.contentHeight()).toEqual(300);
            });

            it('set content height "auto" to fit contents height of wysiwyg', function() {
                var height = $('.te-ww-container .te-editor').height();
                editor.contentHeight('auto');
                editor.changeMode('wysiwyg');
                editor.setValue('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
                expect($('.te-ww-container .tui-editor-contents').height()).not.toEqual(height);
            });

            it('set content height "auto" to fit contents height of markdown', function() {
                var height = $('.te-md-container .te-editor').height();
                editor.contentHeight('auto');
                editor.setValue('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
                expect($('.te-md-container .te-editor').height()).not.toEqual(height);
            });
        });
        describe('setValue()', function() {
            it('fire setValueAfter evnet after setValue', function(done) {
                editor.on('setValueAfter', done);
                editor.setValue('dd');
            });
        });
        describe('changePreviewStyle()', function() {
            it('Preview should refreash after preview style is changed', function() {
                editor.changePreviewStyle('tab');
                editor.setValue('1\n2');
                editor.changePreviewStyle('vertical');
                expect(editor.preview.$el.text()).toEqual('12\n');
            });
        });
    });
});

