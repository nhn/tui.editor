import TuiEditor from '../../src/js/editor';

describe('colorSyntax', () => {
    let ned;

    // we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    describe('conversion - useCustomSyntax', () => {
        let actual, expected;

        beforeEach(() => {
            $('body').html('<div id="editSection"></div>');

            ned = new TuiEditor({
                el: $('#editSection').get(0),
                previewStyle: 'vertical',
                height: '100px',
                initialEditType: 'markdown',
                exts: ['colorSyntax'],
                colorSyntax: {
                    useCustomSyntax: true
                }
            });

            actual = null;
            expected = null;
        });

        it('convert html to color syntax', () => {
            const src = '<span class="colour" style="color:rgb(255,0,255)">test</span>';
            actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
            expected = '{color:#ff00ff}test{color}';

            expect(actual).toEqual(expected);
        });

        it('convert multiple color html to color syntax', () => {
            const src = '<span class="colour" style="color:rgb(255,0,255)">test</span>' +
                'test2<span class="colour" style="color:rgb(255,0,255)">test3</span>';
            actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
            expected = '{color:#ff00ff}test{color}test2{color:#ff00ff}test3{color}';

            expect(actual).toEqual(expected);
        });

        it('convert color syntax to html', () => {
            const src = '{color:#ff00ff}test{color}';
            actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
            expected = '<span style="color:#ff00ff">test</span>';

            expect(actual).toEqual(expected);
        });

        it('convert multiple color syntax to html', () => {
            const src = '{color:#ff00ff}test{color}test2{color:#ff00ff}test3{color}';
            actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
            expected = '<span style="color:#ff00ff">test</span>test2<span style="color:#ff00ff">test3</span>';

            expect(actual).toEqual(expected);
        });
    });

    describe('conversion - dont useCustomSyntax', () => {
        let actual, expected;

        beforeEach(() => {
            $('body').html('<div id="editSection"></div>');

            ned = new TuiEditor({
                el: $('#editSection').get(0),
                previewStyle: 'vertical',
                height: '100px',
                initialEditType: 'markdown',
                exts: ['colorSyntax']
            });

            actual = null;
            expected = null;
        });

        it('do not convert color syntax to html when dont use custom syntax', () => {
            const src = '{color:#ff00ff}test{color}';

            actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
            expected = '{color:#ff00ff}test{color}';
            expect(actual).toEqual(expected);
        });

        it('convert html to html when dont use custom syntax', () => {
            const src = '<span class="colour" style="color:rgb(255,0,255)">test</span>';

            actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
            expected = '<span style="color:#ff00ff">test</span>';
            expect(actual).toEqual(expected);
        });
    });

    describe('commands', () => {
        beforeEach(() => {
            $('body').html('<div id="editSection"></div>');

            ned = new TuiEditor({
                el: $('#editSection').get(0),
                previewStyle: 'vertical',
                height: '100px',
                initialEditType: 'markdown',
                exts: ['colorSyntax'],
                colorSyntax: {
                    useCustomSyntax: true
                }
            });
        });
        it('add color in markdown', () => {
            ned.setValue('text');
            ned.getCodeMirror().execCommand('selectAll');
            ned.exec('color', '#f0f');

            expect(ned.getValue()).toEqual('{color:#f0f}text{color}');
        });

        it('Don\'t add color if value isn\'t truthy in markdown', () => {
            let falsyValue;

            ned.setValue('text');
            ned.getCodeMirror().execCommand('selectAll');
            ned.exec('color', falsyValue);

            expect(ned.getValue()).toEqual('text');
        });

        it('add color in wysiwyg', () => {
            ned.changeMode('wysiwyg');

            const sq = ned.getSquire();
            const $body = ned.wwEditor.get$Body();

            sq.setHTML('text');

            const selection = sq.getSelection().cloneRange();
            selection.selectNodeContents($body.find('div')[0].childNodes[0]);
            sq.setSelection(selection);

            ned.exec('color', '#f0f');

            const $span = ned.wwEditor.get$Body().find('span');

            expect($span.hasClass('colour')).toBe(true);
            expect($span.css('color')).toEqual('rgb(255, 0, 255)');
        });

        it('Don\'t add color if value isn\'t truthy in wysiwyg', () => {
            let falsyValue;

            ned.changeMode('wysiwyg');

            const sq = ned.getSquire();
            const $body = ned.wwEditor.get$Body();

            sq.setHTML('text');

            const selection = sq.getSelection().cloneRange();
            selection.selectNodeContents($body.find('div')[0].childNodes[0]);
            sq.setSelection(selection);

            ned.exec('color', falsyValue);

            const $span = ned.wwEditor.get$Body().find('span');

            expect($span.hasClass('colour')).toBe(false);
        });
    });
});
