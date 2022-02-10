import { oneLineTrim, source, stripIndent } from 'common-tags';
import { undo } from 'prosemirror-history';
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdown/mdEditor';
import MarkdownPreview from '@/markdown/mdPreview';
import EventEmitter from '@/event/eventEmitter';
import { sanitizeHTML } from '@/sanitizer/htmlSanitizer';
import CommandManager from '@/commands/commandManager';
import { getTextContent, TestEditorWithNoneDelayHistory, removeDataAttr } from './util';

let mde: MarkdownEditor, em: EventEmitter, cmd: CommandManager, preview: MarkdownPreview;

function execUndo() {
  const { state, dispatch } = mde.view;

  undo(state, dispatch);
}

function getPreviewHTML() {
  return oneLineTrim`${removeDataAttr(preview.getHTML())}`;
}

beforeEach(() => {
  em = new EventEmitter();
  mde = new TestEditorWithNoneDelayHistory(em, { toastMark: new ToastMark() });
  cmd = new CommandManager(em, mde.commands, {}, () => 'markdown');

  const options = {
    linkAttributes: null,
    customHTMLRenderer: {},
    isViewer: false,
    highlight: false,
    sanitizer: sanitizeHTML,
  };

  preview = new MarkdownPreview(em, options);
});

afterEach(() => {
  mde.destroy();
  preview.destroy();
});

describe('bold command', () => {
  it('should add bold syntax', () => {
    mde.setMarkdown('bold');

    cmd.exec('selectAll');
    cmd.exec('bold');

    expect(getTextContent(mde)).toBe('**bold**');
  });

  it('should remove bold syntax', () => {
    mde.setMarkdown('**bold**');
    mde.setSelection([1, 3], [1, 7]);

    cmd.exec('bold');

    expect(getTextContent(mde)).toBe('bold');
  });

  it('should remove bold syntax with empty text', () => {
    mde.setMarkdown('****');
    mde.setSelection([1, 3], [1, 3]);

    cmd.exec('bold');

    expect(getTextContent(mde)).toBe('');
  });
});

describe('italic command', () => {
  it('should add italic syntax', () => {
    mde.setMarkdown('italic');

    cmd.exec('selectAll');
    cmd.exec('italic');

    expect(getTextContent(mde)).toBe('*italic*');
  });

  it('should remove italic syntax', () => {
    mde.setMarkdown('ab*italic*cd');
    mde.setSelection([1, 4], [1, 10]);

    cmd.exec('italic');

    expect(getTextContent(mde)).toBe('abitaliccd');
  });

  it('should remove italic syntax with empty text', () => {
    mde.setMarkdown('**');
    mde.setSelection([1, 2], [1, 2]);

    cmd.exec('italic');

    expect(getTextContent(mde)).toBe('');
  });
});

describe('strike command', () => {
  it('should add strike syntax', () => {
    mde.setMarkdown('strike');

    cmd.exec('selectAll');
    cmd.exec('strike');

    expect(getTextContent(mde)).toBe('~~strike~~');
  });

  it('should remove strike syntax', () => {
    mde.setMarkdown('~~strike~~');
    mde.setSelection([1, 3], [1, 9]);

    cmd.exec('strike');

    expect(getTextContent(mde)).toBe('strike');
  });

  it('should remove strike syntax with empty text', () => {
    mde.setMarkdown('~~~~');
    mde.setSelection([1, 3], [1, 3]);

    cmd.exec('strike');

    expect(getTextContent(mde)).toBe('');
  });
});

describe('code command', () => {
  it('should add code syntax', () => {
    mde.setMarkdown('code');

    cmd.exec('selectAll');
    cmd.exec('code');

    expect(getTextContent(mde)).toBe('`code`');
  });

  it('should remove code syntax', () => {
    mde.setMarkdown('`code`');
    mde.setSelection([1, 2], [1, 6]);

    cmd.exec('code');

    expect(getTextContent(mde)).toBe('code');
  });

  it('should remove code syntax with empty text', () => {
    mde.setMarkdown('``');
    mde.setSelection([1, 2], [1, 2]);

    cmd.exec('code');

    expect(getTextContent(mde)).toBe('');
  });
});

