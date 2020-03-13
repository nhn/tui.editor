/**
 * @fileoverview test markdown preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { MarkdownDocument } from '@toast-ui/markdown-parser';
import MarkdownPreview from '@/mdPreview';
import EventManager from '@/eventManager';
import Convertor from '@/convertor';

describe('Preview', () => {
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

  it('listen to contentChangedFromMarkdown and update', () => {
    const doc = new MarkdownDocument();
    const editResult = doc.editMarkdown([1, 7], [1, 7], 'changed');

    eventManager.emit('contentChangedFromMarkdown', editResult);

    expect(preview.getHTML()).toEqual(`<p data-nodeid="${editResult.nodes[0].id}">changed</p>\n`);
  });
});
