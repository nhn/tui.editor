/**
 * @fileoverview Test uml plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Editor from '@toast-ui/editor';
import umlPlugin from '@/index';

function removeDataAttr(html: string) {
  return html
    .replace(/\sdata-nodeid="\d{1,}"/g, '')
    .replace(/\n/g, '')
    .trim();
}

describe('uml plugin', () => {
  let container: HTMLElement, editor: Editor;

  function assertWwEditorHTML(html: string) {
    const wwEditorEl = editor.getEditorElements().wwEditor;

    expect(wwEditorEl).toContainHTML(html);
  }

  function assertMdPreviewHTML(html: string) {
    const mdPreviewEl = editor.getEditorElements().mdPreview;

    expect(removeDataAttr(mdPreviewEl.innerHTML)).toContain(html);
  }

  beforeEach(() => {
    container = document.createElement('div');
    editor = new Editor({
      el: container,
      previewStyle: 'vertical',
      plugins: [umlPlugin],
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  it('should render plant uml image in markdown preview', () => {
    const lang = 'uml';

    editor.setMarkdown(`$$${lang}\nAlice -> Bob: Hello\n$$`);

    assertMdPreviewHTML('src="//www.plantuml.com/plantuml/png');
  });

  it('should render plant uml image in markdown preview', () => {
    const lang = 'plantuml';

    editor.setMarkdown(`$$${lang}\nAlice -> Bob: Hello\n$$`);

    assertMdPreviewHTML('src="//www.plantuml.com/plantuml/png');
  });

  it('should render uml image in wysiwyg', () => {
    editor.setMarkdown('$$uml\nAlice -> Bob: Hello\n$$');
    editor.changeMode('wysiwyg');

    assertWwEditorHTML('src="//www.plantuml.com/plantuml/png');
  });
});
