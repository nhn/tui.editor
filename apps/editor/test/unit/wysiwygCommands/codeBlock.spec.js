/**
 * @fileoverview test wysiwyg code block command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import CodeBlock from '@/wysiwygCommands/codeBlock';
import WwCodeBlockManager from '@/wwCodeBlockManager';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('CodeBlock', () => {
  let container, wwe, sq, $body;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

    wwe.init();
    wwe.componentManager.addManager('codeblock', WwCodeBlockManager);

    sq = wwe.getEditor();
    $body = $(wwe.getBody());
    sq.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('add CodeBlock', () => {
    CodeBlock.exec(wwe);

    expect($body.find('pre').length).toBe(1);
    expect($body.find('pre').attr('data-te-codeblock')).toBeDefined();
  });
  it('add CodeBlock with language', () => {
    CodeBlock.exec(wwe, 'javascript');

    expect($body.find('pre').attr('data-language')).toBe('javascript');
  });
  it('add CodeBlock with selection', () => {
    wwe.setValue('<div>hello, my name is code</div>');

    const range = wwe.getEditor().getSelection();

    range.setStart(wwe.getBody().children[0].firstChild, 0);
    range.setEnd(wwe.getBody().children[0].firstChild, 5);

    sq.setSelection(range);

    CodeBlock.exec(wwe);

    expect($body.find('pre').length).toBe(1);
    expect(
      $body
        .find('pre')
        .eq(0)
        .text()
    ).toBe('hello');
    expect(
      $body
        .find('pre + div')
        .eq(0)
        .text()
    ).toBe(', my name is code');
  });
});
