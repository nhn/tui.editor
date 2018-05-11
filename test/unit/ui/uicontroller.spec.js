/**
 * @fileoverview test ui controller
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import UIController from '../../../src/js/ui/uicontroller';

describe('UIController', () => {
  let uic;

  beforeEach(() => {
    uic = new UIController();
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('on()', () => {
    it('should bind custom event handler', () => {
      const spy = jasmine.createSpy();

      uic.on('event!', spy);

      uic.trigger('event!');

      expect(spy).toHaveBeenCalled();
    });

    it('should bind event handler on element', () => {
      const spy = jasmine.createSpy();

      uic.on('click', spy);

      uic.$el.trigger('click');

      expect(spy).toHaveBeenCalled();
    });

    it('should bind multiple event handler via object', () => {
      const spy = jasmine.createSpy();

      uic.on({
        'event!': spy
      });

      uic.trigger('event!');

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('off()', () => {
    it('should unbind custom event handler', () => {
      const spy = jasmine.createSpy();

      uic.on('event!', spy);

      uic.off('event!');

      uic.trigger('event!');

      expect(spy).not.toHaveBeenCalled();
    });

    it('should unbind event handler on element', () => {
      const spy = jasmine.createSpy();

      uic.on('click', spy);
      uic.off('click');
      uic.$el.trigger('click');

      expect(spy).not.toHaveBeenCalled();
    });

    it('should unbind all event handlers if no event specified', () => {
      const spy = jasmine.createSpy();
      const spy2 = jasmine.createSpy();

      uic.on('click', spy);
      uic.on('event!', spy);

      uic.off();

      uic.$el.trigger('click');
      uic.trigger('event!');

      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });
  });

  describe('_setRootElement()', () => {
    it('should set root element with given jQuery element', () => {
      const elem = $('<div />');

      uic._setRootElement(elem);

      expect(uic.$el).toBe(elem);
    });

    it('should set root element with div element if no parameter provided', () => {
      uic._setRootElement();
      expect(uic.$el[0].tagName).toBe('DIV');
    });

    it('should set root element according to tagName & className properties', () => {
      uic.tagName = 'ol';
      uic.className = 'myclass';
      uic._setRootElement();

      expect(uic.$el[0].tagName).toEqual('OL');
      expect(uic.$el[0].className).toEqual('myclass');
    });
  });
});
