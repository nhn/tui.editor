import Convertor from '../src/js/convertor';
import EventManager from '../src/js/eventManager';

describe('Convertor', () => {
    let convertor, em;

    beforeEach(() => {
        em = new EventManager();
        convertor = new Convertor(em);
        convertor.initHtmlSanitizer();
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
            expect(convertor.toHTML('| a |  |  |\n| ----------- | --- | --- |\n|  | b |  |\n|  |  |  |\ntext').match(/\/td/g).length).toEqual(6);
        });
        it('Avoid hidden last cell in table', () => {
            expect(convertor.toHTML('first\n\n<br>first\n\n```\nsecond\n\n\nsecond\n```\n\n')).toBe('<p>first</p>\n<p><br data-tomark-pass="">first</p>\n<pre><code>second\n\n\nsecond\n</code></pre>\n');
        });

        it('do not add line breaks in table before and after image syntax', () => {
            expect(convertor._markdownToHtmlWithCodeHighlight('\n| ![naver](www.naver.com/) |  |  |\n| ----------- | --- | --- |\n|  | b |  |\n|  |  |  |\ntext').match(/\/td/g).length).toEqual(6);
        });

        it('do not add line breaks in list before and after image syntax', () => {
            expect(convertor._markdownToHtmlWithCodeHighlight('\n* asd![naver](www.naver.com/)\n- asd![naver](www.naver.com/)\n1. asd![naver](www.naver.com/)\n* [ ] asd![naver](www.naver.com/)\n').match(/\/p/g)).toBe(null);
        });
    });

    describe('html to markdown', () => {
        it('converting markdown to html', () => {
            expect(convertor.toMarkdown('<h1 id="hello-world">HELLO WORLD</h1>')).toEqual('# HELLO WORLD');
        });
        it('should reserve br on multi line breaks', () => {
            expect(convertor.toMarkdown('HELLO WORLD<br><br><br>!')).toEqual('HELLO WORLD\n\n<br>\n!');
        });
        it('should not reserve br on normal line breaks', () => {
            expect(convertor.toMarkdown('HELLO WORLD<br><br>!')).toEqual('HELLO WORLD\n\n!');
        });
        it('should not reserve br in codeblock', () => {
            expect(convertor.toMarkdown('<pre><code>HELLO WORLD\n\n\n\n\n!</code></pre>')).toEqual('```\nHELLO WORLD\n\n\n\n\n!\n```');
        });
        it('should reserve br to inline in table', () => {
            const html = '<table>' +
                '<thead><th>1</th><th>2</th><th>3</th></thead>' +
                '<tbody><td>HELLO WORLD<br><br><br><br><br>!</td><td>4</td><td>5</td></tbody>' +
                '</table>';
            const markdown = '| 1 | 2 | 3 |\n| --- | --- | --- |\n| HELLO WORLD<br><br><br><br><br>! | 4 | 5 |';
            expect(convertor.toMarkdown(html)).toEqual(markdown);
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
