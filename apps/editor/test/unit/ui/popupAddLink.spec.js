/**
 * @fileoverview test ui popup add link
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import PopupAddLink from '@/ui/popupAddLink';
import EventManager from '@/eventManager';

describe('PopupAddLink', () => {
  let popup, em, selectedText, okButton, closeButton, linkTextInput, urlInput;

  beforeEach(() => {
    em = new EventManager();

    popup = new PopupAddLink({
      editor: {
        getSelectedText: () => selectedText || '',
        eventManager: em
      }
    });

    const { el } = popup;

    okButton = el.querySelector('.te-ok-button');
    closeButton = el.querySelector('.te-close-button');
    urlInput = el.querySelector('.te-url-input');
    linkTextInput = el.querySelector('.te-link-text-input');
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('button events', () => {
    beforeEach(() => {
      spyOn(popup, 'hide');
    });

    it('ok button fires okButtonClicked event', () => {
      linkTextInput.value = 'text';
      urlInput.value = 'link';

      $(okButton).trigger('click');

      expect(popup.hide).toHaveBeenCalled();
    });

    it('close button fires closeButtonClicked event', () => {
      $(closeButton).trigger('click');

      expect(popup.hide).toHaveBeenCalled();
    });
  });

  describe('integrates with eventManager', () => {
    let handler;

    beforeEach(() => {
      handler = jasmine.createSpy('buttonClickedHandler');
    });

    it('emit command on ok button', () => {
      const value = {
        linkText: 'linkText',
        url: 'urlText'
      };

      em.listen('command', handler);
      linkTextInput.value = value.linkText;
      urlInput.value = value.url;

      $(okButton).trigger('click');

      expect(handler).toHaveBeenCalledWith('AddLink', value);
    });

    it('openPopupAddLink event opens popup', () => {
      em.emit('openPopupAddLink');

      expect(popup.isShow()).toBe(true);
    });

    it('closeAllPopup event closes popup', () => {
      em.emit('openPopupAddLink');
      em.emit('closeAllPopup');

      expect(popup.isShow()).toBe(false);
    });
  });

  describe('add link with url', () => {
    it('_getValue() returns text/url values', () => {
      linkTextInput.value = 'myLinkText';
      urlInput.value = 'myUrl';

      const value = popup._getValue();

      expect(value.linkText).toEqual('myLinkText');
      expect(value.url).toEqual('myUrl');
    });

    it('clear text fields after popup closed', () => {
      linkTextInput.value = 'myLinkText';
      urlInput.value = 'myUrl';

      popup.hide();
      const value = popup._getValue();

      expect(value.linkText).toEqual('');
      expect(value.url).toEqual('');
    });
  });

  describe('validator', () => {
    let handler;

    beforeEach(() => {
      handler = jasmine.createSpy('buttonClickedHandler');
    });

    it('should not emit AddLink and style input if url not filled', () => {
      em.listen('command', handler);
      linkTextInput.value = 'linkText';

      $(okButton).trigger('click');

      expect(handler).not.toHaveBeenCalled();
      expect($(urlInput).hasClass('wrong')).toBe(true);
    });

    it('should not emit AddLink and style input if url not filled', () => {
      em.listen('command', handler);
      urlInput.value = 'urlText';

      $(okButton).trigger('click');

      expect(handler).not.toHaveBeenCalled();
      expect($(linkTextInput).hasClass('wrong')).toBe(true);
    });
  });

  describe('show()', () => {
    it('load selected text from editor', () => {
      selectedText = 'text';
      popup.show();

      const value = popup._getValue();

      expect(value.linkText).toEqual(selectedText);
    });

    it('load selected url text from editor and fill url too', () => {
      selectedText = 'http://www.nhn.com';
      popup.show();

      const value = popup._getValue();

      expect(value.linkText).toEqual(selectedText);
      expect(value.url).toEqual(selectedText);
    });
  });
});
