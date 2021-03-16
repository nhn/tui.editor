import { oneLineTrim } from 'common-tags';
import Editor from '@/editorCore';
import Viewer from '@/Viewer';
import i18n from '@/i18n/i18n';

describe('editor', () => {
  let container: HTMLElement,
    mdEditor: HTMLElement,
    mdPreview: HTMLElement,
    wwEditor: HTMLElement,
    editor: Editor;

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
      previewHighlight: false,
      widgetRules: [
        {
          rule: /@\S+/,
          toDOM(text) {
            const span = document.createElement('span');

            span.innerHTML = `<a href="www.google.com">${text}</a>`;
            return span;
          },
        },
      ],
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

  describe('instance API', () => {
    it('setPlaceholder()', () => {
      editor.setPlaceholder('Please input text');

      const expected = '<span class="placeholder ProseMirror-widget">Please input text</span>';

      expect(mdEditor).toContainHTML(expected);
      expect(wwEditor).toContainHTML(expected);
    });

    it('changeMode()', () => {
      const spy = jest.fn();

      expect(editor.isMarkdownMode()).toBe(true);
      expect(editor.isWysiwygMode()).toBe(false);

      editor.on('changeMode', spy);
      editor.changeMode('wysiwyg');

      expect(spy).toHaveBeenCalledWith('wysiwyg');
      expect(editor.isMarkdownMode()).toBe(false);
      expect(editor.isWysiwygMode()).toBe(true);
    });

    it('changePreviewStyle()', () => {
      const spy = jest.fn();

      expect(editor.getCurrentPreviewStyle()).toBe('tab');

      editor.on('changePreviewStyle', spy);
      editor.changePreviewStyle('vertical');

      expect(spy).toHaveBeenCalledWith('vertical');
      expect(editor.getCurrentPreviewStyle()).toBe('vertical');
    });

    it('setMarkdown()', () => {
      editor.setMarkdown('# heading');

      expect(mdEditor).toContainHTML(
        '<div><span class="tui-editor-md-heading tui-editor-md-heading1"><span class="tui-editor-md-delimiter">#</span> heading</span></div>'
      );
      expect(getPreviewHTML()).toBe('<h1>heading</h1>');
    });

    it('setHTML()', () => {
      editor.setHTML('<h1>heading</h1>');

      expect(mdEditor).toContainHTML(
        '<div><span class="tui-editor-md-heading tui-editor-md-heading1"><span class="tui-editor-md-delimiter">#</span> heading</span></div>'
      );
      expect(getPreviewHTML()).toBe('<h1>heading</h1>');
    });

    it('reset()', () => {
      editor.setMarkdown('# heading');
      editor.reset();

      expect(mdEditor).not.toContainHTML(
        '<div><span class="tui-editor-md-heading tui-editor-md-heading1"><span class="tui-editor-md-delimiter">#</span> heading</span></div>'
      );
      expect(getPreviewHTML()).toBe('');
    });

    it('setMinHeight()', () => {
      editor.setMinHeight('200px');

      expect(mdEditor).toHaveStyle({ minHeight: '200px' });
      expect(mdPreview).toHaveStyle({ minHeight: '200px' });
      expect(wwEditor).toHaveStyle({ minHeight: '200px' });
    });

    describe('setHeight()', () => {
      it('should set height with pixel option', () => {
        editor.setHeight('300px');

        expect(container).not.toHaveClass('auto-height');
        expect(container).toHaveStyle({ height: '300px' });
        expect(mdEditor).toHaveStyle({ minHeight: '300px' });
        expect(mdPreview).toHaveStyle({ minHeight: '300px' });
        expect(wwEditor).toHaveStyle({ minHeight: '300px' });
      });

      it('should set height with auto option', () => {
        editor.setHeight('auto');

        expect(container).toHaveClass('auto-height');
        expect(container).toHaveStyle({ height: 'auto' });
        expect(mdEditor).toHaveStyle({ minHeight: '300px' });
        expect(mdPreview).toHaveStyle({ minHeight: '300px' });
        expect(wwEditor).toHaveStyle({ minHeight: '300px' });
      });
    });

    it('addWidget()', () => {
      const node = document.createElement('div');

      node.innerHTML = 'widget';

      editor.addWidget(node, 'top');

      expect(document.body).toContainElement(node);

      editor.changeMode('wysiwyg');

      expect(document.body).not.toContainElement(node);
    });

    describe('replaceWithWidget()', () => {
      it('in markdown', () => {
        editor.replaceWithWidget([1, 1], [1, 1], '@test');

        const expectedEditor = oneLineTrim`
          <span class="tui-widget">
            <span><a href="www.google.com">@test</a></span>
          </span>
        `;
        const expectedPreview = oneLineTrim`
          <p>
            <span class="tui-widget">
              <span><a href="www.google.com">@test</a></span>
            </span>
          </p>
        `;

        expect(mdEditor).toContainHTML(expectedEditor);
        expect(getPreviewHTML()).toBe(expectedPreview);
      });

      it('in wysiwyg', () => {
        editor.changeMode('wysiwyg');
        editor.replaceWithWidget(1, 1, '@test');

        const expected = oneLineTrim`
          <span class="tui-widget">
            <span><a href="www.google.com">@test</a></span>
          </span>
        `;

        expect(wwEditor).toContainHTML(expected);
      });
    });

    it('exec()', () => {
      // @ts-ignore
      jest.spyOn(editor.commandManager, 'exec');

      editor.exec('markdown', 'bold');

      // @ts-ignore
      // eslint-disable-next-line no-undefined
      expect(editor.commandManager.exec).toHaveBeenCalledWith('markdown', 'bold', undefined);
    });

    it('addCommand()', () => {
      const handler = jest.fn();

      // @ts-ignore
      jest.spyOn(editor.commandManager, 'addCommand');

      editor.addCommand('markdown', 'custom', handler);

      // @ts-ignore
      expect(editor.commandManager.addCommand).toHaveBeenCalledWith('markdown', 'custom', handler);
    });

    describe('insertText()', () => {
      it('in markdown', () => {
        editor.insertText('test');

        expect(mdEditor).toContainHTML('<div>test</div>');
        expect(getPreviewHTML()).toBe('<p>test</p>');
      });

      it('in wysiwyg', () => {
        editor.changeMode('wysiwyg');
        editor.insertText('test');

        expect(wwEditor).toContainHTML('<p>test</p>');
      });
    });

    describe('setSelection(), getSelection()', () => {
      it('in markdown', () => {
        expect(editor.getSelection()).toEqual([
          [1, 1],
          [1, 1],
        ]);

        editor.setMarkdown('line1\nline2');
        editor.setSelection([1, 2], [2, 4]);

        expect(editor.getSelection()).toEqual([
          [1, 2],
          [2, 4],
        ]);
      });

      it('in wysiwyg', () => {
        editor.changeMode('wysiwyg');

        expect(editor.getSelection()).toEqual([1, 1]);

        editor.setMarkdown('line1\nline2');
        editor.setSelection(2, 8);

        expect(editor.getSelection()).toEqual([2, 8]);
      });
    });

    describe('getSelectedText()', () => {
      beforeEach(() => {
        editor.setMarkdown('line1\nline2');
        editor.setSelection([1, 2], [2, 4]);
      });

      it('in markdown', () => {
        expect(editor.getSelectedText()).toEqual('ine1\nlin');
        expect(editor.getSelectedText([1, 2], [2, 6])).toEqual('ine1\nline2');
      });

      it('in wysiwyg', () => {
        editor.changeMode('wysiwyg');
        editor.setSelection(2, 11);

        expect(editor.getSelectedText()).toEqual('ine1\nlin');
        expect(editor.getSelectedText(2, 13)).toEqual('ine1\nline2');
      });
    });

    describe('replaceSelection()', () => {
      beforeEach(() => {
        editor.setMarkdown('line1\nline2');
        editor.setSelection([1, 2], [2, 4]);
      });

      it('should replace current selection in markdown', () => {
        editor.replaceSelection('Replaced');

        expect(mdEditor).toContainHTML('<div>lReplacede2</div>');
        expect(getPreviewHTML()).toBe('<p>lReplacede2</p>');
      });

      it('should replace current selection in wysiwyg', () => {
        editor.changeMode('wysiwyg');
        editor.setSelection(2, 11);
        editor.replaceSelection('Replaced');

        expect(wwEditor).toContainHTML('<p>lReplacede2</p>');
      });

      it('should replace given selection in markdown', () => {
        editor.replaceSelection('Replaced', [1, 1], [2, 1]);

        expect(mdEditor).toContainHTML('<div>Replacedline2</div>');
        expect(getPreviewHTML()).toBe('<p>Replacedline2</p>');
      });

      it('should replace given selection in wysiwyg', () => {
        editor.changeMode('wysiwyg');
        editor.replaceSelection('Replaced', 1, 7);

        expect(wwEditor).toContainHTML('<p>Replaced</p><p>line2</p>');
      });
    });

    describe('deleteSelection()', () => {
      beforeEach(() => {
        editor.setMarkdown('line1\nline2');
        editor.setSelection([1, 2], [2, 4]);
      });

      it('should delete current selection in markdown', () => {
        editor.deleteSelection();

        expect(mdEditor).toContainHTML('<div>le2</div>');
        expect(getPreviewHTML()).toBe('<p>le2</p>');
      });

      it('should delete current selection in wysiwyg', () => {
        editor.changeMode('wysiwyg');
        editor.setSelection(2, 11);
        editor.deleteSelection();

        expect(wwEditor).toContainHTML('<p>le2</p>');
      });

      it('should delete given selection in markdown', () => {
        editor.deleteSelection([1, 1], [2, 1]);

        expect(mdEditor).toContainHTML('<div>line2</div>');
        expect(getPreviewHTML()).toBe('<p>line2</p>');
      });

      it('should delete given selection in wysiwyg', () => {
        editor.changeMode('wysiwyg');
        editor.deleteSelection(1, 7);

        expect(wwEditor).toContainHTML('<p>line2</p>');
      });
    });

    describe('getRangeOfNode()', () => {
      beforeEach(() => {
        editor.setMarkdown('line1\nline2 **strong**');
        editor.setSelection([2, 10], [2, 12]);
      });

      it('should get the range of the current selected node in markdown', () => {
        const rangeInfo = editor.getRangeInfoOfNode();
        const [start, end] = rangeInfo.range;

        expect(rangeInfo).toEqual({
          range: [
            [2, 7],
            [2, 17],
          ],
          type: 'strong',
        });

        editor.replaceSelection('Replaced', start, end);

        expect(getPreviewHTML()).toBe('<p>line1<br>line2 Replaced</p>');
      });

      it('should get the range of the current selected node in wysiwyg', () => {
        editor.changeMode('wysiwyg');
        editor.setSelection(15, 15);

        const rangeInfo = editor.getRangeInfoOfNode();
        const [start, end] = rangeInfo.range;

        expect(rangeInfo).toEqual({ range: [14, 20], type: 'strong' });

        editor.replaceSelection('Replaced', start, end);

        expect(wwEditor).toContainHTML('<p>line1</p><p>line2 Replaced</p>');
      });

      it('should get the range of selection with given position in markdown', () => {
        const rangeInfo = editor.getRangeInfoOfNode([2, 2]);
        const [start, end] = rangeInfo.range;

        expect(rangeInfo).toEqual({
          range: [
            [2, 1],
            [2, 7],
          ],
          type: 'text',
        });

        editor.replaceSelection('Replaced', start, end);

        expect(getPreviewHTML()).toBe('<p>line1<br>Replaced<strong>strong</strong></p>');
      });

      it('should get the range of selection with given position in wysiwyg', () => {
        editor.changeMode('wysiwyg');

        const rangeInfo = editor.getRangeInfoOfNode(10);
        const [start, end] = rangeInfo.range;

        expect(rangeInfo).toEqual({ range: [8, 14], type: 'text' });

        editor.replaceSelection('Replaced', start, end);

        expect(wwEditor).toContainHTML('<p>line1</p><p>Replaced<strong>strong</strong></p>');
      });
    });
  });

  describe('static API', () => {
    it('factory()', () => {
      const editorInst = Editor.factory({ el: document.createElement('div'), viewer: false });
      const viewerInst = Editor.factory({ el: document.createElement('div'), viewer: true });

      expect(editorInst).toBeInstanceOf(Editor);
      expect(viewerInst).toBeInstanceOf(Viewer);
    });

    it('setLanguage()', () => {
      const data = {};

      jest.spyOn(i18n, 'setLanguage');

      Editor.setLanguage('ko', data);

      expect(i18n.setLanguage).toHaveBeenCalledWith('ko', data);
    });
  });

  describe('options', () => {
    describe('plugins', () => {
      it('should invoke plugin functions', () => {
        const fooPlugin = jest.fn().mockReturnValue({});
        const barPlugin = jest.fn().mockReturnValue({});

        editor = new Editor({
          el: container,
          plugins: [fooPlugin, barPlugin],
        });

        // @ts-ignore
        expect(fooPlugin).toHaveBeenCalledWith(editor.eventEmitter);
        // @ts-ignore
        expect(barPlugin).toHaveBeenCalledWith(editor.eventEmitter);
      });

      it('should invoke plugin function with options of plugin', () => {
        const plugin = jest.fn().mockReturnValue({});
        const options = {};

        editor = new Editor({
          el: container,
          plugins: [[plugin, options]],
        });

        // @ts-ignore
        expect(plugin).toHaveBeenCalledWith(editor.eventEmitter, options);
      });

      it(`should add command to command manager when plugin return 'markdownCommands' value`, () => {
        const plugin = () => {
          return {
            markdownCommands: {
              foo: () => () => true,
            },
          };
        };

        editor = new Editor({
          el: container,
          plugins: [plugin],
        });

        // @ts-ignore
        jest.spyOn(editor.commandManager, 'exec');

        editor.exec('markdown', 'foo');

        // @ts-ignore
        expect(editor.commandManager.exec).toHaveBeenCalled();
      });

      it(`should add command to command manager when plugin return 'wysiwygCommands' value`, () => {
        const plugin = () => {
          return {
            wysiwygCommands: {
              foo: () => () => true,
            },
          };
        };

        editor = new Editor({
          el: container,
          plugins: [plugin],
        });

        // @ts-ignore
        jest.spyOn(editor.commandManager, 'exec');

        editor.exec('wysiwyg', 'foo');

        // @ts-ignore
        expect(editor.commandManager.exec).toHaveBeenCalled();
      });
    });
  });
});
