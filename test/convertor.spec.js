import Convertor from '../src/js/convertor';
import EventManager from '../src/js/eventManager';

describe('Convertor', () => {
    let convertor, em;

    beforeEach(() => {
        em = new EventManager();
        convertor = new Convertor(em);
    });

    afterEach(() => {
        $('body').empty();
    });

    describe('markdown to html', () => {
        it('converting markdown to html', () => {
            expect(convertor.toHTML('# HELLO WORLD')).toEqual('<h1>HELLO WORLD</h1>\n');
            expect(convertor.toHTMLWithCodeHightlight('# HELLO WORLD')).toEqual('<h1>HELLO WORLD</h1>\n');
        });

        it('sanitize script tags', () => {
            expect(convertor.toHTML('<script>alert("test");</script>')).toEqual('');
            expect(convertor.toHTMLWithCodeHightlight('<script>alert("test");</script>')).toEqual('');
        });

        it('escape vertical bar', () => {
            expect(convertor.toHTML('| 1 | 2 |\n| -- | -- |\n| 4\\|5 | 6 |\n').match(/\/td/g).length).toEqual(2);
            expect(convertor.toHTMLWithCodeHightlight('| 1 | 2 |\n| -- | -- |\n| 3 | 4\\|4 |\n').match(/\/td/g).length)
                .toEqual(2);
        });

        it('Avoid hidden last cell in table', () => {
            expect(convertor.toHTML('| a |  |  |\n| ----------- | --- | --- |\n|  | b |  |\n|  |  |  |\ntext').match(/\/td/g).length)
                .toEqual(6);
        });
    });

    describe('html to markdown', () => {
        it('converting markdown to html', () => {
            expect(convertor.toMarkdown('<h1 id="hello-world">HELLO WORLD</h1>')).toEqual('# HELLO WORLD');
        });
    });

    describe('event', () => {
        it('convertorAfterMarkdownToHtmlConverted event fired after html convert', () => {
            let param;

            em.listen('convertorAfterMarkdownToHtmlConverted', data => {
                param = data;
            });

            convertor.toHTML('# HELLO WORLD');

            expect(param).toEqual('<h1>HELLO WORLD</h1>\n');
        });

        it('convertorAfterHtmlToMarkdownConverted event fired after markdown convert', () => {
            let param;

            em.listen('convertorAfterHtmlToMarkdownConverted', data => {
                param = data;
            });

            convertor.toMarkdown('<h1 id="hello-world">HELLO WORLD</h1>');

            expect(param).toEqual('# HELLO WORLD');
        });
    });
});
