
import ToastUIEditorViewOnly from '../src/js/viewOnly';

const MarkDownIt = window.markdownit;

describe('Editor', () => {
    let wrapper, viewOnly;

    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
        viewOnly = new ToastUIEditorViewOnly({
            el: $(wrapper)
        });
    });

    // we need to wait squire input event process
    afterEach(()=> {
        document.body.removeChild(wrapper);
    });

    it('getMarkdownHighlightRenderer() should get MarkDownIt instance', () => {
        expect(viewOnly.getMarkdownHighlightRenderer() instanceof MarkDownIt).toBe(true);
    });

    it('setMarkdownHighlightRenderer() should set MarkDownIt instance', () => {
        const markdownitHighlight = new markdownit({
            highlight() {
                return 'changed';
            }
        });
        viewOnly.setMarkdownHighlightRenderer(markdownitHighlight);
        viewOnly.setMarkdown('```\nbefore changed\n```');

        expect(wrapper.querySelector('code').innerText).toBe('changed');
    });
});