describe('blockQuote command', () => {
  it('should add blockQuote syntax', () => {
    mde.setMarkdown('blockQuote');

    cmd.exec('selectAll');
    cmd.exec('blockQuote');

    expect(getTextContent(mde)).toBe('> blockQuote');
  });

  it('should add blockQuote syntax on empty node', () => {
    cmd.exec('blockQuote');

    expect(getTextContent(mde)).toBe('> ');
  });

  it('should remove blockQuote syntax', () => {
    mde.setMarkdown('> blockQuote');

    cmd.exec('selectAll');
    cmd.exec('blockQuote');

    expect(getTextContent(mde)).toBe('blockQuote');
  });

  it('should add blockQuote syntax on multi line', () => {
    mde.setMarkdown('blockQuote\ntext');

    cmd.exec('selectAll');
    cmd.exec('blockQuote');

    expect(getTextContent(mde)).toBe('> blockQuote\n> text');
  });

  it('should remove unnecessary space when adding the blockQuote syntax', () => {
    mde.setMarkdown('  blockQuote');

    cmd.exec('selectAll');
    cmd.exec('blockQuote');

    expect(getTextContent(mde)).toBe('> blockQuote');
  });

  it('should remove unnecessary space when removing the blockQuote syntax', () => {
    mde.setMarkdown('>   blockQuote');

    cmd.exec('selectAll');
    cmd.exec('blockQuote');

    expect(getTextContent(mde)).toBe('blockQuote');
  });

  it('should select last position of the line when adding the blockQuote syntax', () => {
    mde.setMarkdown('\ntest');

    mde.setSelection([1, 1], [1, 1]);
    cmd.exec('blockQuote');

    expect(getTextContent(mde)).toBe('> \ntest');
    expect(mde.getSelection()).toEqual([
      [1, 3],
      [1, 3],
    ]);
  });

  it('should undo blockQuote command properly', () => {
    const input = 'test\nparagraph';
    const result = '<p>test<br>paragraph</p>';

    mde.setMarkdown(input);

    mde.setSelection([1, 1], [1, 1]);
    cmd.exec('blockQuote');

    execUndo();

    expect(getPreviewHTML()).toBe(result);
  });
});

describe('hr command', () => {
  it('should add thematicBreak(hr) syntax', () => {
    cmd.exec('hr');

    expect(getTextContent(mde)).toBe('\n***\n');
  });

  it('should split the paragraph when adding thematicBreak(hr) syntax', () => {
    mde.setMarkdown('paragraph');

    mde.setSelection([1, 2], [1, 4]);
    cmd.exec('hr');

    expect(getTextContent(mde)).toBe('p\n***\nagraph');
  });

  it('should undo hr command properly', () => {
    const input = 'test\nparagraph';
    const result = '<p>test<br>paragraph</p>';

    mde.setMarkdown(input);

    mde.setSelection([1, 5], [1, 5]);
    cmd.exec('hr');

    execUndo();

    expect(getPreviewHTML()).toBe(result);
  });
});

describe('addImage command', () => {
  it('should add image syntax', () => {
    cmd.exec('addImage', { altText: 'image', imageUrl: 'https://picsum.photos/200' });

    expect(getTextContent(mde)).toBe('![image](https://picsum.photos/200)');
  });

  it('should escape image altText', () => {
    cmd.exec('addImage', {
      altText: 'mytext ()[]<>',
      imageUrl: 'https://picsum.photos/200',
    });

    expect(getTextContent(mde)).toBe('![mytext ()\\[\\]<>](https://picsum.photos/200)');
  });

  it('should encode image url', () => {
    cmd.exec('addImage', {
      altText: 'image',
      imageUrl: 'myurl ()[]<>',
    });

    expect(getTextContent(mde)).toBe('![image](myurl ()[]<>)');
  });

  it('should not decode url which is already encoded', () => {
    cmd.exec('addImage', {
      altText: 'image',
      imageUrl: 'https://firebasestorage.googleapis.com/images%2Fimage.png?alt=media',
    });

    expect(getTextContent(mde)).toBe(
      '![image](https://firebasestorage.googleapis.com/images%2Fimage.png?alt=media)'
    );
  });
});

