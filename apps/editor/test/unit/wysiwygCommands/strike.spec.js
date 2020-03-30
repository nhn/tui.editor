/**
 * @fileoverview test wysiwyg strike command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Strike from '@/wysiwygCommands/strike';
import WysiwygEditor from '@/wysiwygEditor';
import WwTableSelectionManager from '@/wwTableSelectionManager';
import EventManager from '@/eventManager';

describe('Strike', () => {
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

  it('add Strike to current selection', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('line1<br />line2');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Strike.exec(wwe);

    expect(wwe.getValue()).toEqual('<s>line1</s><br />line2<br />');
  });

  it('dont add Strike in PRE tag', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<pre>line1</pre>');

    range.selectNodeContents(wwe.getBody().querySelectorAll('pre')[0]);
    wwe.getEditor().setSelection(range);

    Strike.exec(wwe);

    expect(wwe.getValue()).toEqual('<pre>line1</pre><br />');
  });

  it('if there have Strike already remove format', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('line1<br />line2');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Strike.exec(wwe);
    Strike.exec(wwe);

    expect(wwe.getValue()).toEqual('line1<br />line2<br />');
  });

  it('if there have Strike already remove format in colappsed selection', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<s>line</s>');

    range.setStart(wwe.getBody().querySelectorAll('s')[0].firstChild, 4);
    range.collapse(true);
    wwe.getEditor().setSelection(range);

    Strike.exec(wwe);
    wwe.getEditor().insertPlainText('a');

    expect(wwe.getValue()).toEqual('<s>line</s>a<br />');
  });

  it('if there have italic apply Strike into italic', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<i>line</i>');

    range.selectNodeContents(wwe.getBody().children[0].firstChild);
    wwe.getEditor().setSelection(range);

    Strike.exec(wwe);

    expect(wwe.getValue()).toEqual('<i><s>line</s></i><br />');
  });

  it('if there have italic apply Strike into bold', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<b>line</b>');

    range.selectNodeContents(wwe.getBody().children[0].firstChild);
    wwe.getEditor().setSelection(range);

    Strike.exec(wwe);

    expect(wwe.getValue()).toEqual('<b><s>line</s></b><br />');
  });

  it('if there have italic apply Strike into bold and italic', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<b><i>line</i></b>');

    range.selectNodeContents(wwe.getBody().children[0].firstChild);
    wwe.getEditor().setSelection(range);

    Strike.exec(wwe);

    expect(wwe.getValue()).toEqual('<b><i><s>line</s></i></b><br />');
  });

  it('if there have code remove and add Strike', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<code>line</code>');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Strike.exec(wwe);

    expect(wwe.getValue()).toEqual('<s>line</s><br />');
  });

  it('when some of the text is selected, the strike already applied should be removed', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<s>foo b</s>ar');

    range.selectNodeContents(wwe.getBody().children[0].firstChild);
    wwe.getEditor().setSelection(range);

    Strike.exec(wwe);

    expect(wwe.getValue()).toEqual('foo bar<br />');
  });
});
