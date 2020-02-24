/**
 * @fileoverview test wysiwyg paragraph command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import matched from 'tui-code-snippet/domUtil/matches';

import Paragraph from '@/wysiwygCommands/paragraph';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('Paragraph', () => {
  let container, wwe;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

    wwe.init();
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('set paragraph tag', () => {
    const range = wwe.getRange();

    wwe.getBody().innerHTML = '<h2><div>text</div></h2>';

    range.setStart(wwe.getBody().querySelectorAll('h2 div')[0], 0);
    range.setEnd(wwe.getBody().querySelectorAll('h2 div')[0], 1);
    wwe.getEditor().setSelection(range);

    Paragraph.exec(wwe);

    expect(matched(wwe.getBody().children[0], 'DIV')).toBe(true);
    expect(wwe.getBody().querySelectorAll('h2').length).toBe(0);
  });

  it('set paragraph tag', () => {
    const range = wwe.getRange();

    wwe.getBody().innerHTML = '<ul><li><div>text</div></li></ul>';

    range.setStart(wwe.getBody().querySelectorAll('li div')[0], 0);
    range.setEnd(wwe.getBody().querySelectorAll('li div')[0], 1);
    wwe.getEditor().setSelection(range);

    Paragraph.exec(wwe);

    expect(matched(wwe.getBody().children[0], 'DIV')).toBe(true);
    expect(wwe.getBody().querySelectorAll('ul').length).toBe(0);
    expect(wwe.getBody().querySelectorAll('li').length).toBe(0);
  });

  it('set paragraph tag', () => {
    const range = wwe.getRange();

    wwe.getBody().innerHTML =
      '<div>text</div><div>text</div><ul><li><div>listitem1</div></li><li><div>text2</div></li></ul>';

    range.setStart(wwe.getBody().querySelectorAll('div')[0], 0);
    range.setEnd(wwe.getBody().querySelectorAll('li div')[0], 1);
    wwe.getEditor().setSelection(range);

    Paragraph.exec(wwe);

    expect(wwe.getBody().children[2].textContent).toBe('listitem1');
    expect(wwe.getBody().querySelectorAll('div').length).toBe(4);
    expect(wwe.getBody().querySelectorAll('ul').length).toBe(1);
    expect(wwe.getBody().querySelectorAll('li').length).toBe(1);
  });

  it('set paragraph tag', () => {
    const range = wwe.getRange();

    wwe.getBody().innerHTML = [
      '<ul><li><div>listitem1</div></li>',
      '<li><div>listitem2</div></li></ul>',
      '<div>text</div>',
      '<div>text</div>'
    ].join('');

    range.setStart(wwe.getBody().querySelectorAll('li div')[1], 0);
    range.setEnd(wwe.getBody().querySelectorAll('div')[3], 1);
    wwe.getEditor().setSelection(range);

    Paragraph.exec(wwe);

    expect(matched(wwe.getBody().children[0], 'UL')).toBe(true);
    expect(matched(wwe.getBody().children[1], 'DIV')).toBe(true);
    expect(wwe.getBody().children[1].textContent).toBe('listitem2');
    expect(wwe.getBody().querySelectorAll('div').length).toBe(4);
    expect(wwe.getBody().querySelectorAll('ul').length).toBe(1);
    expect(wwe.getBody().querySelectorAll('li').length).toBe(1);
  });

  it('set paragraph tag', () => {
    const range = wwe.getRange();

    wwe.getBody().innerHTML = [
      '<table><tr><td>table</td></tr></table>',
      '<ul><li><div>listitem1</div></li>',
      '<li><div>listitem2</div></li></ul>',
      '<div>text</div>',
      '<div>text</div>'
    ].join('');

    range.setStart(wwe.getBody().querySelectorAll('table tr td')[0], 0);
    range.setEnd(wwe.getBody().querySelectorAll('div')[3], 1);
    wwe.getEditor().setSelection(range);

    Paragraph.exec(wwe);

    expect(matched(wwe.getBody().children[0], 'TABLE')).toBe(true);
    expect(matched(wwe.getBody().children[1], 'DIV')).toBe(true);
    expect(wwe.getBody().children[1].textContent).toBe('listitem1');
    expect(matched(wwe.getBody().children[2], 'DIV')).toBe(true);
    expect(wwe.getBody().children[2].textContent).toBe('listitem2');
    expect(wwe.getBody().querySelectorAll('table').length).toBe(1);
    expect(wwe.getBody().querySelectorAll('ul').length).toBe(0);
    expect(wwe.getBody().querySelectorAll('li').length).toBe(0);
  });
});
