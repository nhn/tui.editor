/* eslint max-nested-callbacks:0 new-cap:0 */

import WysiwygEditor from '../../src/js/wysiwygEditor';
import CodeBlockGadget from '../../src/js/ui/codeBlockGadget';
import EventManager from '../../src/js/eventManager';
import KeyMapper from '../../src/js/keyMapper';

describe('code block gadget', () => {
    let gadget,
        $container,
        $wysiwygContainer,
        $targetElement,
        em;

    beforeEach(() => {
        $container = $('<div>');
        $container.css('position', 'relative');
        $wysiwygContainer = $('<div>');
        $('body').append($container);
        $('body').append($wysiwygContainer);

        $targetElement = $('<pre data-te-codeblock data-language="javascript">');
        $targetElement.append($('<div>'));
        $targetElement.css({
            position: 'absolute',
            left: '1px',
            top: '2px',
            width: '200px',
            height: '100px'
        });
        $('body').append($targetElement);

        em = new EventManager();
        const wysiwygEditor = new WysiwygEditor($wysiwygContainer, em);
        wysiwygEditor.init();
        wysiwygEditor.focus();
        gadget = new CodeBlockGadget({
            wysiwygEditor,
            eventManager: em,
            container: $container[0],
            languages: ['java', 'javascript', 'cs']
        });

        gadget._$attachedElement = $targetElement;
    });

    afterEach(() => {
        $container.remove();
        $wysiwygContainer.remove();
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
