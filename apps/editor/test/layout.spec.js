'use strict';

var Layout = require('../src/js/layout'),
    EventManager = require('../src/js/eventManager');

describe('Layout', function() {
    var layout,
        em;

    beforeEach(function() {
        $('body').empty();

        em = new EventManager();

        layout = new Layout({
            el: $('body'),
            height: 100
        }, em);
    });

    it('All layout elements are exist', function() {
        expect($('.tui-editor').length).toEqual(1);
        expect($('.mdContainer').length).toEqual(1);
        expect($('.mdContainer .editor').length).toEqual(1);
        expect($('.mdContainer .preview').length).toEqual(1);
        expect($('.wysiwygContainer').length).toEqual(1);
        expect($('.wysiwygContainer .editor').length).toEqual(1);
    });

    describe('Markdown editor/preview layout switch', function() {
        it('vertical', function() {
            layout.changePreviewStyle('vertical');

            expect($('.mdContainer').hasClass('preview-style-vertical')).toBe(true);
            expect($('.mdContainer').hasClass('preview-style-tab')).toBe(false);
        });

        it('tab', function() {
            layout.changePreviewStyle('tab');

            expect($('.mdContainer').hasClass('preview-style-tab')).toBe(true);
            expect($('.mdContainer').hasClass('preview-style-vertical')).toBe(false);
        })
    });

    describe('Markdown and WYSIWYG type switching by eventManager', function() {
        it('to Markdown', function() {
            layout.switchToMarkdown();

            expect($('.tui-editor').hasClass('markdownMode')).toEqual(true);
            expect($('.tui-editor').hasClass('wysiwygMode')).toEqual(false);
        });

        it('to WYSIWYG', function() {
            layout.switchToWYSIWYG();

            expect($('.tui-editor').hasClass('markdownMode')).toEqual(false);
            expect($('.tui-editor').hasClass('wysiwygMode')).toEqual(true);
        });
    });

    describe('show/hide', function() {
        it('hide and show editor', function() {
            layout.hide();
            expect($('.tui-editor').hasClass('hide')).toEqual(true);
            layout.show();
            expect($('.tui-editor').hasClass('hide')).toEqual(false);
        });
    });
});