describe('addLink command', () => {
  it('should add link syntax', () => {
    cmd.exec('addLink', { linkText: 'TOAST UI', linkUrl: 'https://ui.toast.com' });

    expect(getTextContent(mde)).toBe('[TOAST UI](https://ui.toast.com)');
  });

  it('should escape link Text', () => {
    cmd.exec('addLink', {
      linkText: 'mytext ()[]<>',
      linkUrl: 'https://ui.toast.com',
    });

    expect(getTextContent(mde)).toBe('[mytext ()\\[\\]<>](https://ui.toast.com)');
  });

  it('should not decode url which is already encoded', () => {
    cmd.exec('addLink', {
      linkText: 'TOAST UI',
      linkUrl: 'https://firebasestorage.googleapis.com/links%2Fimage.png?alt=media',
    });

    expect(getTextContent(mde)).toBe(
      '[TOAST UI](https://firebasestorage.googleapis.com/links%2Fimage.png?alt=media)'
    );
  });
});

describe('heading command', () => {
  it('should add heading syntax', () => {
    mde.setMarkdown('heading');
    cmd.exec('heading', { level: 1 });

    expect(getTextContent(mde)).toBe('# heading');
  });

  it('should add heading syntax on empty node', () => {
    cmd.exec('heading', { level: 1 });

    expect(getTextContent(mde)).toBe('# ');
  });

  it('should maintain the heading syntax on same heading level', () => {
    mde.setMarkdown('## heading2');

    cmd.exec('selectAll');
    cmd.exec('heading', { level: 2 });

    expect(getTextContent(mde)).toBe('## heading2');
  });

  it('should change the heading syntax on different heading level', () => {
    mde.setMarkdown('## heading2');

    cmd.exec('selectAll');
    cmd.exec('heading', { level: 1 });

    expect(getTextContent(mde)).toBe('# heading2');
  });

  it('should add heading syntax on multi line', () => {
    mde.setMarkdown('heading1\n# heading2');

    cmd.exec('selectAll');
    cmd.exec('heading', { level: 2 });

    expect(getTextContent(mde)).toBe('## heading1\n## heading2');
  });

  it('should select last position of the line when adding the heading syntax', () => {
    mde.setMarkdown('\ntest');

    mde.setSelection([1, 1], [1, 1]);
    cmd.exec('heading', { level: 1 });

    expect(getTextContent(mde)).toBe('# \ntest');
    expect(mde.getSelection()).toEqual([
      [1, 3],
      [1, 3],
    ]);
  });
});

describe('codeBlock command', () => {
  it('should add code block syntax', () => {
    const result = source`
      \`\`\`

      \`\`\`
    `;

    cmd.exec('codeBlock');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should wrap the selection with code block syntax', () => {
    const result = source`
      \`\`\`
      console.log('codeBlock');
      \`\`\`
    `;

    mde.setMarkdown(`console.log('codeBlock');`);

    cmd.exec('selectAll');
    cmd.exec('codeBlock');

    expect(getTextContent(mde)).toBe(result);
  });
});

