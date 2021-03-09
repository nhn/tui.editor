import { source, oneLineTrim } from 'common-tags';

// @TODO change import editor build file
// @ts-ignore
import { Editor } from '@toast-ui/editor';
import codeSyntaxHighlightPlugin from '@/index';

import hljs from 'highlight.js';

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
      plugins: [[codeSyntaxHighlightPlugin, { hljs }]],
    });

    const elements = editor.getEditorElements();

    mdPreview = elements.mdPreview!;
    wwEditor = elements.wwEditor!;

    container.append(mdPreview!);
    container.append(wwEditor!);

    document.body.appendChild(container);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  it('should render highlighted codeblock element in markdown preview', () => {
    const expected = oneLineTrim`
      <pre class="lang-javascript">
        <code data-language="javascript">
          <span class="hljs-keyword">const</span> a = <span class="hljs-number">100</span>;
        </code>
      </pre>
    `;

    expect(getPreviewHTML()).toBe(expected);
  });

  it('should render highlighted codeblock element in wysiwyg', () => {
    editor.changeMode('wysiwyg');

    const expected = oneLineTrim`
      <div data-language="javascript" class="tui-editor-ww-code-block">
        <pre class="lang-javascript">
          <code data-language="javascript">
            <span class="hljs-keyword">const</span> a = <span class="hljs-number">100</span>;
          </code>
        </pre>
      </div>
    `;

    expect(getPreviewHTML()).toBe(expected);
  });
});
