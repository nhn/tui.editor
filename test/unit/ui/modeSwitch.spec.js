/**
 * @fileoverview test ui mode switch
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import ModeSwitch from '../../../src/js/ui/modeSwitch';

describe('ModeSwitch', () => {
  let $container, modeSwitch;

  beforeEach(() => {
    $container = $('<div>');
    $('body').append($container);
  });

  afterEach(() => {
    modeSwitch.destroy();
    $container.empty();
  });

  it('editorTypeControl should be exist', () => {
    modeSwitch = new ModeSwitch($container);

    expect($('.te-mode-switch').length).toEqual(1);
  });

  describe('should apply button type on option', () => {
    it('markdown', () => {
      modeSwitch = new ModeSwitch($container, ModeSwitch.TYPE.MARKDOWN);

      expect($('button.te-switch-button.active').length).toEqual(1);
      expect($('button.te-switch-button.wysiwyg.active').length).toEqual(0);
      expect($('button.te-switch-button.markdown.active').length).toEqual(1);
      expect($('button.te-switch-button.markdown.active').text()).toEqual('Markdown');
    });
    it('wysiwyg', () => {
      modeSwitch = new ModeSwitch($container, ModeSwitch.TYPE.WYSIWYG);

      expect($('button.te-switch-button.active').length).toEqual(1);
      expect($('button.te-switch-button.markdown.active').length).toEqual(0);
      expect($('button.te-switch-button.wysiwyg.active').length).toEqual(1);
      expect($('button.te-switch-button.wysiwyg.active').text()).toEqual('WYSIWYG');
    });
  });

  it('should add `active` class on click button', () => {
    modeSwitch = new ModeSwitch($container);

    expect($('button.te-switch-button.wysiwyg').text()).toEqual('WYSIWYG');
    expect($('button.te-switch-button.markdown.active').text()).toEqual('Markdown');

    $('button').trigger('click');

    expect($('button.te-switch-button.wysiwyg.active').text()).toEqual('WYSIWYG');
    expect($('button.te-switch-button.markdown').text()).toEqual('Markdown');
  });

  describe('isShown', () => {
    it('should return is visible status', () => {
      modeSwitch = new ModeSwitch($container);
      expect(modeSwitch.isShown()).toBe(true);

      modeSwitch._$rootElement.css('display', 'none');
      expect(modeSwitch.isShown()).toBe(false);
    });
  });

  describe('show/hide', () => {
    it('should show/hide the base element', () => {
      modeSwitch = new ModeSwitch($container);

      modeSwitch.hide();
      expect(modeSwitch._$rootElement.css('display')).toBe('none');

      modeSwitch.show();
      expect(modeSwitch._$rootElement.css('display')).toBe('block');
    });
  });
});
