import { source, stripIndent } from 'common-tags';
// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';
import CommandManager from '@/commands/commandManager';
import { getTextContent } from './util';

let mde: MarkdownEditor, em: EventEmitter, cmd: CommandManager;

beforeEach(() => {
  em = new EventEmitter();
  mde = new MarkdownEditor(em, { toastMark: new ToastMark() });
  cmd = new CommandManager(em, mde.commands, {});
});

afterEach(() => {
  mde.destroy();
});

describe('bold command', () => {
  it('should add bold syntax', () => {
    mde.setMarkdown('bold');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'bold');

    expect(getTextContent(mde)).toBe('**bold**');
  });

  it('should remove bold syntax', () => {
    mde.setMarkdown('**bold**');
    mde.setSelection([1, 3], [1, 7]);

    cmd.exec('markdown', 'bold');

    expect(getTextContent(mde)).toBe('bold');
  });

  it('should remove bold syntax with empty text', () => {
    mde.setMarkdown('****');
    mde.setSelection([1, 3], [1, 3]);

    cmd.exec('markdown', 'bold');

    expect(getTextContent(mde)).toBe('');
  });
});

describe('italic command', () => {
  it('should add italic syntax', () => {
    mde.setMarkdown('italic');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'italic');

    expect(getTextContent(mde)).toBe('*italic*');
  });

  it('should remove italic syntax', () => {
    mde.setMarkdown('*italic*');
    mde.setSelection([1, 2], [1, 8]);

    cmd.exec('markdown', 'italic');

    expect(getTextContent(mde)).toBe('italic');
  });

  it('should remove italic syntax with empty text', () => {
    mde.setMarkdown('**');
    mde.setSelection([1, 2], [1, 2]);

    cmd.exec('markdown', 'italic');

    expect(getTextContent(mde)).toBe('');
  });
});

describe('strike command', () => {
  it('should add strike syntax', () => {
    mde.setMarkdown('strike');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'strike');

    expect(getTextContent(mde)).toBe('~~strike~~');
  });

  it('should remove strike syntax', () => {
    mde.setMarkdown('~~strike~~');
    mde.setSelection([1, 3], [1, 9]);

    cmd.exec('markdown', 'strike');

    expect(getTextContent(mde)).toBe('strike');
  });

  it('should remove strike syntax with empty text', () => {
    mde.setMarkdown('~~~~');
    mde.setSelection([1, 3], [1, 3]);

    cmd.exec('markdown', 'strike');

    expect(getTextContent(mde)).toBe('');
  });
});

describe('code command', () => {
  it('should add code syntax', () => {
    mde.setMarkdown('code');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'code');

    expect(getTextContent(mde)).toBe('`code`');
  });

  it('should remove code syntax', () => {
    mde.setMarkdown('`code`');
    mde.setSelection([1, 2], [1, 6]);

    cmd.exec('markdown', 'code');

    expect(getTextContent(mde)).toBe('code');
  });

  it('should remove code syntax with empty text', () => {
    mde.setMarkdown('``');
    mde.setSelection([1, 2], [1, 2]);

    cmd.exec('markdown', 'code');

    expect(getTextContent(mde)).toBe('');
  });
});

describe('blockQuote command', () => {
  it('should add blockQuote syntax', () => {
    mde.setMarkdown('blockQuote');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toBe('> blockQuote');
  });

  it('should add blockQuote syntax on empty node', () => {
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toBe('> ');
  });

  it('should remove blockQuote syntax', () => {
    mde.setMarkdown('> blockQuote');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toBe('blockQuote');
  });

  it('should add blockQuote syntax on multi line', () => {
    mde.setMarkdown('blockQuote\ntext');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toBe('> blockQuote\n> text');
  });

  it('should remove unnecessary space when adding the blockQuote syntax', () => {
    mde.setMarkdown('  blockQuote');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toBe('> blockQuote');
  });

  it('should remove unnecessary space when removing the blockQuote syntax', () => {
    mde.setMarkdown('>   blockQuote');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toBe('blockQuote');
  });
});

describe('hr command', () => {
  it('should add thematicBreak(hr) syntax', () => {
    cmd.exec('markdown', 'hr');

    expect(getTextContent(mde)).toBe('\n***\n');
  });

  it('should split the paragraph when adding thematicBreak(hr) syntax', () => {
    mde.setMarkdown('paragraph');

    mde.setSelection([1, 2], [1, 4]);
    cmd.exec('markdown', 'hr');

    expect(getTextContent(mde)).toBe('p\n***\nagraph');
  });
});

