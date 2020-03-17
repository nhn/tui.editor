/**
 * @fileoverview test markdown task
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import task from '@/markdownCommands/task';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';
import mdListManager from '@/mdListManager';

describe('task', () => {
  let cm, doc, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());
    mde.componentManager.addManager(mdListManager);

    cm = mde.getEditor();

    const sourceText = [
      'mytext1',
      '',
      'mytext2',
      'mytext3',
      '',
      '* mytext4',
      '',
      '1. mytext5',
      '# myheading'
    ];

    cm.setValue(sourceText.join('\n'));
    doc = cm.getDoc();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('add task', () => {
    it('markdown to start', () => {
      doc.setCursor(0, 0);

      task.exec(mde);

      expect(doc.getLine(0)).toEqual('* [ ] mytext1');
    });
    it('Add ol markdown text to line start', () => {
      doc.setCursor(0, 4);

      task.exec(mde);

      expect(doc.getLine(0)).toEqual('* [ ] mytext1');
    });
    it('replace markdown text if line have ul', () => {
      doc.setCursor(2, 4);

      task.exec(mde);

      expect(doc.getLine(2)).toEqual('* [ ] mytext2');
    });
    it('remove task syntax if task already applied', () => {
      doc.setCursor(0, 4);

      task.exec(mde);
      task.exec(mde);

      expect(doc.getLine(0)).toEqual('* mytext1');
    });
    it('to a blank line', () => {
      doc.setCursor(1, 0);

      task.exec(mde);

      expect(doc.getLine(2)).toEqual('* [ ] ');
    });

    it('around selected area', () => {
      doc.setSelection({ line: 0, ch: 0 }, { line: 2, ch: 7 });

      task.exec(mde);

      expect(doc.getLine(0)).toEqual('* [ ] mytext1');
      expect(doc.getLine(1)).toEqual('* [ ] ');
      expect(doc.getLine(2)).toEqual('* [ ] mytext2');
      expect(doc.getLine(3)).toEqual('');
      expect(doc.getLine(4)).toEqual('mytext3');
    });

    it('convert ul to task', () => {
      doc.setCursor(5, 0);

      task.exec(mde);

      expect(doc.getLine(5)).toEqual('* [ ] mytext4');
    });

    it('convert ol to task', () => {
      doc.setCursor(7, 0);

      task.exec(mde);

      expect(doc.getLine(7)).toEqual('1. [ ] mytext5');
    });
    it("Don't add task markdown text in heading", () => {
      doc.setCursor(8, 1);

      task.exec(mde);

      expect(doc.getLine(8)).toEqual('# myheading');
    });
    it('add task markdown text except heading', () => {
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

      task.exec(mde);

      expect(doc.getLine(0)).toEqual('* [ ] mytext1');
      expect(doc.getLine(1)).toEqual('* [ ] mytext2');
      expect(doc.getLine(2)).toEqual('* [ ] mytext3');
      expect(doc.getLine(3)).toEqual('* [ ] mytext4');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('# myheading');
    });
    it('add task markdown text except blockquote', () => {
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

      task.exec(mde);

      expect(doc.getLine(0)).toEqual('* [ ] mytext1');
      expect(doc.getLine(1)).toEqual('* [ ] mytext2');
      expect(doc.getLine(2)).toEqual('* [ ] mytext3');
      expect(doc.getLine(3)).toEqual('* [ ] mytext4');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('> myheading');
    });
    it('add task markdown text except blockquote', () => {
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

      task.exec(mde);

      expect(doc.getLine(0)).toEqual('* [ ] mytext1');
      expect(doc.getLine(1)).toEqual('* [ ] mytext2');
      expect(doc.getLine(2)).toEqual('* [ ] mytext3');
      expect(doc.getLine(3)).toEqual('* [ ] mytext4');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('```');
    });
    it('add task markdown text except table', () => {
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

      task.exec(mde);

      expect(doc.getLine(0)).toEqual('* [ ] mytext1');
      expect(doc.getLine(1)).toEqual('* [ ] mytext2');
      expect(doc.getLine(2)).toEqual('* [ ] mytext3');
      expect(doc.getLine(3)).toEqual('* [ ] mytext4');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('| hi | hello |');
    });
    it('do not add blank at start & end of task when already blank line exists', () => {
      const sourceText = ['', 'mytext2', '', 'mytext4', '# myheading'];

      cm.setValue(sourceText.join('\n'));
      doc.setCursor(1, 1);
      task.exec(mde);

      expect(doc.getLine(0)).toEqual('');
      expect(doc.getLine(1)).toEqual('* [ ] mytext2');
      expect(doc.getLine(2)).toEqual('');
      expect(doc.getLine(3)).toEqual('mytext4');
      expect(doc.getLine(4)).toEqual('# myheading');
    });
    it('add blank at start & end of task when blank line not exists', () => {
      const sourceText = ['mytext1', 'mytext2', 'mytext3', 'mytext4', '# myheading'];

      cm.setValue(sourceText.join('\n'));
      doc.setCursor(1, 1);
      task.exec(mde);

      expect(doc.getLine(0)).toEqual('mytext1');
      expect(doc.getLine(1)).toEqual('');
      expect(doc.getLine(2)).toEqual('* [ ] mytext2');
      expect(doc.getLine(3)).toEqual('');
      expect(doc.getLine(4)).toEqual('mytext3');
      expect(doc.getLine(5)).toEqual('mytext4');
      expect(doc.getLine(6)).toEqual('# myheading');
    });
    it('add blank at start & end of task when blank line not exists with selection', () => {
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
      task.exec(mde);

      expect(doc.getLine(0)).toEqual('mytext1');
      expect(doc.getLine(1)).toEqual('');
      expect(doc.getLine(2)).toEqual('* [ ] mytext2');
      expect(doc.getLine(3)).toEqual('* [ ] mytext3');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('mytext4');
      expect(doc.getLine(6)).toEqual('# myheading');
    });
    it('do not add blank at start & end of task when already blank line exists with selection', () => {
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
      task.exec(mde);

      expect(doc.getLine(0)).toEqual('mytext1');
      expect(doc.getLine(1)).toEqual('');
      expect(doc.getLine(2)).toEqual('* [ ] mytext2');
      expect(doc.getLine(3)).toEqual('* [ ] mytext3');
      expect(doc.getLine(4)).toEqual('');
      expect(doc.getLine(5)).toEqual('mytext4');
      expect(doc.getLine(6)).toEqual('# myheading');
    });

    it('should maintain depth when apply task', () => {
      const sourceText = ['* mytext1', '    * mytext2'];

      cm.setValue(sourceText.join('\n'));
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
      task.exec(mde);

      expect(doc.getLine(0)).toEqual('* [ ] mytext1');
      expect(doc.getLine(1)).toEqual('    * [ ] mytext2');
    });

    it('should maintain depth when remove task', () => {
      const sourceText = ['* [ ] mytext1', '    * [ ] mytext2'];

      cm.setValue(sourceText.join('\n'));
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
      task.exec(mde);

      expect(doc.getLine(0)).toEqual('* mytext1');
      expect(doc.getLine(1)).toEqual('    * mytext2');
    });
  });
});
