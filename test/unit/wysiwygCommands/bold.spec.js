/**
 * @fileoverview test wysiwyg bold command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Bold from '../../../src/js/wysiwygCommands/bold';
import WwTableSelectionManager from '../../../src/js/wwTableSelectionManager';
import WysiwygEditor from '../../../src/js/wysiwygEditor';
import EventManager from '../../../src/js/eventManager';

describe('Bold', () => {
  let wwe;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    wwe = new WysiwygEditor($container, new EventManager());

    wwe.init();

    wwe.componentManager.addManager(WwTableSelectionManager);
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  it('add bold to current selection', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('line1<br />line2');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);

    expect(wwe.getValue()).toEqual('<b>line1</b><br />line2<br />');
  });

  it('dont add bold in Achor tag', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<a href="#">line1</a>');

    range.selectNodeContents(wwe.get$Body().find('a')[0]);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);

    expect(wwe.getValue()).toEqual('<a href="#">line1</a><br />');
  });

  it('if there have bold already remove format', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('line1<br />line2');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);
    Bold.exec(wwe);

    expect(wwe.getValue()).toEqual('line1<br />line2<br />');
  });

  it('if there have bold already remove format in colappsed selection', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<b>line</b>');

    range.setStart(wwe.get$Body().find('b')[0].firstChild, 4);
    range.collapse(true);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);
    wwe.getEditor().insertPlainText('a');

    expect(wwe.getValue()).toEqual('<b>line</b>a<br />');
  });

  it('if there have italic apply bold into italic', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<i>line</i>');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);

    expect(wwe.getValue()).toEqual('<i><b>line</b></i><br />');
  });

  it('if there have code remove and add bold', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<code>line</code>');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Bold.exec(wwe);

    expect(wwe.getValue()).toEqual('<b>line</b><br />');
  });
});
