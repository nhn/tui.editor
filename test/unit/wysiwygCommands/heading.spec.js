/**
 * @fileoverview test wysiwyg heading command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import Heading from '@/wysiwygCommands/heading';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('Heading', () => {
  let wwe;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    wwe = new WysiwygEditor($container, new EventManager());

    wwe.init();
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  it('add heading to current selection or cursor', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('text');

    range.selectNodeContents(wwe.get$Body()[0].childNodes[0]);
    range.collapse(true);

    wwe.getEditor().setSelection(range);

    Heading.exec(wwe, 1);

    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h1>text</h1>');
  });

  it('set heading tag 1~6 rotation', () => {
    const range = wwe.getRange();

    wwe.get$Body().html('<div>text</div><div>text2</div>');

    range.setStart(wwe.get$Body().children('div')[0], 0);
    range.setEnd(wwe.get$Body().children('div')[1], 1);
    wwe.getEditor().setSelection(range);

    Heading.exec(wwe, 1);
    expect(wwe.get$Body().find('h1').length).toBe(2);
  });

  it('set heading tag', () => {
    const range = wwe.getRange();

    wwe.get$Body().html('<h2><div>text</div></h2><h2><div>text2</div></h2>');

    range.setStart(wwe.get$Body().find('h2 div')[0], 0);
    range.setEnd(wwe.get$Body().find('h2 div')[1], 1);
    wwe.getEditor().setSelection(range);

    Heading.exec(wwe, 1);
    expect(wwe.get$Body().find('h1').length).toBe(2);
    expect(wwe.get$Body().find('h2').length).toBe(0);
  });

  it('set heading tag 1~6 rotation', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('text');

    range.selectNodeContents(wwe.get$Body()[0].childNodes[0]);
    range.collapse(true);
    wwe.getEditor().setSelection(range);

    Heading.exec(wwe, 1);
    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h1>text</h1>');

    Heading.exec(wwe, 2);
    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h2>text</h2>');

    Heading.exec(wwe, 3);
    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h3>text</h3>');

    Heading.exec(wwe, 4);
    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h4>text</h4>');

    Heading.exec(wwe, 5);
    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h5>text</h5>');

    Heading.exec(wwe, 6);
    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<h6>text</h6>');
  });

  it('pass converting on list element', () => {
    const range = wwe.getRange();

    wwe.get$Body().html([
      '<h2><div>text</div></h2>',
      '<ul><li><div>hi</div></li></ul>',
      '<h2><div>text2</div></h2>'
    ].join(''));

    range.setStart(wwe.get$Body().find('h2 div')[0], 0);
    range.setEnd(wwe.get$Body().find('h2 div')[1], 1);
    wwe.getEditor().setSelection(range);

    Heading.exec(wwe, 1);
    expect(wwe.get$Body().find('h1').length).toBe(2);
    expect(wwe.get$Body().find('h2').length).toBe(0);
    expect(wwe.get$Body().find('ul').length).toBe(1);
  });
});
