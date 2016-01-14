'use strict';

var Layout = require('../src/js/layout'),
    EventManager = require('../src/js/eventManager');

describe('Layout', function() {
    var layout,
        em;

    beforeEach(function() {
        em = new EventManager();

        layout = new Layout({
            el: $('body'),
            height: 100
        }, em);
    });

    afterEach(function() {
        $('body').empty();
    });

    it('All layout elements are exist', function() {
        expect($('.tui-editor').length).toEqual(1);
        expect($('.te-md-container').length).toEqual(1);
        expect($('.te-md-container .te-editor').length).toEqual(1);
        expect($('.te-md-container .te-preview').length).toEqual(1);
        expect($('.te-ww-container').length).toEqual(1);
        expect($('.te-ww-container .te-editor').length).toEqual(1);
    });

    describe('Markdown editor/preview layout switch', function() {
        it('vertical', function() {
            layout.changePreviewStyle('vertical');

            expect($('.te-md-container').hasClass('te-preview-style-vertical')).toBe(true);
            expect($('.te-md-container').hasClass('te-preview-style-tab')).toBe(false);
        });

        it('tab', function() {
            layout.changePreviewStyle('tab');

            expect($('.te-md-container').hasClass('te-preview-style-tab')).toBe(true);
            expect($('.te-md-container').hasClass('te-preview-style-vertical')).toBe(false);
        });
    });

    describe('Markdown and WYSIWYG type switching by eventManager', function() {
        it('to Markdown', function() {
            layout.switchToMarkdown();

            expect($('.tui-editor').hasClass('te-md-mode')).toEqual(true);
            expect($('.tui-editor').hasClass('te-ww-mode')).toEqual(false);
        });

        it('to WYSIWYG', function() {
            layout.switchToWYSIWYG();

            expect($('.tui-editor').hasClass('te-md-mode')).toEqual(false);
            expect($('.tui-editor').hasClass('te-ww-mode')).toEqual(true);
        });
    });

    describe('show/hide', function() {
        it('te-hide and show editor', function() {
            layout.hide();
            expect($('.tui-editor').hasClass('te-hide')).toEqual(true);
            layout.show();
            expect($('.tui-editor').hasClass('te-hide')).toEqual(false);
        });
    });
});

