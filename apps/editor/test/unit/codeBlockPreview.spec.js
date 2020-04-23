/**
 * @fileoverview test code block preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CodeBlockPreview from '@/codeBlockPreview';
import EventManager from '@/eventManager';
import Convertor from '@/convertor';
import CodeBlockEditor from '@/codeBlockEditor';

describe('Preview', () => {
  let eventManager, convertor, wrapper, editorWrapper, codeBlockEditor, preview;

  beforeEach(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);

    editorWrapper = document.createElement('div');
    document.body.appendChild(editorWrapper);

    eventManager = new EventManager();
    convertor = new Convertor(eventManager);
    codeBlockEditor = new CodeBlockEditor(editorWrapper, eventManager);
    preview = new CodeBlockPreview(wrapper, eventManager, convertor, codeBlockEditor);

    jasmine.clock().install();
  });

  afterEach(() => {
    wrapper.parentNode.removeChild(wrapper);
    editorWrapper.parentNode.removeChild(editorWrapper);
    jasmine.clock().uninstall();
  });

  it('clear() resets preview element', () => {
    preview.setHTML('to be cleard');
    preview.clear();
    expect(preview.getHTML()).toEqual('');
  });

  it('refresh() takes code and language from editor and convert them to html', () => {
    codeBlockEditor.setEditorCodeText('code text');
    codeBlockEditor.setLanguage('javascript');
    preview.refresh();

    const previewWrapper = document.createElement('div');

    document.body.appendChild(previewWrapper);
    previewWrapper.innerHTML = preview.getHTML();

    const preEl = previewWrapper.querySelector('pre');
    const codeEl = previewWrapper.querySelector('code');

    expect(preEl.className).toBe('lang-javascript');
    expect(codeEl.textContent).toBe('code text\n');
    expect(codeEl.getAttribute('data-language')).toBe('javascript');
  });

  it('delayed refresh on editor change event', () => {
    codeBlockEditor.setEditorCodeText('changed!');

    expect(preview.getHTML()).toEqual('');

    jasmine.clock().tick(500);

    expect(preview.getHTML()).toEqual('<pre><code>changed!\n</code></pre>\n');
  });
});
