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
