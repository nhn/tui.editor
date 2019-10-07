/**
 * @fileoverview test code block preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import CodeBlockPreview from '@/codeBlockPreview';
import EventManager from '@/eventManager';
import Convertor from '@/convertor';
import CodeBlockEditor from '@/codeBlockEditor';

describe('Preview', () => {
  let eventManager,
    convertor,
    $wrapper,
    $editorWrapper,
    codeBlockEditor,
    preview;

  beforeEach(() => {
    $editorWrapper = $('<div>');
    $wrapper = $('<div>');
    $('body').append($wrapper);
    $('body').append($editorWrapper);

    eventManager = new EventManager();
    convertor = new Convertor(eventManager);
    codeBlockEditor = new CodeBlockEditor($editorWrapper.get(0));
    preview = new CodeBlockPreview($wrapper, eventManager, convertor, codeBlockEditor);

    jasmine.clock().install();
  });

  afterEach(() => {
    $wrapper.remove();
    $editorWrapper.remove();
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

    const $el = $(preview.getHTML()).find('code');
    expect($el.text()).toEqual('code text\n');
    expect($el.attr('data-language')).toEqual('javascript');
    expect($el.hasClass('lang-javascript')).toEqual(true);
    // expect(preview.getHTML()).toEqual('<pre><code data-language="javascript" class="lang-javascript">code\n</code></pre>\n');
  });

  it('delayed refresh on editor change event', () => {
    codeBlockEditor.setEditorCodeText('changed!');

    expect(preview.getHTML()).toEqual('');

    jasmine.clock().tick(800);

    expect(preview.getHTML()).toEqual('<pre><code>changed!\n</code></pre>\n');
  });
});
