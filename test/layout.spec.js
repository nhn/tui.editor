var Layout = require('../src/js/layout'),
    EventManager = require('../src/js/eventManager');

describe('Layout', function() {
    'use strict';

    var layout,
        em;

    beforeEach(function() {
        $('body').empty();

        em = new EventManager();

        layout = new Layout({
            el: $('body'),
            height: 100
        }, em);

        layout.init();
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
            em.emit('changeMode.markdown');

            expect($('.mdContainer').css('display')).toEqual('block');
            expect($('.wysiwygContainer').css('display')).toBe('none');
        });

        it('to WYSIWYG', function() {
            em.emit('changeMode.wysiwyg');

            expect($('.mdContainer').css('display')).toEqual('none');
            expect($('.wysiwygContainer').css('display')).toBe('block');
        });
    });
});

