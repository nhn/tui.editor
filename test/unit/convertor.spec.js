/**
 * @fileoverview test convertor
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import Convertor from '../../src/js/convertor';
import EventManager from '../../src/js/eventManager';

describe('Convertor', () => {
  let convertor, em;

  beforeEach(() => {
    em = new EventManager();
    convertor = new Convertor(em);
    convertor.initHtmlSanitizer();
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
      expect(convertor._markdownToHtmlWithCodeHighlight('\n| ![nhnent](http://www.nhnent.com/) |  |  |\n| ----------- | --- | --- |\n|  | b |  |\n|  |  |  |\ntext').match(/\/td/g).length).toEqual(6);
    });

    it('do not add line breaks in list before and after image syntax', () => {
      expect(convertor._markdownToHtmlWithCodeHighlight('\n* asd![nhnent](http://www.nhnent.com/)\n- asd![nhnent](http://www.nhnent.com/)\n1. asd![nhnent](http://www.nhnent.com/)\n* [ ] asd![nhnent](http://www.nhnent.com/)\n').match(/\/p/g)).toBe(null);
    });

    it('should store number of backticks in code to data-backticks attribute', () => {
      expect(convertor.toHTML('`code span`').trim()).toEqual('<p><code data-backticks="1">code span</code></p>');
      expect(convertor.toHTML('```code span```').trim()).toEqual('<p><code data-backticks="3">code span</code></p>');
      expect(convertor.toHTMLWithCodeHightlight('`code span`').trim()).toEqual('<p><code data-backticks="1">code span</code></p>');
      expect(convertor.toHTMLWithCodeHightlight('```code span```').trim()).toEqual('<p><code data-backticks="3">code span</code></p>');
    });

    it('should store number of backticks in codeblock to data-backtics attribute', () => {
      expect(convertor.toHTML('```\ncode block\n```').replace(/\n/g, '').trim()).toEqual('<pre><code>code block</code></pre>');
      expect(convertor.toHTML('````\ncode block\n````').replace(/\n/g, '').trim()).toEqual('<pre><code data-backticks="4">code block</code></pre>');
    });

    it('should convert blockquote even if there is a line above it (ref #989)', () => {
      expect(convertor.toHTML('text above\n> quote').replace(/\n/g, '')).toEqual('<p>text above</p><blockquote><p>quote</p></blockquote>');
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
    it('should escape html in html text', () => {
      // valid tags
      expect(convertor.toMarkdown('im &lt;span&gt; text')).toEqual('im \\<span> text');
      expect(convertor.toMarkdown('im &lt;span attr="value"&gt; text')).toEqual('im \\<span attr="value"> text');
      expect(convertor.toMarkdown('im &lt;!-- comment --&gt; text')).toEqual('im \\<!-- comment --> text');

      // common mark auto link
      expect(convertor.toMarkdown('im &lt;http://google.com&gt; text')).toEqual('im \\<http://google.com> text');

      // invalid tags
      expect(convertor.toMarkdown('im &lt;\\span&gt; text')).toEqual('im <\\span> text');
      expect(convertor.toMarkdown('im &lt;/span attr="value"&gt; text')).toEqual('im </span attr="value"> text');
    });

    it('should print number of backticks for code according to data-backticks attribute', () => {
      expect(convertor.toMarkdown('<code data-backticks="1">code span</code>').trim()).toEqual('`code span`');
      expect(convertor.toMarkdown('<code data-backticks="3">code span</code>').trim()).toEqual('```code span```');
    });

    it('should print number of backticks for code block according to data-backticks attribute', () => {
      expect(convertor.toMarkdown('<pre><code>code block</code></pre>').trim()).toEqual('```\ncode block\n```');
      expect(convertor.toMarkdown('<pre><code data-backticks="4">code block</code></pre>').trim()).toEqual('````\ncode block\n````');
    });

    it('should treat $ special characters', () => {
      expect(convertor.toMarkdown('<span>,;:$&+=</span>').trim()).toEqual('<span>,;:$&+=</span>');
    });

    it('should convert BRs to newline', () => {
      expect(convertor.toMarkdown('text<br><br>text')).toBe('text\n\ntext');
      expect(convertor.toMarkdown('<b>text</b><br><br>text')).toBe('**text**\n\ntext');
      expect(convertor.toMarkdown('<i>text</i><br><br>text')).toBe('_text_\n\ntext');
      expect(convertor.toMarkdown('<s>text</s><br><br>text')).toBe('~~text~~\n\ntext');
      expect(convertor.toMarkdown('<code>text</code><br><br>text')).toBe('`text`\n\ntext');
      expect(convertor.toMarkdown('<a href="some_url">text</a><br><br>text')).toBe('[text](some_url)\n\ntext');
      expect(convertor.toMarkdown('<span>text</span><br><br>text'))
        .toBe('<span>text</span>\n\ntext');
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

  describe('should not convert to', () => {
    it('code in list', () => {
      const markdown = [
        '*    codeblock',
        '',
        '1.    codeblock',
        '',
        'paragraph',
        '',
        '    code',
        '    block'
      ].join('\n');
      const expectedMarkdown = [
        '* codeblock',
        '',
        '1. codeblock',
        '',
        'paragraph',
        '',
        '```',
        'code',
        'block',
        '```'
      ].join('\n');
      const expectedHTML = [
        '<ul>',
        '<li>codeblock</li>',
        '</ul>',
        '<ol>',
        '<li>codeblock</li>',
        '</ol>',
        '<p>paragraph</p>',
        '<pre><code>code',
        'block</code></pre>',
        ''
      ].join('\n');

      const result = convertor.toHTML(markdown);

      expect(result).toEqual(expectedHTML);
      expect(convertor.toMarkdown(result)).toEqual(expectedMarkdown);
    });

    it('blockquote in list', () => {
      const markdown = [
        '* > blockquote',
        '',
        '1. > blockquote',
        '',
        'paragraph',
        '',
        '> blockquote'
      ].join('\n');
      const html = [
        '<ul>',
        '<li>&gt; blockquote</li>',
        '</ul>',
        '<ol>',
        '<li>&gt; blockquote</li>',
        '</ol>',
        '<p>paragraph</p>',
        '<blockquote>',
        '<p>blockquote</p>',
        '</blockquote>',
        ''
      ].join('\n');
      const resultMarkdown = [
        '* \\> blockquote',
        '',
        '1. \\> blockquote',
        '',
        'paragraph',
        '',
        '> blockquote'
      ].join('\n');

      const result = convertor.toHTML(markdown);

      expect(result).toEqual(html);
      expect(convertor.toMarkdown(convertor.toHTML(markdown))).toEqual(resultMarkdown);
    });

    it('< & > in codeblock', () => {
      const markdown = [
        '```',
        '<span>',
        '```'
      ].join('\n');
      const html = [
        '<pre><code>&lt;span&gt;',
        '</code></pre>',
        ''
      ].join('\n');
      const resultMarkdown = [
        '```',
        '<span>',
        '',
        '```'
      ].join('\n');

      expect(convertor.toHTML(markdown)).toEqual(html);
      expect(convertor.toMarkdown(html)).toEqual(resultMarkdown);
    });
  });
});
