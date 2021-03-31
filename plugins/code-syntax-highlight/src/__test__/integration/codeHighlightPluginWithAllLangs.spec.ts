import { source } from 'common-tags';

import Editor from '@toast-ui/editor';
import codeSyntaxHighlightPlugin from '@/indexAll';

describe('codeSyntaxHighlightPlugin', () => {
  let container: HTMLElement, mdPreview: HTMLElement, wwEditor: HTMLElement, editor: Editor;

  const initialValue = source`
    \`\`\`yaml
    martin:
      name: Martin D'vloper
      job: Developer
      skill: Elite
    \`\`\`
  `;

  function getPreviewHTML() {
    return mdPreview
      .querySelector('.toastui-editor-contents')!
      .innerHTML.replace(/\sdata-nodeid="\d+"|\n/g, '')
      .trim();
  }

  function getWwEditorHTML() {
    return wwEditor.firstElementChild!.innerHTML;
  }

  beforeEach(() => {
    container = document.createElement('div');
    editor = new Editor({
      el: container,
      previewStyle: 'vertical',
      initialValue,
      plugins: [codeSyntaxHighlightPlugin],
    });

    const elements = editor.getEditorElements();

    mdPreview = elements.mdPreview!;
    wwEditor = elements.wwEditor!;

    document.body.appendChild(container);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  it('should render highlighted codeblock element in markdown preview', () => {
    const previewHTML = getPreviewHTML();

    expect(previewHTML).toMatchSnapshot();
  });

  it('should render highlighted codeblock element in wysiwyg', () => {
    editor.changeMode('wysiwyg');

    const wwEditorHTML = getWwEditorHTML();

    expect(wwEditorHTML).toMatchSnapshot();
  });
});
