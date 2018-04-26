/**
 * @fileoverview test preview
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Preview from '../../src/js/preview';
import EventManager from '../../src/js/eventManager';
import Convertor from '../../src/js/convertor';

describe('Preview', () => {
  let eventManager,
    convertor,
    $el,
    preview;

  beforeEach(() => {
    $el = $('<div>');
    $('body').append($el);
    eventManager = new EventManager();
    convertor = new Convertor(eventManager);
    preview = new Preview($el, eventManager, convertor, true);
  });

  afterEach(() => {
    $el.remove();
  });

  it('initialization make a preview element', () => {
    expect($el.find('.tui-editor-contents').length).toEqual(1);
  });

  it('setHeight() sets element height', () => {
    preview.setHeight(10);
    expect($el.css('height')).toEqual('10px');
  });

  it('isVisible() returns element visibility', () => {
    $el.css('display', 'none');
    expect(preview.isVisible()).toEqual(false);

    $el.css('display', 'block');
    expect(preview.isVisible()).toEqual(true);
  });

  describe('render()', () => {
    it('sets contents on preview element', () => {
      preview.render('<div>content</div>');
      expect(preview.getHTML()).toEqual('<div>content</div>');
    });

    it('calls previewBeforeHook and replace content with it returns', () => {
      eventManager.listen('previewBeforeHook', html => `to be ${html}d`);
      preview.render('replace');

      expect(preview.getHTML()).toEqual('to be replaced');
    });
  });

  it('refresh() takes markdown to render', () => {
    preview.refresh('*text*');
    expect(preview.getHTML()).toEqual('<p><em>text</em></p>\n');
  });
});
