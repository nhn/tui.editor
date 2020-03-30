/**
 * @fileoverview test wysiwyg bold command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

import Bold from '@/wysiwygCommands/bold';
import WwTableSelectionManager from '@/wwTableSelectionManager';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';

describe('Bold', () => {
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

  it('add bold to current selection', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('line1<br />line2');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);

    expect(wwe.getValue()).toEqual('<b>line1</b><br />line2<br />');
  });

  it('if there have bold already remove format', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('line1<br />line2');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);
    Bold.exec(wwe);

    expect(wwe.getValue()).toEqual('line1<br />line2<br />');
  });

  it('if there have bold already remove format in colappsed selection', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<b>line</b>');

    range.setStart(wwe.getBody().querySelectorAll('b')[0].firstChild, 4);
    range.collapse(true);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);
    wwe.getEditor().insertPlainText('a');

    expect(wwe.getValue()).toEqual('<b>line</b>a<br />');
  });

  it('if there have italic apply bold into italic', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<i>line</i>');

    range.selectNodeContents(wwe.getBody().children[0].firstChild);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);

    expect(wwe.getValue()).toEqual('<i><b>line</b></i><br />');
  });

  it('if there have code remove and add bold', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<code>line</code>');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);

    expect(wwe.getValue()).toEqual('<b>line</b><br />');
  });

  it('when some of the text is selected, the bold already applied should be removed', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<b>foo b</b>ar');

    range.selectNodeContents(wwe.getBody().children[0].firstChild);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);

    expect(wwe.getValue()).toEqual('foo bar<br />');
  });
});
