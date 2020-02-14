/**
 * @fileoverview test preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Preview from '@/preview';
import EventManager from '@/eventManager';
import Convertor from '@/convertor';

describe('Preview', () => {
  let eventManager, convertor, el, preview;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);

    eventManager = new EventManager();
    convertor = new Convertor(eventManager);
    preview = new Preview(el, eventManager, convertor, true);
  });

  afterEach(() => {
    el.parentNode.removeChild(el);
  });

  it('initialization make a preview element', () => {
    expect(el.querySelectorAll('.tui-editor-contents').length).toEqual(1);
  });

  it('setHeight() sets element height', () => {
    preview.setHeight(10);
    expect(el.style.height).toEqual('10px');
  });

  it('isVisible() returns element visibility', () => {
    el.style.display = 'none';
    expect(preview.isVisible()).toEqual(false);

    el.style.display = 'block';
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
