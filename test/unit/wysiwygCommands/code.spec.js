/**
 * @fileoverview test wysiwyg code command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Code from '../../../src/js/wysiwygCommands/code';
import WysiwygEditor from '../../../src/js/wysiwygEditor';
import WwTableSelectionManager from '../../../src/js/wwTableSelectionManager';
import EventManager from '../../../src/js/eventManager';

describe('Code', () => {
  let wwe;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    wwe = new WysiwygEditor($container, new EventManager());

    wwe.init();

    wwe.componentManager.addManager(WwTableSelectionManager);
    wwe.getEditor().focus();
  });

  afterEach(() => {
    $('body').empty();
  });

  it('add code', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('line');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Code.exec(wwe);

    expect(wwe.getValue()).toEqual('<code>line</code><br />');
  });

  it('collapse range after code added', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('line');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Code.exec(wwe);

    expect(wwe.getEditor().getSelection().collapsed)
      .toBe(true);
  });

  it('if there have bold remove and add code', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<b>line</b>');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Code.exec(wwe);

    expect(wwe.getValue()).toEqual('<code>line</code><br />');
  });

  it('if there have italic remove and add code', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<i>line</i>');

    range.selectNodeContents(wwe.get$Body().children()[0]);
    wwe.getEditor().setSelection(range);

    Code.exec(wwe);

    expect(wwe.getValue()).toEqual('<code>line</code><br />');
  });

  it('if there have code already stop code tag', () => {
    const range = wwe.getEditor().getSelection().cloneRange();

    wwe.setValue('<code>line&#8203;</code>');

    range.setStart(wwe.get$Body().find('code')[0].firstChild, 4);
    range.collapse(true);

    wwe.getEditor().setSelection(range);

    Code.exec(wwe);

    expect(wwe.getEditor().getSelection().startContainer.parentNode.tagName).toEqual('DIV');
  });
});
