// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';
import CommandManager from '@/commands/commandManager';
import { nbspToSpace } from '@/markdown/helper/manipulation';

function getTextContent(editor: MarkdownEditor) {
  const { doc } = editor.view.state;
  const docSize = doc.content.size;
  let text = '';

  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    if (node.isText) {
      text += node.text!.slice(Math.max(0, pos) - pos, docSize - pos);
    } else if (node.isBlock && pos > 0) {
      text += '\n';
    }
  });

  return nbspToSpace(text);
}

let mde: MarkdownEditor, em: EventEmitter, cmd: CommandManager, container: HTMLElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  em = new EventEmitter();
  mde = new MarkdownEditor(container, new ToastMark(), em);
  cmd = new CommandManager(em, mde.commands, {});
});

afterEach(() => {
  document.body.removeChild(container);
});

describe('bold command', () => {
  it('should add bold syntax', () => {
    mde.setMarkdown('bold');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'bold');

    expect(getTextContent(mde)).toEqual('**bold**');
  });

  it('should remove bold syntax', () => {
    mde.setMarkdown('**bold**');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'bold');

    expect(getTextContent(mde)).toEqual('bold');
  });
});

describe('italic command', () => {
  it('should add italic syntax', () => {
    mde.setMarkdown('italic');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'italic');

    expect(getTextContent(mde)).toEqual('*italic*');
  });

  it('should remove italic syntax', () => {
    mde.setMarkdown('*italic*');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'italic');

    expect(getTextContent(mde)).toEqual('italic');
  });
});

describe('strike command', () => {
  it('should add strike syntax', () => {
    mde.setMarkdown('strike');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'strike');

    expect(getTextContent(mde)).toEqual('~~strike~~');
  });

  it('should remove strike syntax', () => {
    mde.setMarkdown('~~strike~~');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'strike');

    expect(getTextContent(mde)).toEqual('strike');
  });
});

describe('code command', () => {
  it('should add code syntax', () => {
    mde.setMarkdown('code');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'code');

    expect(getTextContent(mde)).toEqual('`code`');
  });

  it('should remove code syntax', () => {
    mde.setMarkdown('`code`');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'code');

    expect(getTextContent(mde)).toEqual('code');
  });
});

describe('blockQuote command', () => {
  it('should add blockQuote syntax', () => {
    mde.setMarkdown('blockQuote');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toEqual('> blockQuote');
  });

  it('should add blockQuote syntax on empty node', () => {
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toEqual('> ');
  });

  it('should remove blockQuote syntax', () => {
    mde.setMarkdown('> blockQuote');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toEqual('blockQuote');
  });

  it('should add blockQuote syntax on multi line', () => {
    mde.setMarkdown('blockQuote\ntext');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toEqual('> blockQuote\n> text');
  });

  it('should remove unnecessary space when adding the blockQuote syntax', () => {
    mde.setMarkdown('  blockQuote');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toEqual('> blockQuote');
  });

  it('should remove unnecessary space when removing the blockQuote syntax', () => {
    mde.setMarkdown('>   blockQuote');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'blockQuote');

    expect(getTextContent(mde)).toEqual('blockQuote');
  });
});

describe('hr command', () => {
  it('should add thematicBreak(hr) syntax', () => {
    cmd.exec('markdown', 'hr');

    expect(getTextContent(mde)).toEqual('\n***\n');
  });

  it('should split the paragraph when adding thematicBreak(hr) syntax', () => {
    mde.setMarkdown('paragraph');

    mde.setSelection([1, 2], [1, 4]);
    cmd.exec('markdown', 'hr');

    expect(getTextContent(mde)).toEqual('pa\n***\ngraph');
  });
});

describe('addImage command', () => {
  it('should add image syntax', () => {
    cmd.exec('markdown', 'addImage', { altText: 'image', imageUrl: 'https://picsum.photos/200' });

    expect(getTextContent(mde)).toEqual('![image](https://picsum.photos/200)');
  });

  it('should escape image altText', () => {
    cmd.exec('markdown', 'addImage', {
      altText: 'mytext ()[]<>',
      imageUrl: 'https://picsum.photos/200'
    });

    expect(getTextContent(mde)).toEqual('![mytext \\(\\)\\[\\]\\<\\>](https://picsum.photos/200)');
  });

  it('should encode image url', () => {
    cmd.exec('markdown', 'addImage', {
      altText: 'image',
      imageUrl: 'myurl ()[]<>'
    });

    expect(getTextContent(mde)).toEqual('![image](myurl %28%29%5B%5D%3C%3E)');
  });
});

describe('addLink command', () => {
  it('should add link syntax', () => {
    cmd.exec('markdown', 'addLink', { linkText: 'TOAST UI', linkUrl: 'https://ui.toast.com' });

    expect(getTextContent(mde)).toEqual('[TOAST UI](https://ui.toast.com)');
  });

  it('should escape link Text', () => {
    cmd.exec('markdown', 'addLink', {
      linkText: 'mytext ()[]<>',
      linkUrl: 'https://ui.toast.com'
    });

    expect(getTextContent(mde)).toEqual('[mytext \\(\\)\\[\\]\\<\\>](https://ui.toast.com)');
  });

  it('should encode link url', () => {
    cmd.exec('markdown', 'addLink', {
      linkText: 'TOAST UI',
      linkUrl: 'myurl ()[]<>'
    });

    expect(getTextContent(mde)).toEqual('[TOAST UI](myurl %28%29%5B%5D%3C%3E)');
  });
});

