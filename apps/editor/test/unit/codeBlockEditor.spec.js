/**
 * @fileoverview test code block editor
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
/* eslint new-cap:0 */
import CodeBlockEditor from '../../src/js/codeBlockEditor';

describe('CodeBlockEditor', () => {
  let codeBlockEditor, pre;

  beforeEach(() => {
    pre = document.createElement('pre');
    const container = document.createElement('div');
    codeBlockEditor = new CodeBlockEditor(container);
  });

  it('should load code from given code block element', () => {
    pre.innerHTML = '<div>a<br/></div><div>code</div><div>block<br/></div>';

    codeBlockEditor.load(pre);

    expect(codeBlockEditor.getEditorCodeText()).toEqual('a\ncode\nblock');
  });

  it('should save code to given code block element', () => {
    codeBlockEditor.setEditorCodeText('some\ncode');

    codeBlockEditor.save(pre);

    expect(pre.innerHTML).toEqual('<div>some</div><div>code</div>');
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
