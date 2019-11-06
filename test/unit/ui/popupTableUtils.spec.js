/**
 * @fileoverview test ui popup table utils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import PopupTableUtils, {
  REMOVE_ROW_MENU_CLASS_NAME,
  DISABLE_MENU_CLASS_NAME
} from '@/ui/popupTableUtils';
import EventManager from '@/eventManager';

describe('popupTableUtils', () => {
  let $target, em, popup;

  beforeEach(() => {
    $target = $('<div>');
    em = new EventManager();
    popup = new PopupTableUtils({
      $target,
      eventManager: em
    });
  });

  afterEach(() => {
    $target.remove();
  });

  it(`if target element where created popup is table header, 'remove row' menu is disabled`, () => {
    const $menu = popup.$el.find(`.${REMOVE_ROW_MENU_CLASS_NAME}`);

    popup._disableRemoveRowMenu($('<th>')[0]);
    expect($menu.hasClass(`${DISABLE_MENU_CLASS_NAME}`)).toBe(true);

    popup._disableRemoveRowMenu($('<td>')[0]);
    expect($menu.hasClass(`${DISABLE_MENU_CLASS_NAME}`)).toBe(false);
  })
});
