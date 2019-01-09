/**
 * @fileoverview test wysiwyg code block command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import CodeBlock from '../../../src/js/wysiwygCommands/codeBlock';
import WwCodeBlockManager from '../../../src/js/wwCodeBlockManager';
import WysiwygEditor from '../../../src/js/wysiwygEditor';
import EventManager from '../../../src/js/eventManager';

describe('CodeBlock', () => {
  let wwe, sq, $body;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    wwe = new WysiwygEditor($container, new EventManager());

    wwe.init();
    wwe.componentManager.addManager('codeblock', WwCodeBlockManager);

    sq = wwe.getEditor();
    $body = wwe.get$Body();
    sq.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
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
    range.setStart(wwe.get$Body().children().eq(0)[0].firstChild, 0);
    range.setEnd(wwe.get$Body().children().eq(0)[0].firstChild, 5);

    sq.setSelection(range);

    CodeBlock.exec(wwe);

    expect($body.find('pre').length).toBe(1);
    expect($body.find('pre').eq(0).text()).toBe('hello');
    expect($body.find('pre + div').eq(0).text()).toBe(', my name is code');
  });
});
