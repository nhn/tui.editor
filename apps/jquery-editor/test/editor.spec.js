/**
 * @fileoverview Test jQuery wrapper for editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import Editor from '@toast-ui/editor';

import '@/editor';

describe('jQuery wrapper for editor', () => {
  let $container;

  beforeEach(() => {
    $container = $('<div id="editor"></div>');
  });

  afterEach(() => {
    $container.tuiEditor('remove');
  });

  it('is created', () => {
    $container.tuiEditor();

    const [editor] = Editor.getInstances();

    expect(editor.options.el).toEqual($container[0]);
  });

  it('call api', () => {
    $container.tuiEditor({
      initialEditType: 'markdown'
    });

    const [editor] = Editor.getInstances();

    spyOn(editor, 'isMarkdownMode').and.callThrough();

    const result = $container.tuiEditor('isMarkdownMode');

    expect(editor.isMarkdownMode).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
