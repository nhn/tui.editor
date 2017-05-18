/* eslint max-nested-callbacks:0 new-cap:0 */

import CodeBlockGadget from '../../src/js/ui/codeBlockGadget';
import EventManager from '../../src/js/eventManager';
import KeyMapper from '../../src/js/keyMapper';

describe('code block gadget', () => {
    let gadget,
        $container,
        $targetElement,
        em;

    beforeEach(() => {
        $('body').attr('contenteditable', true);
        $container = $('<div>');
        $container.css('position', 'relative');
        $('body').append($container);

        $targetElement = $('<pre data-te-codeblock data-language="javascript">');
        $targetElement.css({
            position: 'absolute',
            left: '1px',
            top: '2px',
            width: '200px',
            height: '100px'
        });
        $('body').append($targetElement);

        em = new EventManager();
        gadget = new CodeBlockGadget({
            eventManager: em,
            container: $container[0],
            languages: ['java', 'javascript', 'cs']
        });

        gadget._$attachedElement = $targetElement;
    });

    afterEach(() => {
        $('body').empty();
    });

    it('language accessor should get/set language on code block', () => {
        gadget._setLanguage('java');
        expect($targetElement.attr('data-language')).toBe('java');

        $targetElement.attr('data-language', 'javascript');
        expect(gadget._getLanguage()).toBe('javascript');
    });

    it('restore input form on gadget become visible', () => {
        gadget.setVisibility(true);
        expect(gadget._$inputLanguage.val()).toBe('javascript');
    });

    it('store typed language on enter, tab key', () => {
        gadget.setVisibility(true);
        gadget._$inputLanguage.val('java');

        const press = $.Event('keydown');
        press.which = KeyMapper.keyCode('ENTER');
        gadget._$inputLanguage.trigger(press);

        expect($targetElement.attr('data-language')).toBe('java');

        gadget._$inputLanguage.val('php');
        press.which = KeyMapper.keyCode('TAB');
        gadget._$inputLanguage.trigger(press);

        expect($targetElement.attr('data-language')).toBe('php');
    });
});
