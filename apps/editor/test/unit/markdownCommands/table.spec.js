/**
 * @fileoverview test markdown table
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Table from '../../../src/js/markdownCommands/table';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

describe('Table', () => {
  let cm, doc, mde;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    mde = new MarkdownEditor($container, new EventManager());

    cm = mde.getEditor();

    doc = cm.getDoc();
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('Table', () => {
    it('Add table 2x2', () => {
      Table.exec(mde, 2, 2);

      expect(doc.getValue()).toEqual([
        '\n|  |  |',
        '| --- | --- |',
        '|  |  |'
      ].join('\n'));
    });

    it('Add table 4x3', () => {
      Table.exec(mde, 4, 3);

      expect(doc.getValue()).toEqual([
        '\n|  |  |  |  |',
        '| --- | --- | --- | --- |',
        '|  |  |  |  |',
        '|  |  |  |  |'
      ].join('\n'));
    });

    it('move cursor to first header after insert table', () => {
      Table.exec(mde, 2, 2);

      expect(doc.getValue()).toEqual([
        '\n|  |  |',
        '| --- | --- |',
        '|  |  |'
      ].join('\n'));

      expect(cm.getCursor().line).toEqual(1);
      expect(cm.getCursor().ch).toEqual(2);
    });

    it('add initial data', () => {
      Table.exec(mde, 2, 3, ['a', 'b', 'c', 'd', 'e', 'f']);

      expect(doc.getValue()).toEqual([
        '\n| a | b |',
        '| --- | --- |',
        '| c | d |',
        '| e | f |'
      ].join('\n'));
    });
  });
});
