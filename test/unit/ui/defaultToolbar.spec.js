/**
 * @fileoverview test default toolbar
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import EventManager from '../../../src/js/eventManager';
import Toolbar from '../../../src/js/ui/toolbar';
import DefaultToolbar from '../../../src/js/ui/defaultToolbar';
import PopupDropdownToolbar from '../../../src/js/ui/popupDropdownToolbar';

const items = [
  'heading',
  'bold',
  'italic',
  'strike',
  'divider',
  'hr',
  'quote',
  'divider',
  'ul',
  'ol',
  'task',
  'indent',
  'outdent',
  'divider',
  'table',
  'image',
  'link',
  'divider',
  'code',
  'codeblock'
];

describe('DefaultToolbar', () => {
  let $container,
    eventManager,
    toolbar;

  beforeEach(() => {
    jasmine.getStyleFixtures().fixturesPath = '/base';
    loadStyleFixtures('src/css/tui-editor.css');

    $container = $('<div style="width: 500px;">');
    $('body').append($container);
    eventManager = new EventManager();
    toolbar = new DefaultToolbar(eventManager, items);
    $container.append(toolbar.$el);
  });

  afterEach(() => {
    $container.remove();
    toolbar.destroy();
  });

  describe('constructor', () => {
    it('should extends Toolbar', () => {
      expect(toolbar instanceof Toolbar).toBe(true);
    });

    it('should have dropdownToolbar, moreButton', () => {
      expect(toolbar._moreButton.getName()).toBe('more');
      expect(toolbar._popupDropdownToolbar instanceof PopupDropdownToolbar).toBe(true);
    });
  });

  describe('_balanceButtons', () => {
    it('should be called when the container width change', done => {
      spyOn(toolbar, '_balanceButtons');

      $container.width('400px');

      setTimeout(() => {
        expect(toolbar._balanceButtons).toHaveBeenCalled();
        done();
      }, 50);
    });

    it('should move overflow buttons to dropdown toolbar', done => {
      $container.width('400px');

      setTimeout(() => {
        const defaultToolbarItems = toolbar.getItems();
        const dropdownToolbaritems = toolbar._popupDropdownToolbar.getItems();

        expect(defaultToolbarItems.length < items.length).toBe(true);
        expect(dropdownToolbaritems.length > 0).toBe(true);
        done();
      }, 50);
    });
  });
});