describe('addImage command', () => {
  it('should add image syntax', () => {
    cmd.exec('markdown', 'addImage', { altText: 'image', imageUrl: 'https://picsum.photos/200' });

    expect(getTextContent(mde)).toBe('![image](https://picsum.photos/200)');
  });

  it('should escape image altText', () => {
    cmd.exec('markdown', 'addImage', {
      altText: 'mytext ()[]<>',
      imageUrl: 'https://picsum.photos/200',
    });

    expect(getTextContent(mde)).toBe('![mytext \\(\\)\\[\\]\\<\\>](https://picsum.photos/200)');
  });

  it('should encode image url', () => {
    cmd.exec('markdown', 'addImage', {
      altText: 'image',
      imageUrl: 'myurl ()[]<>',
    });

    expect(getTextContent(mde)).toBe('![image](myurl%20%28%29%5B%5D%3C%3E)');
  });
});

describe('addLink command', () => {
  it('should add link syntax', () => {
    cmd.exec('markdown', 'addLink', { linkText: 'TOAST UI', linkUrl: 'https://ui.toast.com' });

    expect(getTextContent(mde)).toBe('[TOAST UI](https://ui.toast.com)');
  });

  it('should escape link Text', () => {
    cmd.exec('markdown', 'addLink', {
      linkText: 'mytext ()[]<>',
      linkUrl: 'https://ui.toast.com',
    });

    expect(getTextContent(mde)).toBe('[mytext \\(\\)\\[\\]\\<\\>](https://ui.toast.com)');
  });

  it('should encode link url', () => {
    cmd.exec('markdown', 'addLink', {
      linkText: 'TOAST UI',
      linkUrl: 'myurl ()[]<>',
    });

    expect(getTextContent(mde)).toBe('[TOAST UI](myurl%20%28%29%5B%5D%3C%3E)');
  });
});

