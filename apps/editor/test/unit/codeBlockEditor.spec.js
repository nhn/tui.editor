/**
 * @fileoverview test code block editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
/* eslint new-cap:0 */
import CodeBlockEditor from '@/codeBlockEditor';
import EventManager from '@/eventManager';

describe('CodeBlockEditor', () => {
  let codeBlockEditor, pre;

  beforeEach(() => {
    pre = document.createElement('pre');
    const container = document.createElement('div');

    const eventManager = new EventManager();

    codeBlockEditor = new CodeBlockEditor(container, eventManager);
  });

  it('should load code as same text of code block element', () => {
    pre.innerHTML = 'a\ncode\nblock';

    codeBlockEditor.load(pre);

    expect(codeBlockEditor.getEditorCodeText()).toEqual('a\ncode\nblock');
  });

  it('should save code as same text to code block element', () => {
    codeBlockEditor.setEditorCodeText('some\ncode');

    codeBlockEditor.save(pre);

    expect(pre.innerHTML).toEqual('some\ncode');
  });

  it('should load language from given code block element', () => {
    pre.setAttribute('data-language', 'javascript');

    codeBlockEditor.load(pre);

    expect(codeBlockEditor.getLanguage()).toEqual('javascript');
  });

  it('should save language to given code block element', () => {
    codeBlockEditor.setLanguage('java');

    codeBlockEditor.save(pre);

    expect(pre.getAttribute('data-language')).toEqual('java');
  });
});
