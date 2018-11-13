/**
 * @fileoverview test wysiwyg blockquote command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Blockquote from '../../../src/js/wysiwygCommands/blockquote';
import WysiwygEditor from '../../../src/js/wysiwygEditor';
import EventManager from '../../../src/js/eventManager';

describe('Blockquote', () => {
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

  it('add blockquote to current selection', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('text');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Blockquote.exec(wwe);

    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<blockquote>text</blockquote>');
  });

  it('if there have blockquote already remove format', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('text');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Blockquote.exec(wwe);
    Blockquote.exec(wwe);

    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('text');
  });
});
