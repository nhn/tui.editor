/**
 * @fileoverview test wysiwyg code command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Code from '@/wysiwygCommands/code';
import WysiwygEditor from '@/wysiwygEditor';
import WwTableSelectionManager from '@/wwTableSelectionManager';
import EventManager from '@/eventManager';

describe('Code', () => {
  let container, wwe;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

    wwe.init();

    wwe.componentManager.addManager(WwTableSelectionManager);
    wwe.getEditor().focus();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('add code', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('line');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Code.exec(wwe);

    expect(wwe.getValue()).toEqual('<code>line</code><br />');
  });

  it('collapse range after code added', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('line');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Code.exec(wwe);

    expect(wwe.getEditor().getSelection().collapsed).toBe(true);
  });

  it('if there have bold remove and add code', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<b>line</b>');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Code.exec(wwe);

    expect(wwe.getValue()).toEqual('<code>line</code><br />');
  });

  it('if there have italic remove and add code', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<i>line</i>');

    range.selectNodeContents(wwe.getBody().children[0]);
    wwe.getEditor().setSelection(range);

    Code.exec(wwe);

    expect(wwe.getValue()).toEqual('<code>line</code><br />');
  });

  it('if there have code already stop code tag', () => {
    const range = wwe
      .getEditor()
      .getSelection()
      .cloneRange();

    wwe.setValue('<code>line&#8203;</code>');

    range.setStart(wwe.getBody().querySelector('code').firstChild, 4);
    range.collapse(true);

    wwe.getEditor().setSelection(range);

    Code.exec(wwe);

    expect(wwe.getEditor().getSelection().startContainer.parentNode.tagName).toEqual('DIV');
  });
});
