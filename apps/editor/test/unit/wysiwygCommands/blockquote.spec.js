/**
 * @fileoverview test wysiwyg blockquote command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Blockquote from '@/wysiwygCommands/blockquote';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('Blockquote', () => {
  let wwe, container;

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

  it('add blockquote to current selection', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('text');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Blockquote.exec(wwe);

    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('<blockquote>text</blockquote>');
  });

  it('if there have blockquote already remove format', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('text');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Blockquote.exec(wwe);
    Blockquote.exec(wwe);

    expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('text');
  });
});
