import { oneLineTrim } from 'common-tags';
import Editor from '@/editorCore';

describe('widgetNode', () => {
  let container: HTMLElement,
    mdEditor: HTMLElement,
    mdPreview: HTMLElement,
    wwEditor: HTMLElement,
    editor: Editor;

  function getEditorHTML() {
    return mdEditor.querySelector('.ProseMirror')!.innerHTML.trim();
  }

  function getPreviewHTML() {
    return mdPreview
      .querySelector('.tui-editor-contents')!
      .innerHTML.replace(/\sdata-nodeid="\d{1,}"/g, '')
      .trim();
  }

  function getWwEditorHTML() {
    return wwEditor.querySelector('.ProseMirror')!.innerHTML.trim();
  }

  beforeEach(() => {
    container = document.createElement('div');
    editor = new Editor({
      el: container,
      widgetRules: [
        {
          rule: /@\S+/,
          toDOM(text) {
            const span = document.createElement('span');

            span.innerHTML = `<a href="www.google.com">${text}</a>`;
            return span;
          },
        },
        {
          rule: /\[(#\S+)\]\((\S+)\)/,
          toDOM: (text) => {
            const rule = /\[(#\S+)\]\((\S+)\)/;
            const matched = text.match(rule)!;
            const span = document.createElement('span');

            span.innerHTML = `<a href="${matched[2]}">${matched[1]}</a>`;

            return span;
          },
        },
      ],
      previewStyle: 'vertical',
    });

    const elements = editor.getEditorElements();

    mdEditor = elements.mdEditor;
    mdPreview = elements.mdPreview!;
    wwEditor = elements.wwEditor!;

    container.append(mdEditor);
    container.append(mdPreview!);
    container.append(wwEditor!);

    document.body.appendChild(container);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(container);
  });

  describe('in markdown', () => {
    it('should render widget node in the editor and preview using replaceWithWidget API', () => {
      editor.setMarkdown('abc');
      editor.replaceWithWidget([1, 1], [1, 3], '@test');

      const expectedEditor = oneLineTrim`
        <div>
          <span class="tui-widget">
            <span><a href="www.google.com">@test</a></span>
          </span>
          c
        </div>
      `;
      const expectedPreview = oneLineTrim`
        <p>
          <span class="tui-widget">
            <span><a href="www.google.com">@test</a></span>
          </span>
          c
        </p>
      `;

      expect(getEditorHTML()).toBe(expectedEditor);
      expect(getPreviewHTML()).toBe(expectedPreview);
    });

    it('should render widget node in the editor and preview using setMarkdown API', () => {
      editor.setMarkdown('@test1 @test2');

      const expectedEditor = oneLineTrim`
        <div>
          <span class="tui-widget">
            <span><a href="www.google.com">@test1</a></span>
          </span> 
          <span class="tui-widget">
            <span>
              <a href="www.google.com">@test2</a>
            </span>
          </span>
          <br>
        </div>
      `;
      const expectedPreview = oneLineTrim`
        <p>
          <span class="tui-widget">
            <span>
              <a href="www.google.com">@test1</a>
            </span>
          </span> 
          <span class="tui-widget">
            <span><a href="www.google.com">@test2</a></span>
          </span>
        </p>
      `;

      expect(getEditorHTML()).toBe(expectedEditor);
      expect(getPreviewHTML()).toBe(expectedPreview);
    });

    it('should render widget node in the editor and preview using insertText API', () => {
      editor.insertText('@test1 @test2');

      const expectedEditor = oneLineTrim`
        <div>
          <span class="tui-widget">
            <span><a href="www.google.com">@test1</a></span>
          </span> 
          <span class="tui-widget">
            <span>
              <a href="www.google.com">@test2</a>
            </span>
          </span>
          <br>
        </div>
      `;
      const expectedPreview = oneLineTrim`
        <p>
          <span class="tui-widget">
            <span>
              <a href="www.google.com">@test1</a>
            </span>
          </span> 
          <span class="tui-widget">
            <span><a href="www.google.com">@test2</a></span>
          </span>
        </p>
      `;

      expect(getEditorHTML()).toBe(expectedEditor);
      expect(getPreviewHTML()).toBe(expectedPreview);
    });

    it('should render widget node with markdown text', () => {
      editor.replaceWithWidget([1, 1], [1, 1], '[#toast](ui.toast.com)');

      const expectedEditor = oneLineTrim`
        <div>
          <span class="tui-widget">
            <span><a href="ui.toast.com">#toast</a></span>
          </span>
          <br>
        </div>
      `;
      const expectedPreview = oneLineTrim`
        <p>
          <span class="tui-widget">
            <span><a href="ui.toast.com">#toast</a></span>
          </span>
        </p>
      `;

      expect(getEditorHTML()).toBe(expectedEditor);
      expect(getPreviewHTML()).toBe(expectedPreview);
    });

    it('should render widget node using all widget rules', () => {
      editor.insertText('@test1 [#toast](ui.toast.com) @test2');

      const expectedEditor = oneLineTrim`
        <div>
          <span class="tui-widget">
            <span><a href="www.google.com">@test1</a></span>
          </span> 
          <span class="tui-widget">
            <span><a href="ui.toast.com">#toast</a></span>
          </span> 
          <span class="tui-widget">
            <span>
              <a href="www.google.com">@test2</a>
            </span>
          </span>
          <br>
        </div>
      `;
      const expectedPreview = oneLineTrim`
        <p>
          <span class="tui-widget">
            <span>
              <a href="www.google.com">@test1</a>
            </span>
          </span> 
          <span class="tui-widget">
            <span><a href="ui.toast.com">#toast</a></span>
          </span> 
          <span class="tui-widget">
            <span><a href="www.google.com">@test2</a></span>
          </span>
        </p>
      `;

      expect(getEditorHTML()).toBe(expectedEditor);
      expect(getPreviewHTML()).toBe(expectedPreview);
    });

    it('should convert to wysiwyg properly', () => {
      editor.setMarkdown('@test1 @test2');
      editor.changeMode('wysiwyg');

      const expectedEditor = oneLineTrim`
        <p>
          <span class="tui-widget">
            <span><a href="www.google.com">@test1</a></span>
          </span> 
          <span class="tui-widget">
            <span>
              <a href="www.google.com">@test2</a>
            </span>
          </span>
          <br>
        </p>
      `;

      expect(getWwEditorHTML()).toBe(expectedEditor);
    });
  });

  describe('in wysiwyg', () => {
    it('should render widget node in the editor using replaceWithWidget API', () => {
      editor.changeMode('wysiwyg');
      editor.replaceWithWidget(1, 1, '@test');

      const expectedEditor = oneLineTrim`
        <p>
          <span class="tui-widget">
            <span><a href="www.google.com">@test</a></span>
          </span>
          <br>
        </p>
      `;

      expect(getWwEditorHTML()).toBe(expectedEditor);
    });

    it('should render widget node with markdown text', () => {
      editor.changeMode('wysiwyg');
      editor.replaceWithWidget(1, 1, '[#toast](ui.toast.com)');

      const expectedEditor = oneLineTrim`
        <p>
          <span class="tui-widget">
            <span><a href="ui.toast.com">#toast</a></span>
          </span>
          <br>
        </p>
      `;

      expect(getWwEditorHTML()).toBe(expectedEditor);
    });

    it('should convert to markdown properly', () => {
      editor.changeMode('wysiwyg');
      editor.replaceWithWidget(1, 1, '@test1 @test2');
      editor.changeMode('markdown');

      const expectedEditor = oneLineTrim`
        <div>
          <span class="tui-widget">
            <span><a href="www.google.com">@test1</a></span>
          </span> 
          <span class="tui-widget">
            <span>
              <a href="www.google.com">@test2</a>
            </span>
          </span>
          <br>
        </div>
      `;
      const expectedPreview = oneLineTrim`
        <p>
          <span class="tui-widget">
            <span>
              <a href="www.google.com">@test1</a>
            </span>
          </span> 
          <span class="tui-widget">
            <span><a href="www.google.com">@test2</a></span>
          </span>
        </p>
      `;

      expect(getEditorHTML()).toBe(expectedEditor);
      expect(getPreviewHTML()).toBe(expectedPreview);
    });
  });
});
