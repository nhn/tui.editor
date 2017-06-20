import {CodeBlockManager} from '../src/js/codeBlockManager';

describe('CodeBlockManager', () => {
    let codeBlockManager;

    beforeEach(() => {
        codeBlockManager = new CodeBlockManager();
    });

    describe('setElementReplacer', () => {
        it('set replacer for code block element', () => {
            const type = 'tui.grid';
            const replacer = {
                viewOnly: true
            };

            expect(codeBlockManager._elementReplacer.get(type)).toBeUndefined();

            codeBlockManager.setElementReplacer(type, replacer);

            expect(codeBlockManager._elementReplacer.get(type)).toBe(replacer);
        });
    });

    describe('createCodeBlockHtml', () => {
        it('Create a code block html when there is a registered replacer.', () => {
            const type = 'tui.grid';
            const replacer = {
                viewOnly: true
            };

            codeBlockManager.setElementReplacer(type, replacer);

            const actual = codeBlockManager.createCodeBlockHtml(type, 'var a = 1;');
            const expected = '<pre class="tui-editor-custom-code-block" data-language="tui.grid"' +
                ' data-code-text="var%20a%20%3D%201%3B">tui.grid</pre>';

            expect(actual).toBe(expected);
        });

        it('Create code block html for highlight.js type without replacer.', () => {
            const type = 'javascript';
            const actual = codeBlockManager.createCodeBlockHtml(type, 'var a = 1;');
            const expected = '<span class="hljs-keyword">var</span> a = <span class="hljs-number">1</span>;';

            expect(actual).toBe(expected);
        });

        it('Create code block html if there is no registered replacer and not highlight.js type.', () => {
            const type = 'tui.grid';
            const actual = codeBlockManager.createCodeBlockHtml(type, 'var a = 1;');
            const expected = 'var a = 1;';

            expect(actual).toBe(expected);
        });
    });

    describe('_replaceElement()', () => {
        it('Replace the code block element.', () => {
            const containerElement = null;
            const codeBlockElement = $('<pre data-language="tui.grid" data-code-text="abcde"></pre>')[0];
            const id = 'tui-gird-id-1';
            const replace = jasmine.createSpy('replace');

            codeBlockManager._replaceElement(containerElement, codeBlockElement, replace, id);

            expect(replace).toHaveBeenCalledWith({
                id,
                containerElement,
                codeBlockElement,
                type: 'tui.grid',
                codeText: 'abcde'
            });
        });

        it('If returned the element after the replacement,' +
            'set the id, language, class, code text, etc. in the changed element.', () => {
            const containerElement = null;
            const codeBlockElement = $('<pre data-language="tui.grid" data-code-text="abcde"></pre>')[0];
            const id = 'tui-gird-id-1';
            const returnedElement = $('<div></div>')[0];
            const replace = () => {
                return returnedElement;
            };

            codeBlockManager._replaceElement(containerElement, codeBlockElement, replace, id);

            expect(returnedElement.id).toBe(id);
            expect($(returnedElement).data('language')).toBe('tui.grid');
            expect(returnedElement.className).toBe('tui-editor-custom-code-block');
            expect($(returnedElement).data('code-text')).toBe('abcde');
            expect(codeBlockElement.id).toBe('');
        });

        it('If not returned the element after the replacement,' +
            'set the id to the original code block element.', () => {
            const containerElement = null;
            const codeBlockElement = $('<pre data-language="tui.grid" data-code-text="abcde"></pre>')[0];
            const id = 'tui-gird-id-1';
            const replace = () => {};

            codeBlockManager._replaceElement(containerElement, codeBlockElement, replace, id);

            expect(codeBlockElement.id).toBe(id);
        });
    });

    describe('_restoreElement()', () => {
        it('Restore code bloc element to markdown-it style.', () => {
            const $codeBlock = $('<pre data-language="tui.grid" data-code-text="abcde"></pre>');
            const codeBlockElement = $codeBlock[0];
            const $container = $('<div></div>');

            $container.append($codeBlock);

            codeBlockManager._restoreElement(codeBlockElement);

            const $newChild = $($container.children().first());

            expect($newChild[0].nodeName).toBe('PRE');
            expect($newChild[0].className).toBe('lang-tui.grid');
            expect($newChild.html()).toBe('<div>abcde</div>');
        });
    });

    describe('updateCodeTextById()', () => {
        it('Update code text by code block id and container element.', () => {
            const $codeBlock = $('<pre id="tui-gird-id-1" data-language="tui.grid" data-code-text="abcde"></pre>');
            const $container = $('<div></div>');

            $container.append($codeBlock);
            $(document.body).append($container);

            expect($codeBlock.data('code-text')).toBe('abcde');

            codeBlockManager.updateCodeTextById($container[0], 'tui-gird-id-1', 'fghij');

            expect($codeBlock.data('code-text')).toBe('fghij');
        });
    })
});
