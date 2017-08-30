import TuiEditor from '../../src/js/editor';

const loadStyleFixtures = window.loadStyleFixtures;

describe('scrollFollow', () => {
    let ned, container;

    beforeEach(() => {
        jasmine.getStyleFixtures().fixturesPath = '/base';
        loadStyleFixtures('lib/codemirror/lib/codemirror.css');
        container = document.createElement('div');
        document.body.appendChild(container);

        ned = new TuiEditor({
            el: container,
            previewStyle: 'vertical',
            height: '100px',
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

    // we need to wait squire input event process
    afterEach(done => {
        setTimeout(() => {
            document.body.removeChild(container);
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
