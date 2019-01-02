/**
 * @fileoverview test markdown code
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Code from '../../../src/js/markdownCommands/code';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('Code', () => {
  let cm, doc, mde, $container;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    mde = new MarkdownEditor($container, new EventManager());

    cm = mde.getEditor();

    const sourceText = ['mytext1', '', 'mytext2', 'mytext3'];

    cm.setValue(sourceText.join('\n'));
    doc = cm.getDoc();
  });

  afterEach(() => {
    $container.remove();
  });

  it('Add code', () => {
    doc.setCursor(1, 0);

    Code.exec(mde);

    expect(cm.getValue()).toEqual(['mytext1', '``', 'mytext2', 'mytext3'].join('\n'));
    expect(cm.getCursor().ch).toEqual(1);
  });

  it('Add code for selection', () => {
    doc.setSelection({
      line: 0,
      ch: 0
    }, {
      line: 0,
      ch: 7
    });

    Code.exec(mde);

    expect(cm.getValue()).toEqual(['`mytext1`', '', 'mytext2', 'mytext3'].join('\n'));
    expect(cm.getCursor().ch).toEqual(9);
  });

  it('should remove code for selection', () => {
    cm.setValue('`mytext1`');

    doc.setSelection({
      line: 0,
      ch: 0
    }, {
      line: 0,
      ch: 9
    });

    Code.exec(mde);

    expect(cm.getValue()).toEqual('mytext1');
  });

  it('should remove code syntax in the middle of the given range', () => {
    cm.setValue('my`text`1');

    doc.setSelection({
      line: 0,
      ch: 0
    }, {
      line: 0,
      ch: 9
    });

    Code.exec(mde);

    expect(cm.getValue()).toEqual('`mytext1`');
  });
});
