import { source, oneLineTrim } from 'common-tags';

import { Editor } from '@toast-ui/editor';
import codeSyntaxHighlightPlugin from '@/index';

import Prism from 'prismjs';
// @TODO import to all languages importing file

describe('codeSyntaxHighlightPlugin', () => {
  let container: HTMLElement, mdPreview: HTMLElement, wwEditor: HTMLElement, editor: Editor;

  const initialValue = source`
    \`\`\`javascript
    const a = 100;
    \`\`\`
  `;

  function getPreviewHTML() {
    return mdPreview
      .querySelector('.tui-editor-contents')!
      .innerHTML.replace(/\sdata-nodeid="\d+"|\n/g, '')
      .trim();
  }

  beforeEach(() => {
    container = document.createElement('div');
    editor = new Editor({
      el: container,
      previewStyle: 'vertical',
      initialValue,
      plugins: [[codeSyntaxHighlightPlugin, { prism: Prism }]],
    });

    const elements = editor.getEditorElements();

    mdPreview = elements.mdPreview!;
    wwEditor = elements.wwEditor!;

    container.append(mdPreview);
    container.append(wwEditor);

    document.body.appendChild(container);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  it('should render highlighted codeblock element in markdown preview', () => {
    const expected = oneLineTrim`
      <pre class="lang-js">
        <code data-language="js">
          <span class="token keyword">const</span> a <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>
        </code>
      </pre>
    `;

    expect(getPreviewHTML()).toBe(expected);
  });

  it('should render highlighted codeblock element in wysiwyg', () => {
    editor.changeMode('wysiwyg');

    const expected = oneLineTrim`
      <div data-language="js" class="tui-editor-ww-code-block-highlight">
        <pre class="lang-js language-js">
          <code data-language="js" class="language-js">
            <span class="token keyword">const</span> a <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>
          </code>
        </pre>
      </div>
    `;

    expect(wwEditor).toBe(expected);
  });
});
