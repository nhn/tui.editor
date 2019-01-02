/**
 * @fileoverview test code block languages combo
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
/* eslint new-cap:0 */
import $ from 'jquery';

import CodeBlockLanguagesCombo from '../../../src/js/ui/codeBlockLanguagesCombo';
import PopupCodeBlockLanguages from '../../../src/js/ui/popupCodeBlockLanguages';
import EventManager from '../../../src/js/eventManager';
import KeyMapper from '../../../src/js/keyMapper';

describe('CodeBlockLanguagesCombo', () => {
  let combo, $popupWrapper, eventManager, popupLanguages;

  beforeEach(() => {
    $popupWrapper = $('<div>');
    document.body.appendChild($popupWrapper.get(0));

    eventManager = new EventManager();

    popupLanguages = new PopupCodeBlockLanguages({
      $target: $popupWrapper,
      eventManager,
      languages: ['java', 'javascript', 'uml']
    });

    combo = new CodeBlockLanguagesCombo(eventManager);
    document.body.appendChild(combo.getElement());
  });

  afterEach(() => {
    document.body.removeChild($popupWrapper.get(0));
    document.body.removeChild(combo.getElement());
  });

  it('getElement() should return HTMLNode', () => {
    expect(combo.getElement() instanceof HTMLElement).toBe(true);
  });

  it('_showPopupCodeBlockLanguages()', () => {
    spyOn(popupLanguages, 'show');

    combo._showPopupCodeBlockLanguages();

    expect(popupLanguages.show).toHaveBeenCalled();
  });

  describe('key events', () => {
    let keyEvent = $.Event('keydown');

    describe('_storeInpuLanguage() should be called', () => {
      beforeEach(() => {
        spyOn(combo, '_storeInputLanguage');
      });

      it('on enter / tab key down on input language', () => {
        keyEvent.which = KeyMapper.keyCode('ENTER');
        combo._onKeyEvent(keyEvent);

        expect(combo._storeInputLanguage).toHaveBeenCalled();

        keyEvent.which = KeyMapper.keyCode('TAB');
        combo._onKeyEvent(keyEvent);

        expect(combo._storeInputLanguage.calls.count()).toBe(2);
      });

      it('on enter / tab key down on input language on PopupCodeBlockLanguages', () => {
        combo._showPopupCodeBlockLanguages();

        keyEvent.which = KeyMapper.keyCode('ENTER');
        combo._onKeyEvent(keyEvent);

        expect(combo._storeInputLanguage).toHaveBeenCalled();

        combo._showPopupCodeBlockLanguages();

        keyEvent.which = KeyMapper.keyCode('TAB');
        combo._onKeyEvent(keyEvent);

        expect(combo._storeInputLanguage.calls.count()).toBe(2);
      });

      it('on list selected on PopupCodeBlockLanguages', () => {
        combo._showPopupCodeBlockLanguages();

        popupLanguages._onSelectedLanguage('javascript');

        expect(combo._storeInputLanguage).toHaveBeenCalled();
      });
    });

    it('_storeInputLanguage() should be called on enter/tab on input language', () => {
      spyOn(combo, '_storeInputLanguage');

      keyEvent.which = KeyMapper.keyCode('ENTER');
      combo._onKeyEvent(keyEvent);

      expect(combo._storeInputLanguage).toHaveBeenCalled();

      keyEvent.which = KeyMapper.keyCode('TAB');
      combo._onKeyEvent(keyEvent);

      expect(combo._storeInputLanguage.calls.count()).toBe(2);
    });

    it('up / down keys should change current language on PopupCodeBlockLanguages', () => {
      combo._showPopupCodeBlockLanguages();
      let focusedLanguage = popupLanguages.getCurrentLanguage();

      keyEvent.which = KeyMapper.keyCode('UP');
      combo._onKeyEvent(keyEvent);

      expect(popupLanguages.getCurrentLanguage()).not.toEqual(focusedLanguage);

      keyEvent.which = KeyMapper.keyCode('DOWN');
      combo._onKeyEvent(keyEvent);
      expect(popupLanguages.getCurrentLanguage()).toEqual(focusedLanguage);
    });

    it('the other keys should close popup', () => {
      spyOn(popupLanguages, 'hide');
      combo._showPopupCodeBlockLanguages();

      keyEvent.which = KeyMapper.keyCode('ESCAPE');
      combo._onKeyEvent(keyEvent);

      expect(popupLanguages.hide).toHaveBeenCalled();
    });
  });

  it('callback should be called on selection', () => {
    const callback = jasmine.createSpy('onSelect');

    combo.setOnLanguageSelected(callback);
    combo.setLanguage('javascript');
    combo._storeInputLanguage();

    expect(callback).toHaveBeenCalledWith('javascript');
  });

  it('should hide PopupCodeBlockLanguages on focusOut', () => {
    spyOn(popupLanguages, 'hide');
    combo._onFocusOut();

    expect(popupLanguages.hide).toHaveBeenCalled();
  });
});
