/**
 * @fileoverview test ui popup table utils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import PopupTableUtils, {
  REMOVE_ROW_MENU_CLASS_NAME,
  DISABLED_MENU_CLASS_NAME
} from '@/ui/popupTableUtils';
import EventManager from '@/eventManager';

describe('popupTableUtils', () => {
  let $target, popup;

  beforeEach(() => {
    $target = $('<div>');
    popup = new PopupTableUtils({
      target: $target.get(0),
      eventManager: new EventManager()
    });
  });

  afterEach(() => {
    $target.remove();
  });

  describe(`'remove row' menu`, () => {
    it('is disabled when target element where created popup is table header', () => {
      const $menu = $(popup.el.querySelector(`.${REMOVE_ROW_MENU_CLASS_NAME}`));

      popup._disableRemoveRowMenu($('<th>')[0]);
      expect($menu.hasClass(DISABLED_MENU_CLASS_NAME)).toBe(true);

      popup._disableRemoveRowMenu($('<td>')[0]);
      expect($menu.hasClass(DISABLED_MENU_CLASS_NAME)).toBe(false);
    });

    it('is prevented click event when having disabled class name', () => {
      const $menu = $(popup.el.querySelector(`.${REMOVE_ROW_MENU_CLASS_NAME}`));

      spyOn(popup.eventManager, 'emit');

      $menu.addClass(DISABLED_MENU_CLASS_NAME);
      $menu.click();

      expect(popup.eventManager.emit).not.toHaveBeenCalled();
    });
  });
});
