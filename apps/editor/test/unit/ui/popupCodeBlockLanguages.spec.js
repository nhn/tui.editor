/**
 * @fileoverview test ui popup code block languages
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import PopupCodeBlockLanguages from '@/ui/popupCodeBlockLanguages';
import EventManager from '@/eventManager';

const languages = ['javascript', 'java', 'php'];

describe('code block gadget', () => {
  let em, popup;

  beforeEach(() => {
    em = new EventManager();
    popup = new PopupCodeBlockLanguages({
      eventManager: em,
      languages
    });
  });

  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  it('currentLanguage setter should activate the button manually', () => {
    popup.setCurrentLanguage('php');
    expect($(popup._currentButton).attr('data-lang')).toBe('php');
    expect($(popup._currentButton).hasClass('active')).toBe(true);
  });

  it('next() should set current language to next language', () => {
    popup.next();
    expect(popup.getCurrentLanguage()).toBe(languages[1]);

    popup.next();
    popup.next();
    expect(popup.getCurrentLanguage()).toBe(languages[0]);
  });

  it('prev() should set current language to prev language', () => {
    popup.prev();
    expect(popup.getCurrentLanguage()).toBe(languages[2]);

    popup.prev();
    expect(popup.getCurrentLanguage()).toBe(languages[1]);
  });
});
