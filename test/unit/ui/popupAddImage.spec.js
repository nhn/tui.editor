/**
 * @fileoverview test popup add image
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import PopupAddImage from '../../../src/js/ui/popupAddImage';
import EventManager from '../../../src/js/eventManager';

describe('PopupAddImage', () => {
  let popup,
    em;

  beforeEach(() => {
    em = new EventManager();

    popup = new PopupAddImage({
      eventManager: em
    });
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('button events', () => {
    beforeEach(() => {
      spyOn(popup, 'hide');
    });

    it('hide on ok button', () => {
      $('.te-ok-button').trigger('click');

      expect(popup.hide).toHaveBeenCalled();
    });

    it('hide on close button', () => {
      $('.te-close-button').trigger('click');

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

      $('.te-image-url-input').val(value.imageUrl);
      $('.te-alt-text-input').val(value.altText);

      $('.te-ok-button').trigger('click');

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

      $('.te-image-url-input').val('imageUrlText');
      $('.te-alt-text-input').val('altText');

      expect($('.te-image-url-input').val()).toEqual(value.imageUrl);
      expect($('.te-alt-text-input').val()).toEqual(value.altText);
    });

    it('clear input values on hide', () => {
      $('.te-image-url-input').val('imageUrlText');
      $('.te-alt-text-input').val('altText');

      popup.hide();

      expect($('.te-image-url-input').val()).toEqual('');
      expect($('.te-alt-text-input').val()).toEqual('');
    });

    it('when tab has changed then reset inputs', () => {
      $('.te-image-url-input').val('imageUrlText');
      $('.te-alt-text-input').val('altText');

      popup.$el.find('.te-tab button').eq(1).trigger('click');

      expect($('.te-image-url-input').val()).toEqual('');
      expect($('.te-alt-text-input').val()).toEqual('');
    });
  });

  // File type input can't customize file property, so can't mock input value
  // When input value does not exist, addImageBlobHook event does not occur.
  describe('add image with selecting image', () => {
    xit('addImageBlobHook on ok button.', () => {
      const hook = jasmine.createSpy('addImageBlobHook');
      em.listen('addImageBlobHook', hook);

      $('.te-ok-button').trigger('click');

      expect(hook).toHaveBeenCalled();
    });

    xit('add image via popup should set addImageBlobHook `ui` for from', () => {
      em.listen('addImageBlobHook', (fileBlob, callback, from) => {
        expect(from).toEqual('ui');
      });

      $('.te-alt-text-input').val('image');

      $('.te-ok-button').trigger('click');
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

      $('.te-alt-text-input').val(value.altText);

      $('.te-ok-button').trigger('click');
    });
  });
});
