/**
 * @fileoverview Test jQuery wrapper for editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import Editor from '@/editor';

describe('jQuery wrapper for editor', () => {
  let $container;

  beforeEach(() => {
    $container = $('<div id="editor"></div>');
  });

  afterEach(() => {
    $container.toastuiEditor('remove');
  });

  it('is created', () => {
    $container.toastuiEditor();

    const [editor] = Editor.getInstances();

    expect(editor.options.el).toEqual($container[0]);
  });

  it('call api', () => {
    $container.toastuiEditor({
      initialEditType: 'markdown'
    });

    const [editor] = Editor.getInstances();

    spyOn(editor, 'isMarkdownMode').and.callThrough();

    const result = $container.toastuiEditor('isMarkdownMode');

    expect(editor.isMarkdownMode).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