describe('heading command', () => {
  it('should add heading syntax', () => {
    mde.setMarkdown('heading');
    cmd.exec('markdown', 'heading', { level: 1 });

    expect(getTextContent(mde)).toEqual('# heading');
  });

  it('should add heading syntax on empty node', () => {
    cmd.exec('markdown', 'heading', { level: 1 });

    expect(getTextContent(mde)).toEqual('# ');
  });

  it('should maintain the heading syntax on same heading level', () => {
    mde.setMarkdown('## heading2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'heading', { level: 2 });

    expect(getTextContent(mde)).toEqual('## heading2');
  });

  it('should change the heading syntax on different heading level', () => {
    mde.setMarkdown('## heading2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'heading', { level: 1 });

    expect(getTextContent(mde)).toEqual('# heading2');
  });

  it('should add heading syntax on multi line', () => {
    mde.setMarkdown('heading1\n# heading2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'heading', { level: 2 });

    expect(getTextContent(mde)).toEqual('## heading1\n## heading2');
  });
});

describe('codeBlock command', () => {
  it('should add code block syntax', () => {
    cmd.exec('markdown', 'codeBlock');

    expect(getTextContent(mde)).toEqual('```\n\n```');
  });

  it('should wrap the selection with code block syntax', () => {
    mde.setMarkdown(`console.log('codeBlock');`);

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'codeBlock');

    expect(getTextContent(mde)).toEqual("```\nconsole.log('codeBlock');\n```");
  });
});

describe('ul command', () => {
  it('should add bullet list syntax', () => {
    cmd.exec('markdown', 'ul');

    expect(getTextContent(mde)).toEqual('* ');
  });

  it('should add bullet list syntax on multi line', () => {
    mde.setMarkdown('bullet1\nbullet2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'ul');

    expect(getTextContent(mde)).toEqual('* bullet1\n* bullet2');
  });

  it('should change ordered list to bullet list', () => {
    mde.setMarkdown('1. ordered1\n2. ordered2\n3. ordered3');

    mde.setSelection([2, 1], [2, 1]);
    cmd.exec('markdown', 'ul');

    expect(getTextContent(mde)).toEqual('* ordered1\n* ordered2\n* ordered3');
  });

  it('should change ordered list to bullet list with depth', () => {
    mde.setMarkdown('1. ordered1\n2. ordered2\n3. ordered3\n   1. sub1\n   1. sub2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'ul');

    expect(getTextContent(mde)).toEqual('* ordered1\n* ordered2\n* ordered3\n   * sub1\n   * sub2');
  });
});

describe('ol command', () => {
  it('should add ordered list syntax', () => {
    cmd.exec('markdown', 'ol');

    expect(getTextContent(mde)).toEqual('1. ');
  });

  it('should add ordered list syntax on multi line', () => {
    mde.setMarkdown('ordered1\nordered2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'ol');

    expect(getTextContent(mde)).toEqual('1. ordered1\n2. ordered2');
  });

  it('should change bullet list to ordered list', () => {
    mde.setMarkdown('* bullet1\n* bullet2\n* bullet3');

    mde.setSelection([2, 1], [2, 1]);
    cmd.exec('markdown', 'ol');

    expect(getTextContent(mde)).toEqual('1. bullet1\n2. bullet2\n3. bullet3');
  });

  it('should change bullet list to ordered list with depth', () => {
    mde.setMarkdown('* bullet1\n* bullet2\n* bullet3\n   * sub1\n   * sub2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'ol');

    expect(getTextContent(mde)).toEqual(
      '1. bullet1\n2. bullet2\n3. bullet3\n   1. sub1\n   2. sub2'
    );
  });
});

describe('task command', () => {
  it('should add task list syntax', () => {
    cmd.exec('markdown', 'task');

    expect(getTextContent(mde)).toEqual('* [ ] ');
  });

  it('should add task list syntax on multi line', () => {
    mde.setMarkdown('task1\ntask2');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'task');

    expect(getTextContent(mde)).toEqual('* [ ] task1\n* [ ] task2');
  });

  it('should add task syntax to ordered list', () => {
    mde.setMarkdown('1. ordered1\n2. ordered2\n3. ordered3');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'task');

    expect(getTextContent(mde)).toEqual('1. [ ] ordered1\n2. [ ] ordered2\n3. [ ] ordered3');
  });

  it('should add task syntax to bullet list', () => {
    mde.setMarkdown('* bullet1\n* bullet2\n* bullet3');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'task');

    expect(getTextContent(mde)).toEqual('* [ ] bullet1\n* [ ] bullet2\n* [ ] bullet3');
  });

  it('should remove task syntax on ordered task list', () => {
    mde.setMarkdown('1. [ ] ordered1\n2. [ ] ordered2\n3. [ ] ordered3');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'task');

    expect(getTextContent(mde)).toEqual('1. ordered1\n2. ordered2\n3. ordered3');
  });

  it('should remove task syntax on bullet task list', () => {
    mde.setMarkdown('* [ ] bullet1\n* [ ] bullet2\n* [ ] bullet3');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'task');

    expect(getTextContent(mde)).toEqual('* bullet1\n* bullet2\n* bullet3');
  });
});

describe('table command', () => {
  it('should add table syntax', () => {
    cmd.exec('markdown', 'table', { colLen: 2, rowLen: 3 });

    expect(getTextContent(mde)).toEqual('\n|  |  |\n| --- | --- |\n|  |  |\n|  |  |');
  });

  it('should add table syntax to next line', () => {
    mde.setMarkdown('text');

    cmd.exec('markdown', 'selectAll');
    cmd.exec('markdown', 'table', { colLen: 2, rowLen: 3 });

    expect(getTextContent(mde)).toEqual('text\n|  |  |\n| --- | --- |\n|  |  |\n|  |  |');
  });
});
