/**
 * @fileoverview test wysiwyg paragraph command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import Paragraph from '@/wysiwygCommands/paragraph';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('Paragraph', () => {
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

  it('set paragraph tag', () => {
    const range = wwe.getRange();

    wwe.get$Body().html('<h2><div>text</div></h2>');

    range.setStart(wwe.get$Body().find('h2 div')[0], 0);
    range.setEnd(wwe.get$Body().find('h2 div')[0], 1);
    wwe.getEditor().setSelection(range);

    Paragraph.exec(wwe);

    expect(wwe.get$Body().children().first().is('DIV')).toBe(true);
    expect(wwe.get$Body().find('h2').length).toBe(0);
  });

  it('set paragraph tag', () => {
    const range = wwe.getRange();

    wwe.get$Body().html('<ul><li><div>text</div></li></ul>');

    range.setStart(wwe.get$Body().find('li div')[0], 0);
    range.setEnd(wwe.get$Body().find('li div')[0], 1);
    wwe.getEditor().setSelection(range);

    Paragraph.exec(wwe);

    expect(wwe.get$Body().children().first().is('DIV')).toBe(true);
    expect(wwe.get$Body().find('ul').length).toBe(0);
    expect(wwe.get$Body().find('li').length).toBe(0);
  });

  it('set paragraph tag', () => {
    const range = wwe.getRange();

    wwe.get$Body().html('<div>text</div><div>text</div><ul><li><div>listitem1</div></li><li><div>text2</div></li></ul>');

    range.setStart(wwe.get$Body().find('div')[0], 0);
    range.setEnd(wwe.get$Body().find('li div')[0], 1);
    wwe.getEditor().setSelection(range);

    Paragraph.exec(wwe);

    expect(wwe.get$Body().children().eq(2).text()).toBe('listitem1');
    expect(wwe.get$Body().find('div').length).toBe(4);
    expect(wwe.get$Body().find('ul').length).toBe(1);
    expect(wwe.get$Body().find('li').length).toBe(1);
  });

  it('set paragraph tag', () => {
    const range = wwe.getRange();

    wwe.get$Body().html([
      '<ul><li><div>listitem1</div></li>',
      '<li><div>listitem2</div></li></ul>',
      '<div>text</div>',
      '<div>text</div>'
    ].join(''));

    range.setStart(wwe.get$Body().find('li div')[1], 0);
    range.setEnd(wwe.get$Body().find('div')[3], 1);
    wwe.getEditor().setSelection(range);

    Paragraph.exec(wwe);

    expect(wwe.get$Body().children().eq(0).is('UL')).toBe(true);
    expect(wwe.get$Body().children().eq(1).is('DIV')).toBe(true);
    expect(wwe.get$Body().children().eq(1).text()).toBe('listitem2');
    expect(wwe.get$Body().find('div').length).toBe(4);
    expect(wwe.get$Body().find('ul').length).toBe(1);
    expect(wwe.get$Body().find('li').length).toBe(1);
  });

  it('set paragraph tag', () => {
    const range = wwe.getRange();

    wwe.get$Body().html([
      '<table><tr><td>table</td></tr></table>',
      '<ul><li><div>listitem1</div></li>',
      '<li><div>listitem2</div></li></ul>',
      '<div>text</div>',
      '<div>text</div>'
    ].join(''));

    range.setStart(wwe.get$Body().find('table tr td')[0], 0);
    range.setEnd(wwe.get$Body().find('div')[3], 1);
    wwe.getEditor().setSelection(range);

    Paragraph.exec(wwe);

    expect(wwe.get$Body().children().eq(0).is('TABLE')).toBe(true);
    expect(wwe.get$Body().children().eq(1).is('DIV')).toBe(true);
    expect(wwe.get$Body().children().eq(1).text()).toBe('listitem1');
    expect(wwe.get$Body().children().eq(2).is('DIV')).toBe(true);
    expect(wwe.get$Body().children().eq(2).text()).toBe('listitem2');
    expect(wwe.get$Body().find('table').length).toBe(1);
    expect(wwe.get$Body().find('ul').length).toBe(0);
    expect(wwe.get$Body().find('li').length).toBe(0);
  });
});
