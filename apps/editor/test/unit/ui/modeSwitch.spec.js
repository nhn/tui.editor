/**
 * @fileoverview test ui mode switch
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import ModeSwitch from '@/ui/modeSwitch';
import EventManager from '@/eventManager';

describe('ModeSwitch', () => {
  let container, modeSwitch, eventManager;

  beforeEach(() => {
    eventManager = new EventManager();
    container = $('<div>').get(0);
    $('body').append(container);
  });

  afterEach(() => {
    modeSwitch.destroy();
    $(container).empty();
  });

  it('editorTypeControl should be exist', () => {
    modeSwitch = new ModeSwitch(container, null, eventManager);

    expect($('.te-mode-switch').length).toEqual(1);
  });

  describe('should apply button type on option', () => {
    it('markdown', () => {
      modeSwitch = new ModeSwitch(container, ModeSwitch.TYPE.MARKDOWN, eventManager);

      expect($('button.te-switch-button.active').length).toEqual(1);
      expect($('button.te-switch-button.wysiwyg.active').length).toEqual(0);
      expect($('button.te-switch-button.markdown.active').length).toEqual(1);
      expect($('button.te-switch-button.markdown.active').text()).toEqual('Markdown');
    });
    it('wysiwyg', () => {
      modeSwitch = new ModeSwitch(container, ModeSwitch.TYPE.WYSIWYG, eventManager);

      expect($('button.te-switch-button.active').length).toEqual(1);
      expect($('button.te-switch-button.markdown.active').length).toEqual(0);
      expect($('button.te-switch-button.wysiwyg.active').length).toEqual(1);
      expect($('button.te-switch-button.wysiwyg.active').text()).toEqual('WYSIWYG');
    });
  });

  it('should add `active` class on click button', () => {
    modeSwitch = new ModeSwitch(container, null, eventManager);

    expect($('button.te-switch-button.wysiwyg').text()).toEqual('WYSIWYG');
    expect($('button.te-switch-button.markdown.active').text()).toEqual('Markdown');

    $('button').trigger('click');

    expect($('button.te-switch-button.wysiwyg.active').text()).toEqual('WYSIWYG');
    expect($('button.te-switch-button.markdown').text()).toEqual('Markdown');
  });

  describe('isShown', () => {
    it('should return is visible status', () => {
      modeSwitch = new ModeSwitch(container, null, eventManager);
      expect(modeSwitch.isShown()).toBe(true);

      modeSwitch._rootElement.style.display = 'none';
      expect(modeSwitch.isShown()).toBe(false);
    });
  });

  describe('show/hide', () => {
    it('should show/hide the base element', () => {
      modeSwitch = new ModeSwitch(container, null, eventManager);

      modeSwitch.hide();
      expect(modeSwitch._rootElement.style.display).toBe('none');

      modeSwitch.show();
      expect(modeSwitch._rootElement.style.display).toBe('block');
    });
  });

  it('form interaction should not trigger form submit on click', () => {
    const form = $('<form action="javascript:void(0)">').get(0);

    spyOnEvent(form, 'submit');

    container.appendChild(form);

    modeSwitch = new ModeSwitch(form, null, eventManager);

    $('button').trigger('click');
    expect('submit').not.toHaveBeenTriggeredOn(form);
  });
});
