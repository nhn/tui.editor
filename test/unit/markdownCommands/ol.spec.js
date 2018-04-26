/**
 * @fileoverview test markdown ol
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import OL from '../../../src/js/markdownCommands/ol';
import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';
import mdListManager from '../../../src/js/mdListManager';

describe('OL', () => {
  let cm, doc, mde;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    mde = new MarkdownEditor($container, new EventManager());

    mde.componentManager.addManager(mdListManager);

    cm = mde.getEditor();

    const sourceText = ['mytext1', '', 'mytext2', 'mytext3', '* mytext4', '# myheading'];

    cm.setValue(sourceText.join('\n'));
    doc = cm.getDoc();
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('add ol', () => {
    it('to a line with text on it', () => {
      doc.setCursor(0, 0);

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
    });
    it('Add ol markdown text to line start', () => {
      doc.setCursor(0, 4);

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
    });
    it('replace  ol markdown text if line have ul', () => {
      doc.setCursor(4, 4);

      OL.exec(mde);

      expect(doc.getLine(5)).toEqual('1. mytext4');
    });
    it('Don\'t add already have ol markdown text in line start', () => {
      doc.setCursor(0, 4);

      OL.exec(mde);
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
    });
    it('to a blank line', () => {
      doc.setCursor(1, 0);

      OL.exec(mde);

      expect(doc.getLine(2)).toEqual('1. ');
    });

    it('around selected area', () => {
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 2,
        ch: 7
      });

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
      expect(doc.getLine(1)).toEqual('2. ');
      expect(doc.getLine(2)).toEqual('3. mytext2');
      expect(doc.getLine(3)).toEqual('');
      expect(doc.getLine(4)).toEqual('mytext3');
    });
    it('Don\'t add ol markdown text in heading', () => {
      doc.setCursor(5, 1);

      OL.exec(mde);

      expect(doc.getLine(5)).toEqual('# myheading');
    });
    it('add ol markdown text except heading', () => {
      const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '# myheading'];

      cm.setValue(sourceText.join('\n'));
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 4,
        ch: 7
      });

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
      expect(doc.getLine(1)).toEqual('2. mytext2');
      expect(doc.getLine(2)).toEqual('3. mytext3');
      expect(doc.getLine(3)).toEqual('4. mytext4');
      expect(doc.getLine(4)).toEqual('# myheading');
    });
    it('add ol markdown text except blockquote', () => {
      const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '> myheading'];

      cm.setValue(sourceText.join('\n'));
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 4,
        ch: 7
      });

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
      expect(doc.getLine(1)).toEqual('2. mytext2');
      expect(doc.getLine(2)).toEqual('3. mytext3');
      expect(doc.getLine(3)).toEqual('4. mytext4');
      expect(doc.getLine(4)).toEqual('> myheading');
    });
    it('add ol markdown text except blockquote', () => {
      const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '```', 'var a = 10;', '```'];

      cm.setValue(sourceText.join('\n'));
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 4,
        ch: 7
      });

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
      expect(doc.getLine(1)).toEqual('2. mytext2');
      expect(doc.getLine(2)).toEqual('3. mytext3');
      expect(doc.getLine(3)).toEqual('4. mytext4');
      expect(doc.getLine(4)).toEqual('```');
    });
    it('add ol markdown text except table', () => {
      const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '| hi | hello |', '| --- | --- |', '| bye | bye |'];

      cm.setValue(sourceText.join('\n'));
      doc.setSelection({
        line: 0,
        ch: 0
      }, {
        line: 4,
        ch: 7
      });

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
      expect(doc.getLine(1)).toEqual('2. mytext2');
      expect(doc.getLine(2)).toEqual('3. mytext3');
      expect(doc.getLine(3)).toEqual('4. mytext4');
      expect(doc.getLine(4)).toEqual('| hi | hello |');
    });
    it('do not add blank at start & end of ol when already blank line exists', () => {
      const sourceText = ['', 'mytext2', '', 'mytext4', '# myheading'];

      cm.setValue(sourceText.join('\n'));
      doc.setCursor(1, 1);
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('');
      expect(doc.getLine(1)).toEqual('1. mytext2');
      expect(doc.getLine(2)).toEqual('');
      expect(doc.getLine(3)).toEqual('mytext4');
      expect(doc.getLine(4)).toEqual('# myheading');
    });
    it('add blank at start & end of ol when blank line not exists', () => {
      const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '# myheading'];

      cm.setValue(sourceText.join('\n'));
      doc.setCursor(1, 1);
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('mytext1');
      expect(doc.getLine(1)).toEqual('');
      expect(doc.getLine(2)).toEqual('1. mytext2');
      expect(doc.getLine(3)).toEqual('');
      expect(doc.getLine(4)).toEqual('mytext3');
      expect(doc.getLine(5)).toEqual('mytext4');
      expect(doc.getLine(6)).toEqual('# myheading');
    });
    it('add blank at start & end of ol when blank line not exists with selection', () => {
      const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '# myheading'];

      cm.setValue(sourceText.join('\n'));
      doc.setSelection({
        line: 1,
        ch: 0
      }, {
        line: 2,
        ch: 4
      });
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('mytext1');
      expect(doc.getLine(1)).toEqual('');
      expect(doc.getLine(2)).toEqual('1. mytext2');
      expect(doc.getLine(3)).toEqual('2. mytext3');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('mytext4');
      expect(doc.getLine(6)).toEqual('# myheading');
    });
    it('do not add blank at start & end of ol when already blank line exists with selection', () => {
      const sourceText = ['mytext1', '', '* mytext2', '* mytext3', '', 'mytext4', '# myheading'];

      cm.setValue(sourceText.join('\n'));
      doc.setSelection({
        line: 2,
        ch: 0
      }, {
        line: 3,
        ch: 4
      });
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('mytext1');
      expect(doc.getLine(1)).toEqual('');
      expect(doc.getLine(2)).toEqual('1. mytext2');
      expect(doc.getLine(3)).toEqual('2. mytext3');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('mytext4');
      expect(doc.getLine(6)).toEqual('# myheading');
    });
  });
});
