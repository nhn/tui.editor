/**
 * @fileoverview test popup add image
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import '@/i18n/en-us';
import PopupAddImage from '@/ui/popupAddImage';
import EventManager from '@/eventManager';

function clickBtn(className) {
  document.querySelector(`.te-${className}`).click();
}

function setInputValue(className, value) {
  document.querySelector(`.te-${className}`).value = value;
}

function getInputValue(className) {
  return document.querySelector(`.te-${className}`).value;
}

describe('PopupAddImage', () => {
  let popup, em;

  beforeEach(() => {
    em = new EventManager();

    popup = new PopupAddImage({
      eventManager: em
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('button events', () => {
    beforeEach(() => {
      spyOn(popup, 'hide');
    });

    it('hide on ok button', () => {
      clickBtn('ok-button');

      expect(popup.hide).toHaveBeenCalled();
    });

    it('hide on close button', () => {
      clickBtn('close-button');

      expect(popup.hide).toHaveBeenCalled();
    });
  });

  describe('eventManager', () => {
    let handler;

    beforeEach(() => {
      handler = jasmine.createSpy('buttonClickedHandler');
    });

    it('emit command event on ok button', () => {
      const value = {
        imageUrl: 'imageUrlText',
        altText: 'altText'
      };

      em.listen('command', handler);

      setInputValue('image-url-input', value.imageUrl);
      setInputValue('alt-text-input', value.altText);

      clickBtn('ok-button');

      expect(handler).toHaveBeenCalledWith('AddImage', value);
    });

    it('show popup on openPopupAddImage event', () => {
      em.emit('openPopupAddImage');

      expect(popup.isShow()).toBe(true);
    });

    it('hide popup on closeAllPopup event', () => {
      em.emit('openPopupAddImage');
      em.emit('closeAllPopup');

      expect(popup.isShow()).toBe(false);
    });
  });

  describe('add image with url', () => {
    it('getValue() returns imageUrl & altText', () => {
      const value = {
        imageUrl: 'imageUrlText',
        altText: 'altText'
      };

      setInputValue('image-url-input', 'imageUrlText');
      setInputValue('alt-text-input', 'altText');

      expect(getInputValue('image-url-input')).toEqual(value.imageUrl);
      expect(getInputValue('alt-text-input')).toEqual(value.altText);
    });

    it('clear input values on hide', () => {
      setInputValue('image-url-input', 'imageUrlText');
      setInputValue('alt-text-input', 'altText');

      popup.hide();

      expect(getInputValue('image-url-input')).toEqual('');
      expect(getInputValue('alt-text-input')).toEqual('');
    });

    it('when tab has changed then reset inputs', () => {
      setInputValue('image-url-input', 'imageUrlText');
      setInputValue('alt-text-input', 'altText');

      popup.el.querySelectorAll('.te-tab button')[1].click();

      expect(getInputValue('image-url-input')).toEqual('');
      expect(getInputValue('alt-text-input')).toEqual('');
    });
  });

  // File type input can't customize file property, so can't mock input value
  // When input value does not exist, addImageBlobHook event does not occur.
  describe('add image with selecting image', () => {
    xit('addImageBlobHook on ok button.', () => {
      const hook = jasmine.createSpy('addImageBlobHook');

      em.listen('addImageBlobHook', hook);

      clickBtn('ok-button');

      expect(hook).toHaveBeenCalled();
    });

    xit('add image via popup should set addImageBlobHook `ui` for from', () => {
      em.listen('addImageBlobHook', (fileBlob, callback, from) => {
        expect(from).toEqual('ui');
      });

      setInputValue('alt-text-input', 'image');

      clickBtn('ok-button');
    });

    xit('image url can be modified on addImageBlobHook callback', done => {
      const addImage = jasmine.createSpy('addImage');
      const value = {
        imageUrl: 'imageUrlText',
        altText: 'altText'
      };

      em.listen('command', (type, imageValue) => addImage(imageValue));
      em.listen('addImageBlobHook', (fileBlob, callback, from) => {
        setTimeout(() => {
          callback('modifiedURL');
          expect(addImage).toHaveBeenCalledWith({
            imageUrl: 'modifiedURL',
            altText: value.altText
          });
          expect(from).toEqual('ui');
          done();
        }, 0);
      });

      setInputValue('alt-text-input', value.altText);

      clickBtn('ok-button');
    });
  });
});
