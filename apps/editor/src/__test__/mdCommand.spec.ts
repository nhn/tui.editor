// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdown/mdEditor';
import EventEmitter from '@/event/eventEmitter';
import CommandManager from '@/commands/commandManager';

function getTextContent(editor: MarkdownEditor) {
  const { doc } = editor.view.state;

  // @ts-ignore
  return doc.content.textBetween(0, doc.content.size, '\n');
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

    expect(getTextContent(mde)).toEqual('>\u00a0');
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

    expect(getTextContent(mde)).toEqual('***\n');
  });

  it('should split the paragraph when adding thematicBreak(hr) syntax', () => {
    mde.setMarkdown('paragraph');

    mde.setSelection([0, 2], [0, 4]);
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
    cmd.exec('markdown', 'addLink', { linkText: 'TOAST UI', url: 'https://ui.toast.com' });

    expect(getTextContent(mde)).toEqual('[TOAST UI](https://ui.toast.com)');
  });

  it('should escape link Text', () => {
    cmd.exec('markdown', 'addLink', {
      linkText: 'mytext ()[]<>',
      url: 'https://ui.toast.com'
    });

    expect(getTextContent(mde)).toEqual('[mytext \\(\\)\\[\\]\\<\\>](https://ui.toast.com)');
  });

  it('should encode link url', () => {
    cmd.exec('markdown', 'addLink', {
      linkText: 'TOAST UI',
      url: 'myurl ()[]<>'
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

    expect(getTextContent(mde)).toEqual('#\u00a0');
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
