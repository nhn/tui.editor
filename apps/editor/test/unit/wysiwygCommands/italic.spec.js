/**
 * @fileoverview test wysiwyg italic command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Italic from '@/wysiwygCommands/italic';
import WysiwygEditor from '@/wysiwygEditor';
import WwTableSelectionManager from '@/wwTableSelectionManager';
import EventManager from '@/eventManager';

describe('Italic', () => {
  let container, wwe;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

    wwe.init();

    wwe.componentManager.addManager(WwTableSelectionManager);
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('add italic to current selection', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('line1<br />line2');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);

    expect(wwe.getValue()).toEqual('<i>line1</i><br />line2<br />');
  });

  it('if there have italic already remove format', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('line1<br />line2');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);
    Italic.exec(wwe);

    expect(wwe.getValue()).toEqual('line1<br />line2<br />');
  });

  it('if there have italic already remove format in colappsed selection', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<i>line</i>');

    range.setStart(wwe.getBody().querySelectorAll('i')[0].firstChild, 4);
    range.collapse(true);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);
    wwe.getEditor().insertPlainText('a');

    expect(wwe.getValue()).toEqual('<i>line</i>a<br />');
  });

  it('if there have bold apply italic into bold', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<b>line</b>');

    range.selectNodeContents(wwe.getBody().children[0].firstChild);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);

    expect(wwe.getValue()).toEqual('<b><i>line</i></b><br />');
  });

  it('if there have code remove and add italic', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<code>line</code>');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);

    expect(wwe.getValue()).toEqual('<i>line</i><br />');
  });

  it('when some of the text is selected, the italic already applied should be removed', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<i>foo b</i>ar');

    range.selectNodeContents(wwe.getBody().children[0].firstChild);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);

    expect(wwe.getValue()).toEqual('foo bar<br />');
  });
});
