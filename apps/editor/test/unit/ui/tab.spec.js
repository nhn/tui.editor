/**
 * @fileoverview test ui tab
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import Tab from '@/ui/tab';

describe('Tab', () => {
  let tab;

  afterEach(() => {
    $('body').empty();
  });

  it('create tab buttons from items option', () => {
    tab = new Tab({
      items: ['tab1', 'tab2']
    });
    $('body').append(tab.el);

    const buttons = $('button');

    expect(buttons[0].textContent).toBe('tab1');
    expect(buttons[1].textContent).toBe('tab2');
  });

  describe('tab button event', () => {
    it('onItemClick called on tab button click', () => {
      const handler = jasmine.createSpy('onItemClick');

      tab = new Tab({
        items: ['tab1', 'tab2'],
        onItemClick: handler
      });

      $('body').append(tab.el);

      $('button')
        .eq(0)
        .trigger('click');

      expect(handler).toHaveBeenCalled();
    });

    it('onItemClick handler gets name of clicked tab button', () => {
      const spy = jasmine.createSpy('onItemClick');

      tab = new Tab({
        items: ['tab1', 'tab2'],
        onItemClick: spy
      });

      $('body').append(tab.el);

      $('button')
        .eq(0)
        .trigger('click');

      expect(spy.calls.mostRecent().args[0]).toEqual('tab1');
    });
  });

  describe('onItemClick callback option', () => {
    beforeEach(() => {
      const handler = jasmine.createSpy('onItemClick');

      tab = new Tab({
        items: ['tab1', 'tab2'],
        onItemClick: handler
      });

      $('body').append(tab.el);
    });

    it('clicked button should have active class', () => {
      const $clickedButton = $('button').eq(1);

      $clickedButton.trigger('click');

      expect($clickedButton.hasClass('te-tab-active')).toBe(true);
    });

    it('click on a button should remove active class on the other buttons', () => {
      const $clickedButton1 = $('button').eq(0);
      const $clickedButton2 = $('button').eq(1);

      $clickedButton1.trigger('click');
      $clickedButton2.trigger('click');

      expect($clickedButton1.hasClass('te-tab-active')).not.toBe(true);
      expect($clickedButton2.hasClass('te-tab-active')).toBe(true);
    });
  });

  describe('initName option', () => {
    let tabSection1, tabSection2;

    beforeEach(() => {
      tabSection1 = $('<div>tab1</div>').get(0);
      tabSection2 = $('<div>tab2</div>').get(0);

      $('body').append(tabSection1);
      $('body').append(tabSection2);

      tab = new Tab({
        initName: 'tab2',
        items: ['tab1', 'tab2'],
        sections: [tabSection1, tabSection2]
      });

      $('body').append(tab.el);
    });
    it('sets initial active tab button', () => {
      const buttons = $('button');

      expect($(buttons[1]).hasClass('te-tab-active')).toBe(true);
    });

    it('sets initial active tab section', () => {
      expect(
        $('div')
          .eq(1)
          .hasClass('te-tab-active')
      ).toBe(true);
    });
  });

  describe('tab section', () => {
    let tabSection1, tabSection2;

    beforeEach(() => {
      tabSection1 = $('<div>tab1</div>').get(0);
      tabSection2 = $('<div>tab2</div>').get(0);

      $('body').append(tabSection1);
      $('body').append(tabSection2);

      tab = new Tab({
        initName: 'tab1',
        items: ['tab1', 'tab2'],
        sections: [tabSection1, tabSection2]
      });

      $('body').append(tab.el);
    });

    it('click on tab button should result corresponding section activated', () => {
      $('button')
        .eq(1)
        .trigger('click');
      expect($(tabSection2).hasClass('te-tab-active')).toBe(true);
    });

    it('click on the other tab button should result de-activating previously activated section', () => {
      $('button')
        .eq(0)
        .trigger('click');
      $('button')
        .eq(1)
        .trigger('click');

      expect($(tabSection1).hasClass('te-tab-active')).toBe(false);
      expect($(tabSection2).hasClass('te-tab-active')).toBe(true);
    });
  });

  describe('.activate()', () => {
    beforeEach(() => {
      tab = new Tab({
        items: ['tab1', 'tab2']
      });

      $('body').append(tab.el);
    });

    it('activate a button having given name', () => {
      tab.activate('tab1');

      expect($('button:contains("tab1")').hasClass('te-tab-active')).toBe(true);
    });
  });
});