describe('heading command', () => {
  it('should add heading syntax', () => {
    mde.setMarkdown('heading');
    cmd.exec('markdown', 'heading', { level: 1 });

    expect(getTextContent(mde)).toBe('# heading');
  });

  it('should add heading syntax on empty node', () => {
    cmd.exec('markdown', 'heading', { level: 1 });

    expect(getTextContent(mde)).toBe('# ');
  });

  it('should maintain the heading syntax on same heading level', () => {
    mde.setMarkdown('## heading2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'heading', { level: 2 });

    expect(getTextContent(mde)).toBe('## heading2');
  });

  it('should change the heading syntax on different heading level', () => {
    mde.setMarkdown('## heading2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'heading', { level: 1 });

    expect(getTextContent(mde)).toBe('# heading2');
  });

  it('should add heading syntax on multi line', () => {
    mde.setMarkdown('heading1\n# heading2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'heading', { level: 2 });

    expect(getTextContent(mde)).toBe('## heading1\n## heading2');
  });
});

describe('codeBlock command', () => {
  it('should add code block syntax', () => {
    const result = source`
      \`\`\`

      \`\`\`
    `;

    cmd.exec('markdown', 'codeBlock');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should wrap the selection with code block syntax', () => {
    const result = source`
      \`\`\`
      console.log('codeBlock');
      \`\`\`
    `;

    mde.setMarkdown(`console.log('codeBlock');`);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'codeBlock');

    expect(getTextContent(mde)).toBe(result);
  });
});

describe('bulletList command', () => {
  it('should add bullet list syntax', () => {
    cmd.exec('markdown', 'bulletList');

    expect(getTextContent(mde)).toBe('* ');
  });

  it('should add bullet list syntax to empty line', () => {
    mde.setMarkdown('\n');

    mde.setSelection([2, 1], [2, 1]);
    cmd.exec('markdown', 'bulletList');

    expect(getTextContent(mde)).toBe('\n* ');
  });

  it('should add bullet list syntax on multi line', () => {
    const input = source`
      bullet1
      bullet2
    `;
    const result = source`
      * bullet1
      * bullet2
    `;

    mde.setMarkdown(input);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'bulletList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should change ordered list to bullet list', () => {
    const input = source`
      1. ordered1
      2. ordered2
      3. ordered3
    `;
    const result = source`
      * ordered1
      * ordered2
      * ordered3
    `;

    mde.setMarkdown(input);

    mde.setSelection([2, 1], [2, 1]);
    cmd.exec('markdown', 'bulletList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should change ordered list to bullet list with depth', () => {
    const input = source`
      1. ordered1
      2. ordered2
      3. ordered3
         1. sub1
         2. sub2
    `;
    const result = source`
      * ordered1
      * ordered2
      * ordered3
         * sub1
         * sub2
    `;

    mde.setMarkdown(input);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'bulletList');

    expect(getTextContent(mde)).toBe(result);
  });
});

describe('orderedList command', () => {
  it('should add ordered list syntax', () => {
    cmd.exec('markdown', 'orderedList');

    expect(getTextContent(mde)).toBe('1. ');
  });

  it('should add ordered list syntax to empty line', () => {
    mde.setMarkdown('\n');

    mde.setSelection([2, 1], [2, 1]);
    cmd.exec('markdown', 'orderedList');

    expect(getTextContent(mde)).toBe('\n1. ');
  });

  it('should add ordered list syntax on multi line', () => {
    const input = source`
      ordered1
      ordered2
    `;
    const result = source`
      1. ordered1
      2. ordered2
    `;

    mde.setMarkdown(input);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'orderedList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should change bullet list to ordered list', () => {
    const input = source`
      * bullet1
      * bullet2
      * bullet3
    `;
    const result = source`
      1. bullet1
      2. bullet2
      3. bullet3
    `;

    mde.setMarkdown(input);

    mde.setSelection([2, 1], [2, 1]);
    cmd.exec('markdown', 'orderedList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should change bullet list to ordered list with depth', () => {
    const input = source`
      * bullet1
         * sub1
         * sub2
      * bullet2
      * bullet3
    `;
    const result = source`
      1. bullet1
         1. sub1
         2. sub2
      2. bullet2
      3. bullet3
    `;

    mde.setMarkdown(input);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'orderedList');

    expect(getTextContent(mde)).toBe(result);
  });
});

describe('taskList command', () => {
  it('should add task list syntax', () => {
    cmd.exec('markdown', 'taskList');

    expect(getTextContent(mde)).toBe('* [ ] ');
  });

  it('should add task list syntax on multi line', () => {
    const input = source`
      task1
      task2
    `;
    const result = source`
      * [ ] task1
      * [ ] task2
    `;

    mde.setMarkdown(input);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'taskList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should add task syntax to ordered list', () => {
    const input = source`
      1. ordered1
      2. ordered2
      3. ordered3
    `;
    const result = source`
      1. [ ] ordered1
      2. [ ] ordered2
      3. [ ] ordered3
    `;

    mde.setMarkdown(input);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'taskList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should add task syntax to bullet list', () => {
    const input = source`
      * bullet1
      * bullet2
      * bullet3
    `;
    const result = source`
      * [ ] bullet1
      * [ ] bullet2
      * [ ] bullet3
    `;

    mde.setMarkdown(input);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'taskList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should remove task syntax on ordered task list', () => {
    const input = source`
      1. [ ] ordered1
      2. [ ] ordered2
      3. [ ] ordered3
    `;
    const result = source`
      1. ordered1
      2. ordered2
      3. ordered3
    `;

    mde.setMarkdown(input);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'taskList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should remove task syntax on bullet task list', () => {
    const input = source`
      * [ ] bullet1
      * [ ] bullet2
      * [ ] bullet3
    `;
    const result = source`
      * bullet1
      * bullet2
      * bullet3
    `;

    mde.setMarkdown(input);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'taskList');

    expect(getTextContent(mde)).toBe(result);
  });
});

describe('addTable command', () => {
  it('should add table syntax', () => {
    const result = `\n${source`
      |  |  |
      | --- | --- |
      |  |  |
      |  |  |
    `}`;

    cmd.exec('markdown', 'addTable', { columnCount: 2, rowCount: 3 });

    expect(getTextContent(mde)).toBe(result);
  });

  it('should add table syntax to next line', () => {
    const result = source`
      text
      |  |  |
      | --- | --- |
      |  |  |
      |  |  |
    `;

    mde.setMarkdown('text');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'addTable', { columnCount: 2, rowCount: 3 });

    expect(getTextContent(mde)).toBe(result);
  });
});

describe('indent command', () => {
  it('should not operate if not a list', () => {
    mde.setMarkdown('text');
    mde.setSelection([1, 3], [1, 3]);

    cmd.exec('markdown', 'indent');

    expect(getTextContent(mde)).toBe('text');
  });

  it('should add soft-tab indentation to first offset on multi line selection', () => {
    const input = source`
      * line1
      * line2
      * line3
      * line4
    `;
    const result = stripIndent`
      * line1
          * line2
          * line3
      * line4
    `;

    mde.setMarkdown(input);
    mde.setSelection([2, 3], [3, 2]);

    cmd.exec('markdown', 'indent');

    expect(getTextContent(mde)).toBe(result);
  });

  describe('ordered list', () => {
    it('should reorder ordered list after adding soft-tab indentation based on caret position', () => {
      const input = source`
        1. line1
        2. line2
        3. line3
        4. line4
      `;
      const result = stripIndent`
        1. line1
            1. line2
        2. line3
        3. line4
      `;

      mde.setMarkdown(input);
      mde.setSelection([2, 1], [2, 1]);

      cmd.exec('markdown', 'indent');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should reorder ordered list after adding soft-tab indentation based on multi line selection', () => {
      const input = source`
        1. line1
        2. line2
        3. line3
        4. line4
      `;
      const result = stripIndent`
        1. line1
            1. line2
            2. line3
        2. line4
      `;

      mde.setMarkdown(input);
      mde.setSelection([2, 3], [3, 2]);

      cmd.exec('markdown', 'indent');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should reorder ordered list with empty list item', () => {
      const input = source`
        1. line1
        2. line2
        3. 
        4. line4
      `;
      const result = stripIndent`
        1. line1
        2. line2
            1. 
        3. line4
      `;

      mde.setMarkdown(input);
      mde.setSelection([3, 2], [3, 3]);

      cmd.exec('markdown', 'indent');

      expect(getTextContent(mde)).toBe(result);
    });
  });
});

describe('outdent command', () => {
  it('should not operate if not a list', () => {
    mde.setMarkdown('    text');
    mde.setSelection([1, 5], [1, 5]);

    cmd.exec('markdown', 'outdent');

    expect(getTextContent(mde)).toBe('    text');
  });

  it('should remove soft-tab indentation from first offset on multi line selection', () => {
    const input = stripIndent`
      * line1
          * line2
          * line3
      * line4
    `;
    const result = source`
      * line1
      * line2
      * line3
      * line4
    `;

    mde.setMarkdown(input);
    mde.setSelection([2, 3], [3, 2]);

    cmd.exec('markdown', 'outdent');

    expect(getTextContent(mde)).toBe(result);
  });

  describe('ordered list', () => {
    it('should reorder ordered list after removing soft-tab indentation based on caret position', () => {
      const input = stripIndent`
        1. line1
          1. line2
        2. line3
        3. line4
      `;
      const result = source`
        1. line1
        2. line2
        3. line3
        4. line4
      `;

      mde.setMarkdown(input);
      mde.setSelection([2, 1], [2, 1]);

      cmd.exec('markdown', 'outdent');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should reorder ordered list after removing soft-tab indentation based on multi line selection', () => {
      const input = stripIndent`
        1. line1
            1. line2
            2. line3
        2. line4
      `;
      const result = source`
        1. line1
        2. line2
        3. line3
        4. line4
      `;

      mde.setMarkdown(input);
      mde.setSelection([2, 3], [3, 2]);

      cmd.exec('markdown', 'outdent');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should reorder ordered list with empty list item', () => {
      const input = stripIndent`
        1. line1
        2. line2
          1. 
        3. line4
      `;
      const result = source`
        1. line1
        2. line2
        3. 
        4. line4
      `;

      mde.setMarkdown(input);
      mde.setSelection([3, 2], [3, 3]);

      cmd.exec('markdown', 'outdent');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should not throw error on line which has no indentation', () => {
      const result = stripIndent`
        1. line1
        2. line2
        3. line3
        4. line4
      `;

      mde.setMarkdown(result);
      mde.setSelection([1, 2], [3, 3]);

      cmd.exec('markdown', 'outdent');

      expect(getTextContent(mde)).toBe(result);
    });
  });
});

describe('history command', () => {
  beforeEach(() => {
    mde.setMarkdown('italicBold');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'bold');
    cmd.exec('markdown', 'italic');
  });

  it('undo go back to before previous action', () => {
    cmd.exec('markdown', 'undo');

    expect(getTextContent(mde)).toBe('**italicBold**');
  });

  it('redo cancel undo action', () => {
    cmd.exec('markdown', 'undo');
    cmd.exec('markdown', 'redo');

    expect(getTextContent(mde)).toBe('***italicBold***');
  });
});
