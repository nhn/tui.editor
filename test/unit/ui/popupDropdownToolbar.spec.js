/**
 * @fileoverview test ui popup dropdown toolbar
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import PopupDropdownToolbar from '../../../src/js/ui/popupDropdownToolbar';
import EventManager from '../../../src/js/eventManager';

describe('popupDropdownToolbar', () => {
  let popup,
    eventManager,
    $target,
    $button;

  beforeEach(() => {
    $target = $('<div>');
    $button = $('<button>');
    eventManager = new EventManager();

    popup = new PopupDropdownToolbar({
      eventManager,
      $target,
      $button
    });
  });

  afterEach(() => {
    $target.remove();
    $button.remove();
  });

  describe('constructor', () => {
    it('should initialize', () => {
      expect(popup.$el.hasClass('te-dropdown-toolbar')).toBe(true);
      expect(popup.$body.find('.tui-editor-defaultUI-toolbar').length).toBe(1);
      expect(popup._eventManager instanceof EventManager).toBe(true);
    });
  });

  describe('editor event', () => {
    it('openDropdownToolbar should call show', () => {
      spyOn(popup, 'show');

      eventManager.emit('openDropdownToolbar');

      expect(popup.show).toHaveBeenCalled();
    });

    it('focus should call hide', () => {
      spyOn(popup, 'hide');

      eventManager.emit('focus');

      expect(popup.hide).toHaveBeenCalled();
    });

    it('closeAllPopup should call hide', () => {
      spyOn(popup, 'hide');

      eventManager.emit('closeAllPopup');

      expect(popup.hide).toHaveBeenCalled();
    });
  });

  describe('proxy methods to toolbar', () => {
    it('should be impletmeted', () => {
      const toolbar = popup.getToolbar();

      spyOn(toolbar, 'getItems');
      popup.getItems();
      spyOn(toolbar, 'getItem');
      popup.getItem();
      spyOn(toolbar, 'setItems');
      popup.setItems();
      spyOn(toolbar, 'addItem');
      popup.addItem();
      spyOn(toolbar, 'insertItem');
      popup.insertItem();
      spyOn(toolbar, 'indexOfItem');
      popup.indexOfItem();
      spyOn(toolbar, 'removeItem');
      popup.removeItem();
      spyOn(toolbar, 'removeAllItems');
      popup.removeAllItems();

      expect(toolbar.getItems).toHaveBeenCalled();
      expect(toolbar.getItem).toHaveBeenCalled();
      expect(toolbar.setItems).toHaveBeenCalled();
      expect(toolbar.addItem).toHaveBeenCalled();
      expect(toolbar.insertItem).toHaveBeenCalled();
      expect(toolbar.indexOfItem).toHaveBeenCalled();
      expect(toolbar.removeItem).toHaveBeenCalled();
      expect(toolbar.removeAllItems).toHaveBeenCalled();
    });
  });
});
