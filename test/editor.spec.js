/* eslint-disable max-len, max-nested-callbacks */

import Editor from '../src/js/editor';

describe('Editor', () => {
    let editor, container;

    describe('Api', () => {
        beforeEach(() => {
            jasmine.getStyleFixtures().fixturesPath = '/base';
            window.loadStyleFixtures(
                'lib/codemirror/lib/codemirror.css',
                'src/css/tui-editor.css'
            );
            container = document.createElement('div');
            document.body.appendChild(container);

            editor = new Editor({
                el: container,
                height: '300px',
                initialEditType: 'markdown'
            });
        });

        // we need to wait squire input event process
        afterEach(done => {
            setTimeout(() => {
                container.parentNode.removeChild(container);
                done();
            });
        });

        describe('changeMode()', () => {
            beforeEach(() => {
                container.parentNode.removeChild(container);
                container = document.createElement('div');
                document.body.appendChild(container);
                editor = new Editor({
                    el: container,
                    height: '300px',
                    initialEditType: 'markdown',
                    initialValue: 'text 1\ntext 2'
                });
            });

            it('should set focus and set cursor to end', () => {
                editor.changeMode('wysiwyg');

                const range = editor.wwEditor.getRange();
                expect(range.startContainer.textContent).toEqual('text 2');
                expect(range.startOffset).toEqual(1);
                expect(container.contains(document.activeElement)).toEqual(true);

                document.activeElement.blur();
                editor.changeMode('markdown');

                const cursor = editor.mdEditor.getCursor();
                expect(cursor.line).toEqual(1);
                expect(cursor.ch).toEqual(6);
                expect(container.contains(document.activeElement)).toEqual(true);
            });

            it('should not set focus and cursor', () => {
                editor.changeMode('wysiwyg', true);

                const range = editor.wwEditor.getRange();
                expect(range.startContainer.textContent).toEqual('text 1');
                expect(range.startOffset).toEqual(0);
                expect(container.contains(document.activeElement)).toEqual(false);

                editor.changeMode('markdown', true);

                const cursor = editor.mdEditor.getCursor();
                expect(cursor.line).toEqual(0);
                expect(cursor.ch).toEqual(0);
                expect(container.contains(document.activeElement)).toEqual(false);
            });
        });

        describe('height(pixel)', () => {
            it('set editor height', () => {
                editor.height('500px');
                expect(container.offsetHeight).toEqual(500);
            });

            it('set editor height as pixel if given argument is a number', () => {
                editor.height(500);
                expect(container.offsetHeight).toEqual(500);
            });

            it('get editor height', () => {
                expect(editor.height()).toEqual('300px');
            });
        });

        describe('height("auto") and minHeight()', () => {
            it('set editor height "auto" to fit contents height of wysiwyg', () => {
                const height = $('.te-ww-container .te-editor').height();
                editor.height('auto');
                editor.changeMode('wysiwyg');
                editor.setMarkdown('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
                expect($('.te-ww-container .tui-editor-contents').height()).not.toEqual(height);
            });

            it('set editor height "auto" to fit contents height of markdown', () => {
                const height = $('.te-md-container .te-editor').height();
                editor.height('auto');
                editor.setMarkdown('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
                expect($('.te-md-container .te-editor').height()).not.toEqual(height);
            });

            it('default minHeight should be applied to editor height', () => {
                editor.height('auto');

                const rect = container.getBoundingClientRect();
                expect(rect.bottom - rect.top).toBeGreaterThan(100);
            });

            it('should applied to editor height', () => {
                editor.height('auto');
                editor.minHeight('300px');

                const rect = container.getBoundingClientRect();
                expect(rect.bottom - rect.top).toEqual(300);
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

