import { oneLineTrim, source, stripIndent } from 'common-tags';
import { redo, undo } from 'prosemirror-history';
import {
  chainCommands,
  deleteSelection,
  joinBackward,
  selectNodeBackward,
} from 'prosemirror-commands';
import * as keymaps from 'prosemirror-keymap';
import { Sourcepos, ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdown/mdEditor';
import MarkdownPreview from '@/markdown/mdPreview';
import EventEmitter from '@/event/eventEmitter';
import { sanitizeHTML } from '@/sanitizer/htmlSanitizer';
import { getTextContent, removeDataAttr, TestEditorWithNoneDelayHistory } from './util';

// @TODO: all tests should move to e2e test

function forceKeymapFn(type: string, methodName: string, args: any[] = []) {
  const { specs, view } = mde;
  // @ts-ignore
  const [keymapFn] = specs.specs.filter((spec) => spec.name === type);

  // @ts-ignore
  keymapFn[methodName](...args)(view.state, view.dispatch);
}

function forceBackspaceKeymap() {
  const { state, dispatch } = mde.view;

  chainCommands(deleteSelection, joinBackward, selectNodeBackward)(state, dispatch, mde.view);
}

let mde: MarkdownEditor, em: EventEmitter, preview: MarkdownPreview;

function getPreviewHTML() {
  return oneLineTrim`${removeDataAttr(preview.getHTML())}`;
}

function assertSelection(mdPos: Sourcepos) {
  expect(mde.getSelection()).toEqual(mdPos);
}

function execUndo() {
  const { state, dispatch } = mde.view;

  undo(state, dispatch);
}

beforeEach(() => {
  em = new EventEmitter();
  mde = new TestEditorWithNoneDelayHistory(em, { toastMark: new ToastMark() });

  const options = {
    linkAttributes: null,
    customHTMLRenderer: {},
    isViewer: false,
    highlight: false,
    sanitizer: sanitizeHTML,
  };

  preview = new MarkdownPreview(em, options);
});

// @TODO: should add test case after developing the markdown editor API
// describe('move table cell keymap', () => {
// });

describe('extend table keymap', () => {
  it('should extend the table', () => {
    const input = source`
      | head1 | head2 |
      | --- | --- |
      | row1 | row1 |
      | row2 | row2 |
    `;
    const result = source`
      | head1 | head2 |
      | --- | --- |
      | row1 | row1 |
      |  |  |
      | row2 | row2 |
    `;

    mde.setMarkdown(input);
    mde.setSelection([3, 2], [3, 2]);

    forceKeymapFn('table', 'extendTable');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should delete the row in case of empty table content', () => {
    const input = source`
      | head1 | head2 |
      | --- | --- |
      | row1 | row1 |
      |  |  |
    `;
    const result = source`
      | head1 | head2 |
      | --- | --- |
      | row1 | row1 |
    `;

    mde.setMarkdown(input);
    mde.setSelection([4, 2], [4, 2]);

    forceKeymapFn('table', 'extendTable');

    expect(getTextContent(mde)).toBe(`${result}\n\n`);
  });

  it('should not extend table list on multi line selection', () => {
    const input = source`
      | head1 | head2 |
      | --- | --- |
      | row1 | row1 |
      | row2 | row2 |
    `;

    mde.setMarkdown(input);
    mde.setSelection([2, 14], [4, 5]);

    forceKeymapFn('table', 'extendTable');

    expect(getTextContent(mde)).toBe(input);
  });

  it('should not extend the table out of table range', () => {
    const input = source`
      | head1 | head2 |
      | --- | --- |
      | row1 | row1 |
      | row2 | row2 |
    `;
    const result = source`
      | head1 | head2 |
      | --- | --- |
      | row1 | row1 |
      | row2 | row2 |
    `;

    mde.setMarkdown(input);
    mde.setSelection([4, 15], [4, 15]);

    forceKeymapFn('table', 'extendTable');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should undo extend the table properly', () => {
    const input = source`
      | head1 | head2 |
      | --- | --- |
      | row1 | row1 |
      | row2 | row2 |
      text
    `;
    const result = oneLineTrim`
      <table>
        <thead>
          <tr>
            <th>head1</th>
            <th>head2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>row1</td>
            <td>row1</td>
          </tr>
          <tr>
            <td>row2</td>
            <td>row2</td>
          </tr>
        </tbody>
      </table>
      <p>text</p>
    `;

    mde.setMarkdown(input);
    mde.setSelection([4, 2], [4, 2]);

    forceKeymapFn('table', 'extendTable');

    execUndo();

    expect(getPreviewHTML()).toBe(result);
  });
});

describe('extend block quote keymap', () => {
  it('should extend the block quote', () => {
    mde.setMarkdown('> block');
    mde.setSelection([1, 8], [1, 8]);

    forceKeymapFn('blockQuote', 'extendBlockQuote');

    expect(getTextContent(mde)).toBe('> block\n> ');
    assertSelection([
      [2, 3],
      [2, 3],
    ]);
  });

  it('should extend the block quote with sliced text', () => {
    mde.setMarkdown('> block');
    mde.setSelection([1, 6], [1, 6]);

    forceKeymapFn('blockQuote', 'extendBlockQuote');

    expect(getTextContent(mde)).toBe('> blo\n> ck');
    assertSelection([
      [2, 3],
      [2, 3],
    ]);
  });

  it('should not extend the block quote on multi line selection', () => {
    const input = '> block1\n> block2';

    mde.setMarkdown(input);
    mde.setSelection([1, 2], [2, 4]);

    forceKeymapFn('blockQuote', 'extendBlockQuote');

    expect(getTextContent(mde)).toBe(input);
  });

  it('should delete the row in case of empty block quote content', () => {
    mde.setMarkdown('> block\n> ');
    mde.setSelection([2, 2], [2, 2]);

    forceKeymapFn('blockQuote', 'extendBlockQuote');

    expect(getTextContent(mde)).toBe('> block\n\n');
  });

  it('should delete the row in case of empty block quote content with next content', () => {
    mde.setMarkdown('> block\n>\nparagraph');
    mde.setSelection([2, 2], [2, 2]);

    forceKeymapFn('blockQuote', 'extendBlockQuote');

    expect(getTextContent(mde)).toBe('> block\n\n\nparagraph');
  });

  it('should not extend block quote when position is start offset', () => {
    mde.setMarkdown('> block');
    mde.setSelection([1, 1], [1, 1]);

    forceKeymapFn('blockQuote', 'extendBlockQuote');

    expect(getTextContent(mde)).toBe('> block');
  });

  it('should undo extend the block quote properly', () => {
    const input = '> block\nparagraph';
    const result = '<blockquote><p>block<br>paragraph</p></blockquote>';

    mde.setMarkdown(input);
    mde.setSelection([1, 6], [1, 6]);

    forceKeymapFn('blockQuote', 'extendBlockQuote');

    execUndo();

    expect(getPreviewHTML()).toBe(result);
  });
});

describe('extend list keymap', () => {
  describe('bullet list', () => {
    it('should extend the bullet list', () => {
      const input = source`
        * bullet
      `;
      const result = `${source`
        * bullet
        * 
      `} `;

      mde.setMarkdown(input);
      mde.setSelection([1, 9], [1, 9]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
      assertSelection([
        [2, 3],
        [2, 3],
      ]);
    });

    it('should extend the bullet list with sliced text', () => {
      const input = source`
        * bullet
      `;
      const result = source`
        * bull
        * et
      `;

      mde.setMarkdown(input);
      mde.setSelection([1, 7], [1, 7]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
      assertSelection([
        [2, 3],
        [2, 3],
      ]);
    });

    it('should extend the nested bullet list', () => {
      const input = stripIndent`
        * bullet
          * sub
      `;
      const result = `${source`
        * bullet
          * sub
          * 
      `} `;

      mde.setMarkdown(input);
      mde.setSelection([2, 8], [2, 8]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should extend the bullet list excluding blank line', () => {
      const input = `${source`
        * bullet1
        * bullet2
      `}\n\n`;
      const result = `${source`
        * bullet1
        * bullet2
        * 
      `} \n\n`;

      mde.setMarkdown(input);
      mde.setSelection([2, 10], [2, 10]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should extend the bullet list with task', () => {
      const input = source`
        * [ ] bullet
      `;
      const result = `${source`
        * [ ] bullet
        * [ ] 
      `} `;

      mde.setMarkdown(input);
      mde.setSelection([1, 13], [1, 13]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
      assertSelection([
        [2, 7],
        [2, 7],
      ]);
    });

    it('should not extend the bullet list on multi line selection', () => {
      const input = source`
        * bullet1
        * bullet2
      `;

      mde.setMarkdown(input);
      mde.setSelection([1, 2], [2, 4]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(input);
    });

    it('should delete the row in case of empty bullet list content', () => {
      const input = `${stripIndent`
        * bullet1
        * 
      `} `;
      const result = `${source`
        * bullet1
      `}\n\n`;

      mde.setMarkdown(input);
      mde.setSelection([2, 2], [2, 2]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should delete the row in case of empty bullet task list content', () => {
      const input = `${stripIndent`
        * [ ] bullet1
        * [ ]
      `} `;
      const result = `${source`
        * [ ] bullet1
      `}\n\n`;

      mde.setMarkdown(input);
      mde.setSelection([2, 5], [2, 5]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should not extend list when paragraph includes `* `', () => {
      const input = source`
        just paragraph* bullet
      `;

      mde.setMarkdown(input);
      mde.setSelection([1, 9], [1, 9]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(input);
    });

    it('should delete the row in case of empty bullet list content with next content', () => {
      mde.setMarkdown('* bullet1\n* \nparagraph');
      mde.setSelection([2, 3], [2, 3]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe('* bullet1\n\n\nparagraph');
    });

    it('should undo extend the bullet list properly', () => {
      const input = source`
        * bullet
        paragraph
      `;
      const result = oneLineTrim`
        <ul>
          <li>
            <p>bullet<br>
            paragraph</p>
          </li>
        </ul>
      `;

      mde.setMarkdown(input);
      mde.setSelection([1, 9], [1, 9]);

      forceKeymapFn('listItem', 'extendList');

      execUndo();

      expect(getPreviewHTML()).toBe(result);
    });
  });

  describe('ordered list', () => {
    it('should extend the ordered list', () => {
      const input = source`
        1. ordered
      `;
      const result = `${source`
        1. ordered
        2. 
      `} `;

      mde.setMarkdown(input);
      mde.setSelection([1, 11], [1, 11]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
      assertSelection([
        [2, 4],
        [2, 4],
      ]);
    });

    it('should extend the ordered list with sliced text', () => {
      const input = source`
        1. ordered
      `;
      const result = source`
        1. ord
        2. ered
      `;

      mde.setMarkdown(input);
      mde.setSelection([1, 7], [1, 7]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
      assertSelection([
        [2, 4],
        [2, 4],
      ]);
    });

    it('should reorder the list list in the middle of ordered list', () => {
      const input = source`
        1. ordered1
        2. ordered2
        3. ordered3
      `;
      const result = source`
        1. ordered1
        2. 
        3. ordered2
        4. ordered3
      `;

      mde.setMarkdown(input);
      mde.setSelection([1, 12], [1, 12]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should extend the nested ordered list', () => {
      const input = stripIndent`
        1. ordered1
            1. sub1
            2. sub2
        2. ordered2
        3. ordered3
      `;
      const result = stripIndent`
        1. ordered1
            1. sub1
            2. 
            3. sub2
        2. ordered2
        3. ordered3
      `;

      mde.setMarkdown(input);
      mde.setSelection([2, 12], [2, 12]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should extend the ordered list on ordered paragraph(not ordered list)', () => {
      const input = stripIndent`
        1. ordered1
            2. sub1
            3. sub2
        2. ordered2
        3. ordered3
      `;
      const result = stripIndent`
        1. ordered1
            2. sub1
            3. 
            4. sub2
        2. ordered2
        3. ordered3
      `;

      mde.setMarkdown(input);
      mde.setSelection([2, 12], [2, 12]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should extend the ordered list with task', () => {
      const input = source`
        1. [ ] ordered
      `;
      const result = `${source`
        1. [ ] ordered
        2. [ ]
      `} `;

      mde.setMarkdown(input);
      mde.setSelection([1, 15], [1, 15]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
      assertSelection([
        [2, 8],
        [2, 8],
      ]);
    });

    it('should not extend the ordered list on multi line selection', () => {
      const input = source`
        1. ordered1
        2. ordered2
      `;

      mde.setMarkdown(input);
      mde.setSelection([1, 2], [2, 5]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(input);
    });

    it('should extend the ordered list excluding blank line', () => {
      const input = `${source`
        1. ordered1
        2. ordered2
      `}\n\n`;
      const result = `${source`
        1. ordered1
        2. ordered2
        3.  
      `} \n\n`;

      mde.setMarkdown(input);
      mde.setSelection([2, 12], [2, 12]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should delete the row in case of empty ordered list content', () => {
      const input = `${source`
        1. ordered1
        2. 
      `} `;
      const result = `${source`
        1. ordered1 
      `}\n\n`;

      mde.setMarkdown(input);
      mde.setSelection([2, 2], [2, 2]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should delete the row in case of empty ordered task list content', () => {
      const input = `${stripIndent`
        1. [ ] ordered1
        2. [ ]
      `} `;
      const result = `${source`
        1. [ ] ordered1
      `}\n\n`;

      mde.setMarkdown(input);
      mde.setSelection([2, 6], [2, 6]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });

    it('should extend the ordered list with below bullet list', () => {
      const input = source`
        1. ordered1
        2. ordered2

        * bullet1
        * bullet2
      `;
      const result = source`
        1. ordered1
        2. ordered2
        3. 

        * bullet1
        * bullet2
      `;

      mde.setMarkdown(input);
      mde.setSelection([2, 12], [2, 12]);

      forceKeymapFn('listItem', 'extendList');

      expect(getTextContent(mde)).toBe(result);
    });
  });
});

describe('toggle task list keymap', () => {
  it('should toggle single bullet task list state', () => {
    const input = source`
      * [ ] task1
    `;
    const result = source`
      * [x] task1
    `;

    mde.setMarkdown(input);
    mde.setSelection([1, 6], [1, 6]);

    forceKeymapFn('listItem', 'toggleTask');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should toggle multi bullet task list state', () => {
    const input = source`
      * [ ] task1
      * [x] task2
    `;
    const result = source`
      * [x] task1
      * [ ] task2
    `;

    mde.setMarkdown(input);
    mde.setSelection([1, 6], [2, 2]);

    forceKeymapFn('listItem', 'toggleTask');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should toggle single ordered task list state', () => {
    const input = source`
      1. [ ] task1
    `;
    const result = source`
      1. [x] task1
    `;

    mde.setMarkdown(input);
    mde.setSelection([1, 6], [1, 6]);

    forceKeymapFn('listItem', 'toggleTask');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should toggle multi ordered task list state', () => {
    const input = source`
      1. [ ] task1
      2. [x] task2
    `;
    const result = source`
      1. [x] task1
      2. [ ] task2
    `;

    mde.setMarkdown(input);
    mde.setSelection([1, 6], [2, 2]);

    forceKeymapFn('listItem', 'toggleTask');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should toggle nested task list state', () => {
    const input = stripIndent`
      1. [x] task1
      2. [ ] task2
        * [x] sub-task1
        * [x] sub-task2
          1. [ ] sub-task3

    `;
    const result = stripIndent`
      1. [ ] task1
      2. [x] task2
        * [ ] sub-task1
        * [ ] sub-task2
          1. [x] sub-task3

    `;

    mde.setMarkdown(input);
    mde.setSelection([1, 6], [5, 6]);

    forceKeymapFn('listItem', 'toggleTask');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should remain unchanged on non task list', () => {
    const input = source`
      1. task1
        * sub-task1
    `;

    mde.setMarkdown(input);
    mde.setSelection([1, 6], [2, 2]);

    forceKeymapFn('listItem', 'toggleTask');

    expect(getTextContent(mde)).toBe(input);
  });
});

describe('delete lines keymap', () => {
  it('should delete the single line', () => {
    const input = stripIndent`
      aaaa
      bbbb
    `;
    const result = '\nbbbb';

    mde.setMarkdown(input);
    mde.setSelection([1, 1], [1, 1]);

    forceKeymapFn('paragraph', 'deleteLines');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should delete the multi lines', () => {
    const input = stripIndent`
      aaaa
      bbbb
      cccc
    `;
    const result = '\ncccc';

    mde.setMarkdown(input);
    mde.setSelection([1, 1], [2, 1]);

    forceKeymapFn('paragraph', 'deleteLines');

    expect(getTextContent(mde)).toBe(result);
  });
});

describe('move lines keymap', () => {
  it('should move down the single line', () => {
    const input = stripIndent`
      aaaa
      bbbb
      cccc
    `;
    const result = stripIndent`
      bbbb
      aaaa
      cccc
    `;

    mde.setMarkdown(input);
    mde.setSelection([1, 1], [1, 1]);

    forceKeymapFn('paragraph', 'moveDown');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should move down the multi lines', () => {
    const input = stripIndent`
      aaaa
      bbbb
      cccc
    `;
    const result = stripIndent`
      cccc
      aaaa
      bbbb
    `;

    mde.setMarkdown(input);
    mde.setSelection([1, 1], [2, 1]);

    forceKeymapFn('paragraph', 'moveDown');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should not move lines when the selection includes last line', () => {
    const input = stripIndent`
      aaaa
      bbbb
      cccc
    `;
    const result = stripIndent`
      aaaa
      bbbb
      cccc
    `;

    mde.setMarkdown(input);
    mde.setSelection([2, 1], [3, 1]);

    forceKeymapFn('paragraph', 'moveDown');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should move up the single line', () => {
    const input = stripIndent`
      aaaa
      bbbb
      cccc
    `;
    const result = stripIndent`
      bbbb
      aaaa
      cccc
    `;

    mde.setMarkdown(input);
    mde.setSelection([2, 1], [2, 1]);

    forceKeymapFn('paragraph', 'moveUp');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should move up the multi lines', () => {
    const input = stripIndent`
      aaaa
      bbbb
      cccc
    `;
    const result = stripIndent`
      bbbb
      cccc
      aaaa
    `;

    mde.setMarkdown(input);
    mde.setSelection([2, 1], [3, 1]);

    forceKeymapFn('paragraph', 'moveUp');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should not move lines when the selection includes first line', () => {
    const input = stripIndent`
      aaaa
      bbbb
      cccc
    `;
    const result = stripIndent`
      aaaa
      bbbb
      cccc
    `;

    mde.setMarkdown(input);
    mde.setSelection([1, 1], [2, 1]);

    forceKeymapFn('paragraph', 'moveUp');

    expect(getTextContent(mde)).toBe(result);
  });
});

/* eslint-disable no-irregular-whitespace */
describe('keep indentation in code block', () => {
  it('should keep indentation in next new line', () => {
    const input = stripIndent`
    \`\`\`js
    console.log('line1');
        console.log('line2');
    \`\`\`
    `;

    const result = stripIndent`
    \`\`\`js
    console.log('line1');
        console.log('line2');
        
    \`\`\`
    `;

    mde.setMarkdown(input);
    mde.setSelection([3, 26], [3, 26]);

    forceKeymapFn('codeBlock', 'keepIndentation');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should keep indentation with sliced text', () => {
    const input = stripIndent`
      \`\`\`js
      console.log('line1');
          console.log('line2');
      \`\`\`
    `;
    const result = stripIndent`
      \`\`\`js
      console.log('line1');
          console.log('li
          ne2');
      \`\`\`
    `;

    mde.setMarkdown(input);
    mde.setSelection([3, 20], [3, 20]);

    forceKeymapFn('codeBlock', 'keepIndentation');

    expect(getTextContent(mde)).toBe(result);
  });

  it('should remain unchanged on multi selection', () => {
    const input = stripIndent`
      \`\`\`js
      console.log('line1');
          console.log('line2');
      \`\`\`
    `;

    mde.setMarkdown(input);
    mde.setSelection([2, 3], [3, 10]);

    forceKeymapFn('codeBlock', 'keepIndentation');

    expect(getTextContent(mde)).toBe(input);
  });

  it('should undo extend the code block properly', () => {
    const input = stripIndent`
      \`\`\`js
      console.log('line1');
          console.log('line2');
      \`\`\`
    `;
    const result = oneLineTrim`
      <pre class="lang-js">
        <code data-language="js">
          console.log('line1');
              console.log('line2');
        </code>
      </pre>
    `;

    mde.setMarkdown(input);
    mde.setSelection([3, 20], [3, 20]);

    forceKeymapFn('codeBlock', 'keepIndentation');

    execUndo();

    expect(getPreviewHTML()).toBe(result);
  });
});
/* eslint-enable no-irregular-whitespace */

// @TODO: should move key event test case to e2e test
describe('default keymap', () => {
  it('should delete the blank line properly when pressing the backspace key', () => {
    mde.setMarkdown('# myText\n\ntest');
    mde.setSelection([3, 1], [3, 1]);

    forceBackspaceKeymap();

    expect(getPreviewHTML()).toBe('<h1>myText</h1><p>test</p>');
  });
});

describe('useCommandShortcut option', () => {
  it('should not make keymaps with history command when the value is false', () => {
    const spy = jest.spyOn(keymaps, 'keymap');

    const useCommandShortcut = false;
    const history = {
      'Mod-z': undo,
      'Shift-Mod-z': redo,
    };

    mde.createKeymaps(useCommandShortcut);

    expect(spy).not.toHaveBeenCalledWith(history);
  });
});
