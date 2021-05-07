import Editor from '@toast-ui/editor';
import mergedTableCellPlugin from '@/index';

export function assertWYSIWYGHTML(editor: Editor, html: string) {
  const wwEditorEl = editor.getEditorElements().wwEditor;

  expect(wwEditorEl.innerHTML).toContain(html);
}

export function createEditor() {
  const content = [
    '| @cols=2:mergedHead1 | @cols=3:mergedHead2 |',
    '| --- | --- | --- | --- | --- |',
    '| @cols=2:mergedCell1-1 | cell1-2 | @cols=2:@rows=5:mergedCell1-3 |',
    '| @rows=2:mergedCell2-1 | @rows=2:mergedCell2-2 | cell2-3 |',
    '| cell3-1 |',
    '| cell4-1 | cell4 | cell4-3 |',
    '| cell5-1 | cell5-2 | cell5-3 |',
    '',
  ].join('\n');

  const container = document.createElement('div');

  document.body.appendChild(container);

  const editor = new Editor({
    el: container,
    initialEditType: 'wysiwyg',
    initialValue: content,
    previewStyle: 'vertical',
    plugins: [mergedTableCellPlugin],
  });

  return { container, editor };
}