describe('bulletList command', () => {
  it('should add bullet list syntax', () => {
    cmd.exec('bulletList');

    expect(getTextContent(mde)).toBe('* ');
  });

  it('should add bullet list syntax to empty line', () => {
    mde.setMarkdown('\n');

    mde.setSelection([2, 1], [2, 1]);
    cmd.exec('bulletList');

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

    cmd.exec('selectAll');
    cmd.exec('bulletList');

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
    cmd.exec('bulletList');

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

    cmd.exec('selectAll');
    cmd.exec('bulletList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should undo bullet list command properly', () => {
    const input = source`
      1. ordered1
      2. ordered2
      3. ordered3
         1. sub1
         2. sub2
    `;
    const result = oneLineTrim`
      <ol>
        <li><p>ordered1</p></li>
        <li><p>ordered2</p></li>
        <li>
          <p>ordered3</p>
          <ol>
            <li><p>sub1</p></li>
            <li><p>sub2</p></li>
          </ol>
        </li>
      </ol>
    `;

    mde.setMarkdown(input);

    mde.setSelection([1, 2], [1, 2]);
    cmd.exec('bulletList');

    execUndo();

    expect(getPreviewHTML()).toBe(result);
  });

  it('should add bullet list syntax to empty line after heading node', () => {
    mde.setMarkdown('# heading\n');

    mde.setSelection([2, 1], [2, 1]);
    cmd.exec('bulletList');

    expect(getTextContent(mde)).toBe('# heading\n* ');
  });
});

describe('orderedList command', () => {
  it('should add ordered list syntax', () => {
    cmd.exec('orderedList');

    expect(getTextContent(mde)).toBe('1. ');
  });

  it('should add ordered list syntax to empty line', () => {
    mde.setMarkdown('\n');

    mde.setSelection([2, 1], [2, 1]);
    cmd.exec('orderedList');

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

    cmd.exec('selectAll');
    cmd.exec('orderedList');

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
    cmd.exec('orderedList');

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

    cmd.exec('selectAll');
    cmd.exec('orderedList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should change paragraph to ordered list with prev bullet list', () => {
    const input = source`
      * bullet1

      ordered1
      ordered2
    `;
    const result = source`
    * bullet1

    1. ordered1
    2. ordered2
    `;

    mde.setMarkdown(input);

    mde.setSelection([3, 2], [4, 2]);
    cmd.exec('orderedList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should change bullet list to ordered list partially', () => {
    const input = source`
      * bullet1
      * bullet2
      * bullet3
         * bullet4
         * bullet5
    `;
    const firstResult = source`
      1. bullet1
      2. bullet2
      3. bullet3
         * bullet4
         * bullet5
    `;
    const secondResult = source`
      1. bullet1
      2. bullet2
      3. bullet3
         1. bullet4
         2. bullet5
    `;

    mde.setMarkdown(input);

    mde.setSelection([1, 2], [1, 2]);
    cmd.exec('orderedList');

    expect(getTextContent(mde)).toBe(firstResult);

    mde.setSelection([4, 2], [4, 2]);
    cmd.exec('orderedList');

    expect(getTextContent(mde)).toBe(secondResult);
  });

  it('should change bullet list to ordered list with extended ranges', () => {
    const input = source`
      * bullet1
      * bullet2
      * bullet3
         * bullet4
         * bullet5
      * bullet6
    `;
    const result = source`
      1. bullet1
      2. bullet2
      3. bullet3
         * bullet4
         * bullet5
      4. bullet6
    `;

    mde.setMarkdown(input);

    mde.setSelection([1, 2], [1, 2]);
    cmd.exec('orderedList');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should undo ordered list command properly', () => {
    const input = source`
      * bullet1
      * bullet2
      * bullet3
         * bullet4
         * bullet5
      * bullet6
    `;
    const result = oneLineTrim`
      <ul>
        <li><p>bullet1</p></li>
        <li><p>bullet2</p></li>
        <li>
          <p>bullet3</p>
          <ul>
            <li><p>bullet4</p></li>
            <li><p>bullet5</p></li>
          </ul>
        </li>
        <li><p>bullet6</p></li>
      </ul>
    `;

    mde.setMarkdown(input);

    mde.setSelection([1, 2], [1, 2]);
    cmd.exec('orderedList');

    execUndo();

    expect(getPreviewHTML()).toBe(result);
  });

  it('should add ordered list syntax to empty line after heading node', () => {
    mde.setMarkdown('# heading\n');

    mde.setSelection([2, 1], [2, 1]);
    cmd.exec('orderedList');

    expect(getTextContent(mde)).toBe('# heading\n1. ');
  });
});

describe('taskList command', () => {
  it('should add task list syntax', () => {
    cmd.exec('taskList');

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

    cmd.exec('selectAll');
    cmd.exec('taskList');

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

    cmd.exec('selectAll');
    cmd.exec('taskList');

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

    cmd.exec('selectAll');
    cmd.exec('taskList');

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

    cmd.exec('selectAll');
    cmd.exec('taskList');

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

    cmd.exec('selectAll');
    cmd.exec('taskList');

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

    cmd.exec('addTable', { columnCount: 2, rowCount: 3 });

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

    cmd.exec('selectAll');
    cmd.exec('addTable', { columnCount: 2, rowCount: 3 });

    expect(getTextContent(mde)).toBe(result);
  });

  it('should undo table command properly', () => {
    mde.setMarkdown('text');

    cmd.exec('selectAll');
    cmd.exec('addTable', { columnCount: 2, rowCount: 3 });

    execUndo();

    expect(getPreviewHTML()).toBe('<p>text</p>');
  });
});

describe('indent command', () => {
  it('should not operate if not a list', () => {
    mde.setMarkdown('text');
    mde.setSelection([1, 3], [1, 3]);

    cmd.exec('indent');

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

    cmd.exec('indent');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should undo indent command properly', () => {
    const input = source`
      * line1
      * line2
      * line3
      * line4
    `;
    const result = oneLineTrim`
      <ul>
        <li><p>line1</p></li>
        <li><p>line2</p></li>
        <li><p>line3</p></li>
        <li><p>line4</p></li>
      </ul>
    `;

    mde.setMarkdown(input);
    mde.setSelection([2, 3], [3, 2]);

    cmd.exec('indent');

    execUndo();

    expect(getPreviewHTML()).toBe(result);
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

      cmd.exec('indent');

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

      cmd.exec('indent');

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

      cmd.exec('indent');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should change ordered list to paragraph properly', () => {
      const input = stripIndent`
      1. ordered1
      2. ordered2
          * sub1
          * sub2
            1. sub-ordered1
            2. sub-ordered1
            3. sub-ordered1
    `;
      const result = stripIndent`
        1. ordered1
        2. ordered2
            * sub1
            * sub2
                  1. sub-ordered1
              2. sub-ordered1
              3. sub-ordered1
      `;

      mde.setMarkdown(input);
      mde.setSelection([5, 10], [5, 10]);

      cmd.exec('indent');

      expect(getTextContent(mde)).toBe(result);
    });
  });
});

describe('outdent command', () => {
  it('should not operate if not a list', () => {
    mde.setMarkdown('    text');
    mde.setSelection([1, 5], [1, 5]);

    cmd.exec('outdent');

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

    cmd.exec('outdent');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should undo outdent command properly', () => {
    const input = stripIndent`
      * line1
          * line2
          * line3
      * line4
    `;
    const result = oneLineTrim`
      <ul>
        <li>
          <p>line1</p>
          <ul>
            <li><p>line2</p></li>
            <li><p>line3</p></li>
          </ul>
        </li>
        <li><p>line4</p></li>
      </ul>
    `;

    mde.setMarkdown(input);
    mde.setSelection([2, 3], [3, 2]);

    cmd.exec('outdent');

    execUndo();

    expect(getPreviewHTML()).toBe(result);
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

      cmd.exec('outdent');

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

      cmd.exec('outdent');

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

      cmd.exec('outdent');

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

      cmd.exec('outdent');

      expect(getTextContent(mde)).toBe(result);
    });
  });
});

describe('customBlock command', () => {
  it('should add custom block syntax', () => {
    const result = source`
      $$myCustom

      $$
    `;

    cmd.exec('customBlock', { info: 'myCustom' });

    expect(getTextContent(mde)).toBe(result);
  });

  it('should wrap the selection with custom block syntax', () => {
    const result = source`
      $$myCustom
      console.log('customBlock');
      $$
    `;

    mde.setMarkdown(`console.log('customBlock');`);

    cmd.exec('selectAll');
    cmd.exec('customBlock', { info: 'myCustom' });

    expect(getTextContent(mde)).toBe(result);
  });
});
