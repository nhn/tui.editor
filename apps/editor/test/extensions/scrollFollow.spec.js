import TuiEditor from '../../src/js/editor';

const loadStyleFixtures = window.loadStyleFixtures;

describe('scrollFollow', () => {
    let ned;

    beforeEach(() => {
        jasmine.getStyleFixtures().fixturesPath = '/base';
        loadStyleFixtures('lib/codemirror/lib/codemirror.css');
        $('body').html('<div id="editSection"></div>');

        ned = new TuiEditor({
            el: $('#editSection'),
            previewStyle: 'vertical',
            height: 100,
            initialEditType: 'markdown',
            exts: ['scrollFollow'],
            events: {
                'load': editor => {
                    editor.getCodeMirror().setSize(200, 50);
                    $('.preview').css('padding', '0');
                    $('.preview').css('overflow', 'auto');
                }
            }
        });
    });

    //we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    describe('disable/enable, 어찌테스트해야할지 고민중', () => {
        beforeEach(() => {
            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));
        });

        it('disable scrollFollow', () => {
            ned.exec('scrollFollow.diasable');
        });
    });
});
