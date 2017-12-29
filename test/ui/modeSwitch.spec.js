/**
 * @fileoverview test ui mode switch
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import ModeSwitch from '../../src/js/ui/modeSwitch';

describe('ModeSwitch', () => {
  afterEach(() => {
    $('body').empty();
  });

  it('editorTypeControl should be exist', () => {
    const modeSwitch = new ModeSwitch();
    $('body').append(modeSwitch.$el);

    expect($('.te-mode-switch').length).toEqual(1);
  });

  describe('should apply button type on option', () => {
    it('markdown', () => {
      const modeSwitch = new ModeSwitch(ModeSwitch.TYPE.MARKDOWN);
      $('body').append(modeSwitch.$el);

      expect($('button.te-switch-button.active').length).toEqual(1);
      expect($('button.te-switch-button.wysiwyg.active').length).toEqual(0);
      expect($('button.te-switch-button.markdown.active').length).toEqual(1);
      expect($('button.te-switch-button.markdown.active').text()).toEqual('Markdown');
    });
    it('wysiwyg', () => {
      const modeSwitch = new ModeSwitch(ModeSwitch.TYPE.WYSIWYG);
      $('body').append(modeSwitch.$el);

      expect($('button.te-switch-button.active').length).toEqual(1);
      expect($('button.te-switch-button.markdown.active').length).toEqual(0);
      expect($('button.te-switch-button.wysiwyg.active').length).toEqual(1);
      expect($('button.te-switch-button.wysiwyg.active').text()).toEqual('WYSIWYG');
    });
  });

  it('should add `active` class on click button', () => {
    const modeSwitch = new ModeSwitch();

    $('body').append(modeSwitch.$el);

    expect($('button.te-switch-button.wysiwyg').text()).toEqual('WYSIWYG');
    expect($('button.te-switch-button.markdown.active').text()).toEqual('Markdown');

    $('button').trigger('click');

    expect($('button.te-switch-button.wysiwyg.active').text()).toEqual('WYSIWYG');
    expect($('button.te-switch-button.markdown').text()).toEqual('Markdown');
  });
});
