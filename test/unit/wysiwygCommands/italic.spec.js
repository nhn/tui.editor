/**
 * @fileoverview test wysiwyg italic command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Italic from '../../../src/js/wysiwygCommands/italic';
import WysiwygEditor from '../../../src/js/wysiwygEditor';
import WwTableSelectionManager from '../../../src/js/wwTableSelectionManager';
import EventManager from '../../../src/js/eventManager';

describe('Italic', () => {
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

  it('add italic to current selection', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('line1<br />line2');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);

    expect(wwe.getValue()).toEqual('<i>line1</i><br />line2<br />');
  });

  it('dont add italic in Achor tag', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<a href="#">line1</a>');

    range.selectNodeContents(wwe.get$Body().find('a')[0]);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);

    expect(wwe.getValue()).toEqual('<a href="#">line1</a><br />');
  });

  it('if there have italic already remove format', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('line1<br />line2');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);
    Italic.exec(wwe);

    expect(wwe.getValue()).toEqual('line1<br />line2<br />');
  });

  it('if there have italic already remove format in colappsed selection', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<i>line</i>');

    range.setStart(wwe.get$Body().find('i')[0].firstChild, 4);
    range.collapse(true);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);
    wwe.getEditor().insertPlainText('a');

    expect(wwe.getValue()).toEqual('<i>line</i>a<br />');
  });

  it('if there have bold apply italic into bold', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<b>line</b>');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);

    expect(wwe.getValue()).toEqual('<b><i>line</i></b><br />');
  });

  it('if there have code remove and add italic', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<code>line</code>');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Italic.exec(wwe);

    expect(wwe.getValue()).toEqual('<i>line</i><br />');
  });
});
