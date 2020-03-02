/**
 * @fileoverview test markdown preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import MarkdownPreview from '@/mdPreview';
import EventManager from '@/eventManager';
import Convertor from '@/convertor';

xdescribe('Preview', () => {
  let eventManager, convertor, wrapper, preview;

  beforeEach(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);

    eventManager = new EventManager();
    convertor = new Convertor(eventManager);
    preview = new MarkdownPreview(wrapper, eventManager, convertor, true);

    jasmine.clock().install();
  });

  afterEach(() => {
    wrapper.parentNode.removeChild(wrapper);
    jasmine.clock().uninstall();
  });

  it('render() emits previewRenderAfter', () => {
    const listener = jasmine.createSpy('listener');

    eventManager.listen('previewRenderAfter', listener);

    preview.render();

    expect(listener).toHaveBeenCalled();
  });

  it('listen to previewNeedsRefresh and fresh', () => {
    eventManager.emit('previewNeedsRefresh', 'content');

    expect(preview.getHTML()).toEqual('<p>content</p>\n');
  });

  it('listen to contentChangedFromMarkdown and delayed refresh', () => {
    eventManager.emit('contentChangedFromMarkdown', {
      getValue: () => 'changed'
    });

    expect(preview.getHTML()).toEqual('');

    jasmine.clock().tick(800);

    expect(preview.getHTML()).toEqual('<p>changed</p>\n');
  });
});
