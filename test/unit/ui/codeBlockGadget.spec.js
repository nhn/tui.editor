/**
 * @fileoverview test code block gadget
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import WysiwygEditor from '../../../src/js/wysiwygEditor';
import CodeBlockGadget from '../../../src/js/ui/codeBlockGadget';
import EventManager from '../../../src/js/eventManager';
const GADGET_WIDTH = 250;
const GADGET_HEIGHT = 30;

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

  it('_openPopupCodeBlockEditor() should emit event', done => {
    em.listen('openPopupCodeBlockEditor', codeBlockElement => {
      expect(codeBlockElement.tagName).toBe('PRE');
      done();
    });

    gadget._openPopupCodeBlockEditor();
  });

  it('_updateLanguage() should update label', () => {
    $targetElement.removeAttr('data-language');
    gadget._updateLanguage();
    expect(gadget._$languageLabel.text()).toBe('text');

    $targetElement.attr('data-language', 'changedLang');
    gadget._updateLanguage();
    expect(gadget._$languageLabel.text()).toBe('changedLang');

    gadget.onHide();
    gadget._updateLanguage();
    expect(gadget._$languageLabel.text()).toBe('text');
  });

  describe('language label should be updated', () => {
    it('on onShow', () => {
      $targetElement.attr('data-language', 'changedLang');

      gadget.onShow();

      expect(gadget._$languageLabel.text()).toBe('changedLang');
    });

    it('on language-changed event', () => {
      gadget.onShow();

      $targetElement.attr('data-language', 'changedLang');

      $targetElement.trigger('language-changed');

      expect(gadget._$languageLabel.text()).toBe('changedLang');
    });
  });

  it('syncLayout() should fix its size', () => {
    gadget.syncLayout();

    expect(gadget.$el.height()).toBe(GADGET_HEIGHT);
    expect(gadget.$el.width()).toBe(GADGET_WIDTH);
  });
});
