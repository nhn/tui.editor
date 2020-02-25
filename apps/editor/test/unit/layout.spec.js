/**
 * @fileoverview test layout
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import Layout from '@/layout';
import EventManager from '@/eventManager';

describe('Layout', () => {
  let layout, em;

  beforeEach(() => {
    em = new EventManager();

    layout = new Layout(
      {
        el: $('body').get(0),
        height: 100
      },
      em
    );
  });

  afterEach(() => {
    $('body').empty();
  });

  it('All layout elements are exist', () => {
    expect($('.tui-editor').length).toEqual(1);
    expect($('.te-md-container').length).toEqual(1);
    expect($('.te-md-container .te-editor').length).toEqual(1);
    expect($('.te-md-container .te-preview').length).toEqual(1);
    expect($('.te-ww-container').length).toEqual(1);
    expect($('.te-ww-container .te-editor').length).toEqual(1);
  });

  describe('Markdown editor/preview layout switch', () => {
    it('vertical', () => {
      layout.changePreviewStyle('vertical');

      expect($('.te-md-container').hasClass('te-preview-style-vertical')).toBe(true);
      expect($('.te-md-container').hasClass('te-preview-style-tab')).toBe(false);
    });

    it('tab', () => {
      layout.changePreviewStyle('tab');

      expect($('.te-md-container').hasClass('te-preview-style-tab')).toBe(true);
      expect($('.te-md-container').hasClass('te-preview-style-vertical')).toBe(false);
    });
  });

  describe('Markdown and WYSIWYG type switching by eventManager', () => {
    it('to Markdown', () => {
      layout.switchToMarkdown();

      expect($('.tui-editor').hasClass('te-md-mode')).toEqual(true);
      expect($('.tui-editor').hasClass('te-ww-mode')).toEqual(false);
    });

    it('to WYSIWYG', () => {
      layout.switchToWYSIWYG();

      expect($('.tui-editor').hasClass('te-md-mode')).toEqual(false);
      expect($('.tui-editor').hasClass('te-ww-mode')).toEqual(true);
    });
  });

  describe('show/hide', () => {
    it('te-hide and show editor', () => {
      layout.hide();
      expect($('.tui-editor').hasClass('te-hide')).toEqual(true);
      layout.show();
      expect($('.tui-editor').hasClass('te-hide')).toEqual(false);
    });
  });
});
