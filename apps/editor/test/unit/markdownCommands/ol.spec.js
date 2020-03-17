/**
 * @fileoverview test markdown ol
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import OL from '@/markdownCommands/ol';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';
import mdListManager from '@/mdListManager';

describe('OL', () => {
  let cm, doc, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());

    mde.componentManager.addManager(mdListManager);

    cm = mde.getEditor();

    const sourceText = ['mytext1', '', 'mytext2', 'mytext3', '* mytext4', '# myheading'];

    cm.setValue(sourceText.join('\n'));
    doc = cm.getDoc();
  });

  afterEach(() => {
    document.body.removeChild(container);
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

      expect(doc.getLine(4)).toEqual('1. mytext4');
    });
    it("Don't add already have ol markdown text in line start", () => {
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
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 2,
          ch: 7
        }
      );

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
      expect(doc.getLine(1)).toEqual('2. ');
      expect(doc.getLine(2)).toEqual('3. mytext2');
      expect(doc.getLine(3)).toEqual('');
      expect(doc.getLine(4)).toEqual('mytext3');
    });
    it("Don't add ol markdown text in heading", () => {
      doc.setCursor(5, 1);

      OL.exec(mde);

      expect(doc.getLine(5)).toEqual('# myheading');
    });
    it('add ol markdown text except heading', () => {
      const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '# myheading'];

      cm.setValue(sourceText.join('\n'));
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 4,
          ch: 7
        }
      );

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
      expect(doc.getLine(1)).toEqual('2. mytext2');
      expect(doc.getLine(2)).toEqual('3. mytext3');
      expect(doc.getLine(3)).toEqual('4. mytext4');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('# myheading');
    });
    it('add ol markdown text except blockquote', () => {
      const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '> myheading'];

      cm.setValue(sourceText.join('\n'));
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 4,
          ch: 7
        }
      );

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
      expect(doc.getLine(1)).toEqual('2. mytext2');
      expect(doc.getLine(2)).toEqual('3. mytext3');
      expect(doc.getLine(3)).toEqual('4. mytext4');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('> myheading');
    });
    it('add ol markdown text except blockquote', () => {
      const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '```', 'var a = 10;', '```'];

      cm.setValue(sourceText.join('\n'));
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 4,
          ch: 7
        }
      );

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
      expect(doc.getLine(1)).toEqual('2. mytext2');
      expect(doc.getLine(2)).toEqual('3. mytext3');
      expect(doc.getLine(3)).toEqual('4. mytext4');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('```');
    });
    it('add ol markdown text except table', () => {
      const sourceText = [
        'mytext1',
        'mytext2',
        'mytext3',
        'mytext4',
        '| hi | hello |',
        '| --- | --- |',
        '| bye | bye |'
      ];

      cm.setValue(sourceText.join('\n'));
      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 4,
          ch: 7
        }
      );

      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. mytext1');
      expect(doc.getLine(1)).toEqual('2. mytext2');
      expect(doc.getLine(2)).toEqual('3. mytext3');
      expect(doc.getLine(3)).toEqual('4. mytext4');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('| hi | hello |');
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
      doc.setSelection(
        {
          line: 1,
          ch: 0
        },
        {
          line: 2,
          ch: 4
        }
      );
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
      doc.setSelection(
        {
          line: 2,
          ch: 0
        },
        {
          line: 3,
          ch: 4
        }
      );
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('mytext1');
      expect(doc.getLine(1)).toEqual('');
      expect(doc.getLine(2)).toEqual('1. mytext2');
      expect(doc.getLine(3)).toEqual('2. mytext3');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('mytext4');
      expect(doc.getLine(6)).toEqual('# myheading');
    });

    it('should remove task bracket of a line at the caret position', () => {
      cm.setValue('* [ ] a task');

      doc.setCursor(1, 0);
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. a task');
    });

    it('should remove task bracket of a OL task line at the caret position', () => {
      cm.setValue('1. [ ] a task');

      doc.setCursor(1, 0);
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. a task');
    });

    it('should remove task bracket of selected lines', () => {
      cm.setValue(['1. [ ] a task', '* [ ] another task'].join('\n'));

      doc.setSelection(
        {
          line: 0,
          ch: 0
        },
        {
          line: 1,
          ch: 0
        }
      );
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. a task');
      expect(doc.getLine(1)).toEqual('2. another task');
    });
  });

  describe('change to ol', () => {
    it('should change same depth items to ol when item of same list change to ol', () => {
      cm.setValue(
        [
          '* AAA',
          '    * aaa',
          '    * bbb' // cursor
        ].join('\n')
      );

      doc.setCursor(2, 0);
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('* AAA');
      expect(doc.getLine(1)).toEqual('    1. aaa');
      expect(doc.getLine(2)).toEqual('    2. bbb');
    });

    it('should change all one depth items to ol when one depth item of the list change to ol', () => {
      cm.setValue(
        [
          '* AAA',
          '    * aaa',
          '* BBB', // cursor
          '    * bbb'
        ].join('\n')
      );

      doc.setCursor(2, 0);
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. AAA');
      expect(doc.getLine(1)).toEqual('    * aaa');
      expect(doc.getLine(2)).toEqual('2. BBB');
      expect(doc.getLine(3)).toEqual('    * bbb');
    });

    it('should be correct numbering when select lines that is different depth', () => {
      cm.setValue(
        [
          '* AAA',
          '    * aaa',
          '* BBB', // cursor start
          '    * bbb',
          '    * bbbb', // cursor end
          '* CCC'
        ].join('\n')
      );

      doc.setSelection(
        {
          line: 2,
          ch: 0
        },
        {
          line: 4,
          ch: 0
        }
      );
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. AAA');
      expect(doc.getLine(1)).toEqual('    * aaa');
      expect(doc.getLine(2)).toEqual('2. BBB');
      expect(doc.getLine(3)).toEqual('    1. bbb');
      expect(doc.getLine(4)).toEqual('    2. bbbb');
      expect(doc.getLine(5)).toEqual('3. CCC');
    });

    it('should be correct numbering when select lines that contain ol list', () => {
      cm.setValue(
        [
          '* AAA',
          '* BBB', // cursor start
          '1. CCC' // cursor end
        ].join('\n')
      );

      doc.setSelection(
        {
          line: 1,
          ch: 0
        },
        {
          line: 2,
          ch: 0
        }
      );
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. AAA');
      expect(doc.getLine(1)).toEqual('2. BBB');
      expect(doc.getLine(2)).toEqual('3. CCC');
    });

    it('should be correct numbering when select lines that contain ul and plain text', () => {
      cm.setValue(
        [
          '* AAA',
          '* BBB', // cursor start
          'CCC' // cursor end
        ].join('\n')
      );

      doc.setSelection(
        {
          line: 1,
          ch: 0
        },
        {
          line: 2,
          ch: 0
        }
      );
      OL.exec(mde);

      expect(doc.getLine(0)).toEqual('1. AAA');
      expect(doc.getLine(1)).toEqual('2. BBB');
      expect(doc.getLine(2)).toEqual('3. CCC');
    });
  });
});
