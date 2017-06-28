import TuiEditor from '../../src/js/editor';

describe('colorSyntax', () => {
    let editor, wrapper;

    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
        jasmine.clock().install();
    });

    afterEach(done => {
        jasmine.clock().uninstall();
        setTimeout(() => {
            wrapper.parentNode.removeChild(wrapper);
            done();
        });
    });

    it('create plant uml image in markdown preview', () => {
        editor = new TuiEditor({
            el: $(wrapper),
            previewStyle: 'vertical',
            height: 100,
            initialEditType: 'markdown',
            exts: ['plantUML']
        });

        editor.setValue(`\`\`\`uml\nAlice -> Bob: Hello\n\`\`\``);

        jasmine.clock().tick(800);

        expect(editor.preview.$el.get(0).querySelector('pre img').getAttribute('src')).toEqual('http://www.plantuml.com/plantuml/png/UDfppCbCJbNGjLDmoa-oKl18pSd9vm80Fq05zG00');
    });

    it('shows code in html in wysiwyg', () => {
        editor = new TuiEditor({
            el: $(wrapper),
            previewStyle: 'vertical',
            height: 100,
            initialEditType: 'wysiwyg',
            exts: ['plantUML']
        });

        editor.setValue(`\`\`\`uml\nAlice -> Bob: Hello\n\`\`\``);

        expect(editor.wwEditor.get$Body().get(0).querySelector('pre').innerHTML).toEqual('<div>Alice -&gt; Bob: Hello</div>');
    });
});
