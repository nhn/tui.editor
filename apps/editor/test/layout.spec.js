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
        expect($('.neonEditor').length).toEqual(1);
        expect($('.toolbarSection').length).toEqual(1);
        expect($('.modeSwitchSection').length).toEqual(1);
        expect($('.mdContainer').length).toEqual(1);
        expect($('.mdContainer .tabSection').length).toEqual(1);
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
        });
    });

    describe('Markdown and WYSIWYG type switching by eventManager', function() {
        it('to Markdown', function() {
            layout.switchToMarkdown();

            expect($('.neonEditor').hasClass('markdownMode')).toEqual(true);
            expect($('.neonEditor').hasClass('wysiwygMode')).toEqual(false);
        });

        it('to WYSIWYG', function() {
            layout.switchToWYSIWYG();

            expect($('.neonEditor').hasClass('markdownMode')).toEqual(false);
            expect($('.neonEditor').hasClass('wysiwygMode')).toEqual(true);
        });
    });
});

