/* eslint-disable max-len, max-nested-callbacks */

import Editor from '../src/js/editor';

describe('Editor', () => {
    let editor;

    describe('Api', () => {
        beforeEach(() => {
            editor = new Editor({
                el: $('body'),
                height: 300,
                initialEditType: 'markdown'
            });
        });

        // we need to wait squire input event process
        afterEach(done => {
            setTimeout(() => {
                $('body').empty();
                done();
            });
        });

        describe('contentHeight()', () => {
            it('set content height', () => {
                editor.contentHeight(500);
                expect($('.te-md-container .te-editor').height()).toEqual(500);
                expect($('.te-preview').height()).toEqual(500);
                expect($('.te-ww-container .te-editor').height()).toEqual(500);
            });

            it('get content height', () => {
                expect(editor.contentHeight()).toEqual(300);
            });

            it('set content height "auto" to fit contents height of wysiwyg', () => {
                const height = $('.te-ww-container .te-editor').height();
                editor.contentHeight('auto');
                editor.changeMode('wysiwyg');
                editor.setMarkdown('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
                expect($('.te-ww-container .tui-editor-contents').height()).not.toEqual(height);
            });

            it('set content height "auto" to fit contents height of markdown', () => {
                const height = $('.te-md-container .te-editor').height();
                editor.contentHeight('auto');
                editor.setMarkdown('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
                expect($('.te-md-container .te-editor').height()).not.toEqual(height);
            });
        });
        describe('setMarkdown()', () => {
            it('fire setMarkdownAfter evnet after setMarkdown', done => {
                editor.on('setMarkdownAfter', done);
                editor.setMarkdown('dd');
            });
        });
        describe('changePreviewStyle()', () => {
            it('Preview should refreash after preview style is changed', () => {
                editor.changePreviewStyle('tab');
                editor.setMarkdown('1\n2');
                editor.changePreviewStyle('vertical');
                expect(editor.preview.$el.text()).toEqual('1\n2\n');
            });
        });

        describe('insertText()', () => {
            it('insert text on markdown mode', () => {
                editor.changeMode('markdown');
                editor.insertText('text');
                expect(editor.getValue()).toEqual('text');
            });

            it('insert text on wysiwyg mode', () => {
                editor.changeMode('wysiwyg');
                editor.insertText('text');
                expect(editor.getValue()).toEqual('text');
            });
        });

        describe('getSelectedText()', () => {
            it('retrieve selected text on markdown', () => {
                editor.changeMode('markdown');
                editor.setValue('selected text');

                editor.mdEditor.cm.setSelection({
                    line: 0,
                    ch: 9
                }, {
                    line: 0,
                    ch: 13
                });

                expect(editor.getSelectedText()).toEqual('text');
            });

            it('retrieve selected text on wysiwyg', () => {
                editor.changeMode('wysiwyg');
                editor.setValue('selected text');

                const wwEditor = editor.wwEditor;
                const selection = wwEditor.editor.getSelection().cloneRange();
                const textElement = wwEditor.get$Body().find('div')[0].firstChild;
                selection.setStart(textElement, 9);
                selection.setEnd(textElement, 13);
                wwEditor.editor.setSelection(selection);

                expect(editor.getSelectedText()).toEqual('text');
            });
        });
    });
});

