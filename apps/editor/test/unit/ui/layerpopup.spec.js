/**
 * @fileoverview test ui layer popup
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import LayerPopup from '@/ui/layerpopup';

const CLASS_PREFIX = 'tui-popup-';

describe('LayerPopup', () => {
  let popup;

  afterEach(() => {
    popup = null;
    $('body').empty();
  });

  it('render element on target option', () => {
    $('body').html('<div class="container" />');

    popup = new LayerPopup({
      target: $('.container').get(0)
    });

    expect($(popup._target).hasClass('container')).toBe(true);
  });

  describe('factory', () => {
    beforeEach(() => {
      $('body').html(`<div class="${CLASS_PREFIX}wrapper" />`);

      popup = new LayerPopup({
        el: $(`.${CLASS_PREFIX}wrapper`).get(0)
      });
    });

    it('popup body takes given el option', () => {
      expect($(popup.el).hasClass(`${CLASS_PREFIX}wrapper`)).toBe(true);
    });

    it('el option have priority over content option', () => {
      $('body').html(LayerPopup.prototype.layoutTemplate);

      popup = new LayerPopup({
        el: $(`.${CLASS_PREFIX}wrapper`).get(0),
        content: $('<p>test</p>').get(0)
      });

      expect($(popup._target).find('p').length).toBe(0);
    });
  });

  describe('layout', () => {
    it('has default elements and each of them have proper classe', () => {
      popup = new LayerPopup();

      expect($(popup._target).find(`.${CLASS_PREFIX}wrapper`).length).toBe(1);
      expect($(popup._target).find(`.${CLASS_PREFIX}header`).length).toBe(1);
      expect($(popup._target).find(`.${CLASS_PREFIX}body`).length).toBe(1);
      expect($(popup._target).find(`.${CLASS_PREFIX}close-button`).length).toBe(1);
    });

    it('has class passed from className option', () => {
      popup = new LayerPopup({
        className: 'myclass'
      });

      expect($(popup.el).hasClass('myclass')).toBe(true);
    });

    it('has text from textContent option', () => {
      popup = new LayerPopup({
        textContent: 'text'
      });

      expect(
        $(popup.el)
          .find(`.${CLASS_PREFIX}body`)
          .text()
      ).toEqual('text');
    });

    it('has html from content option as html string', () => {
      popup = new LayerPopup({
        content: '<p>test</p>'
      });

      expect($(popup._target).find('p').length).toBe(1);
    });

    it('has element from content option as element', () => {
      popup = new LayerPopup({
        content: $('<p>test</p>').get(0)
      });

      expect($(popup._target).find('p').length).toBe(1);
    });

    it('has title from title option', () => {
      popup = new LayerPopup({
        title: 'mytitle'
      });

      expect($(`.${CLASS_PREFIX}title`).text()).toEqual('mytitle');
    });

    it('do not render if header option is false', () => {
      popup = new LayerPopup({
        header: false
      });

      expect($(`.${CLASS_PREFIX}header`).length).toEqual(0);
    });
  });

  it('css option can apply style to popup wrapper', () => {
    popup = new LayerPopup({
      content: '<p>test</p>',
      css: {
        width: '10px'
      }
    });

    expect($(`.${CLASS_PREFIX}wrapper`).width()).toEqual(10);
  });

  describe('setContent', () => {
    beforeEach(() => {
      popup = new LayerPopup();
    });

    it('should set content', () => {
      popup.setContent('text');
      expect(
        $(popup.el)
          .find(`.${CLASS_PREFIX}body`)
          .text()
      ).toEqual('text');
    });
    it('should replace previous content', () => {
      popup.setContent('text');
      popup.setContent('text');
      expect(
        $(popup.el)
          .find(`.${CLASS_PREFIX}body`)
          .text()
      ).toEqual('text');
    });
  });

  describe('setTitle', () => {
    beforeEach(() => {
      popup = new LayerPopup();
    });

    it('should set title', () => {
      popup.setTitle('title');
      expect($(`.${CLASS_PREFIX}title`).text()).toEqual('title');
    });

    it('should replace previous title', () => {
      popup.setTitle('titleBefore');
      popup.setTitle('title');
      expect($(`.${CLASS_PREFIX}title`).text()).toEqual('title');
    });
  });

  it(`should close popup on click element having ${CLASS_PREFIX}close-button class`, () => {
    popup = new LayerPopup();

    popup.show();
    expect(popup.isShow()).toBe(true);

    $(`.${CLASS_PREFIX}close-button`).trigger('click');
    expect(popup.isShow()).toBe(false);
  });

  it('should open popup on click element having the class given to openerCssQuery', () => {
    $('body').append($('<button type="button" class="button1 openPopup"></button>'));
    $('body').append($('<button type="button" class="button2 openPopup"></button>'));

    popup = new LayerPopup({
      openerCssQuery: '.openPopup'
    });

    $('.button1').trigger('click');
    expect(popup.isShow()).toBe(true);
    popup.hide();

    $('.button2').trigger('click');
    expect(popup.isShow()).toBe(true);
  });

  it('should close popup on click element having the class given to closerCssQuery', () => {
    $('body').append($('<button type="button" class="button1 closePopup"></button>'));
    $('body').append($('<button type="button" class="button2 closePopup"></button>'));

    popup = new LayerPopup({
      closerCssQuery: '.closePopup'
    });

    popup.show();
    $('.button1').trigger('click');
    expect(popup.isShow()).toBe(false);

    popup.show();
    $('.button2').trigger('click');
    expect(popup.isShow()).toBe(false);
  });

  describe('show/hide', () => {
    beforeEach(() => {
      popup = new LayerPopup({
        el: $('<div class="container" />').get(0)
      });
    });

    it('show() should open popup', () => {
      popup.hide();
      popup.show();

      expect($(popup.el).css('display')).toEqual('block');
      expect(popup.isShow()).toBe(true);
    });

    it('hide() should close popup', () => {
      popup.show();
      popup.hide();

      expect($(popup.el).css('display')).toEqual('none');
      expect(popup.isShow()).toBe(false);
    });
  });

  it('remove() should remove wrapper element', () => {
    popup = new LayerPopup();

    popup.remove();
    expect($(`.${CLASS_PREFIX}wrapper`).length).toBe(0);
  });

  describe('remove()', () => {
    beforeEach(() => {
      $('body').append($('<button type="button" class="button1 openPopup"></button>'));

      popup = new LayerPopup({
        openerCssQuery: '.openPopup'
      });
    });

    it('should remove wrapper element', () => {
      popup.remove();
      expect($(`.${CLASS_PREFIX}wrapper`).length).toBe(0);
    });

    it('should not trigger button click event after remove() call', () => {
      const button = $('.button1');

      popup.remove();
      button.trigger('click');
      expect(popup.isShow()).toBe(false);
    });

    it('should not trigger close button click event after remove() call', () => {
      const button = $(`.${CLASS_PREFIX}close-button`);

      popup.show();
      popup.remove();
      button.trigger('click');
      expect(popup.isShow()).toBe(true);
    });
  });

  describe('custom event', () => {
    beforeEach(() => {
      popup = new LayerPopup();
    });

    it('trigger() should result calling given handler', () => {
      const spy = jasmine.createSpy('spy');

      popup.on('cev', spy);
      popup.trigger('cev');

      expect(spy).toHaveBeenCalled();
    });

    it('off() should unbind given event handler', () => {
      const spy = jasmine.createSpy('spy');

      popup.on('cev', spy);
      popup.off('cev');
      popup.trigger('cev');

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('modal popup', () => {
    beforeEach(() => {
      popup = new LayerPopup({
        modal: true
      });
    });

    it('contains modal layout if modal option is true', () => {
      expect($(popup.el).hasClass('tui-popup-modal-background')).toBe(true);

      popup = new LayerPopup();

      expect($(popup.el).hasClass('tui-popup-modal-background')).toBe(false);
    });

    it('toggleFitToWindow should toggle style', () => {
      const isFitToWindow = popup.isFitToWindow();

      popup.toggleFitToWindow();
      expect(popup.isFitToWindow()).toBe(!isFitToWindow);

      popup.toggleFitToWindow();
      expect(popup.isFitToWindow()).toBe(isFitToWindow);
    });
  });
});
