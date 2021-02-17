import { source, oneLineTrim } from 'common-tags';

// @ts-ignore
import { Parser } from '@toast-ui/toastmark';

import { Schema } from 'prosemirror-model';
import { createSpecs } from '@/wysiwyg/specCreator';

import Convertor from '@/convertors/convertor';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';
import EventEmitter from '@/event/eventEmitter';

import { ToMdConvertorMap, ToMdConvertorContext, NodeInfo, MarkInfo } from '@t/convertor';

function createSchema() {
  const adaptor = new WwToDOMAdaptor({}, {});
  const specs = createSpecs(adaptor, {});

  return new Schema({
    nodes: specs.nodes,
    marks: specs.marks,
  });
}

describe('Convertor', () => {
  let convertor: Convertor;
  let schema: Schema;

  const parser = new Parser({
    disallowedHtmlBlockTags: ['br', 'img'],
  });

  function assertConverting(markdown: string, expected: string) {
    const mdNode = parser.parse(markdown);

    const wwNode = convertor.toWysiwygModel(mdNode);
    const result = convertor.toMarkdownText(wwNode!);

    expect(result).toBe(expected);
  }

  beforeEach(() => {
    schema = createSchema();
    convertor = new Convertor(schema, {}, new EventEmitter());
  });

  describe('should convert between markdown and wysiwyg node to', () => {
    it('empty content', () => {
      assertConverting('', '');
    });

    it('paragraph', () => {
      const markdown = 'foo';

      assertConverting(markdown, markdown);
    });

    it('headings', () => {
      const markdown = source`
        # heading1
        ## heading2
        ### heading3
        #### heading4
        ##### heading5
        ###### heading6
      `;
      const expected = source`
        # heading1
        
        ## heading2
        
        ### heading3
        
        #### heading4
        
        ##### heading5
        
        ###### heading6
      `;

      assertConverting(markdown, expected);
    });

    it('codeBlock', () => {
      const markdown = source`
        \`\`\`
        foo
        \`\`\`
      `;

      assertConverting(markdown, markdown);
    });

    it('bullet list', () => {
      const markdown = source`
        * foo
        * bar
          * qux
        * baz
    	`;

      assertConverting(markdown, markdown);
    });

    it('ordered list', () => {
      const markdown = source`
        1. foo
        2. bar
        3. baz
    	`;

      assertConverting(markdown, markdown);
    });

    it('blockQuote', () => {
      const markdown = source`
        > foo
        > bar
        >> baz
        > > qux
        > >> quxx
      `;
      const expected = source`
        > foo
        > bar
        > > baz
        > > qux
        > > > quxx
      `;

      assertConverting(markdown, expected);
    });

    it('thematicBreak', () => {
      const markdown = source`
        ---
        ***
        - - -
        * * * *
    	`;
      const expected = source`
        ***
        
        ***
        
        ***
        
        ***
      `;

      assertConverting(markdown, expected);
    });

    it('image', () => {
      const markdown = source`
        ![](imgUrl)
        ![altText](imgUrl)
        ![altText](img*Url)
      `;
      const expected = source`
        ![](imgUrl)
        ![altText](imgUrl)
        ![altText](img\\*Url)
    	`;

      assertConverting(markdown, expected);
    });

    it('link', () => {
      const markdown = source`
        [](url)foo
        [text](url)
        [text](ur*l)
    	`;
      const expected = source`
        foo
        [text](url)
        [text](ur\\*l)
    	`;

      assertConverting(markdown, expected);
    });

    it('code', () => {
      const markdown = '`foo bar baz`';

      assertConverting(markdown, markdown);
    });

    it('emphasis (strong, italic) syntax', () => {
      const markdown = source`
        **foo**
        __bar__
        *baz*
        _qux_
    	`;
      const expected = source`
        **foo**
        **bar**
        *baz*
        *qux*
    	`;

      assertConverting(markdown, expected);
    });

    it('strike', () => {
      const markdown = '~~strike~~';

      assertConverting(markdown, markdown);
    });

    it('table', () => {
      const markdown = source`
        | thead | thead |
        | --- | --- |
        | tbody | tbody |

        | thead |thead |
        | -- | ----- |
        | tbody|tbody|
        | tbody|tbody|

        |||
        |-|-|
        |||
      `;
      const expected = source`
        | thead | thead |
        | ----- | ----- |
        | tbody | tbody |

        | thead | thead |
        | ----- | ----- |
        | tbody | tbody |
        | tbody | tbody |

        |  |  |
        | --- | --- |
        |  |  |
      `;

      assertConverting(markdown, `${expected}\n`);
    });

    it('table with column align syntax', () => {
      const markdown = source`
        | default | left | right | center |
        | --- | :--- | ---: | :---: |
        | tbody | tbody | tbody | tbody |

        |  |  |  |  |
        | --- | :--- | ---: | :---: |
        | default | left | right | center |
      `;
      const expected = source`
        | default | left | right | center |
        | ------- | :--- | ----: | :----: |
        | tbody | tbody | tbody | tbody |

        |  |  |  |  |
        | --- | :--- | ---: | :---: |
        | default | left | right | center |
      `;

      assertConverting(markdown, `${expected}\n`);
    });

    it('table with inline syntax', () => {
      const markdown = source`
        | ![altText](imgUrl) | foo ![altText](imgUrl) baz |
        | ---- | ---- |
        | [linkText](linkUrl) | foo [linkText](linkUrl) baz |
        | **foo** _bar_ ~~baz~~ | **foo** *bar* ~~baz~~ [linkText](linkUrl) |
      `;
      const expected = source`
        | ![altText](imgUrl) | foo ![altText](imgUrl) baz |
        | --- | -------- |
        | [linkText](linkUrl) | foo [linkText](linkUrl) baz |
        | **foo** *bar* ~~baz~~ | **foo** *bar* ~~baz~~ [linkText](linkUrl) |
      `;

      assertConverting(markdown, `${expected}\n`);
    });

    it('task', () => {
      const markdown = source`
        * [ ] foo
          * [x] baz
        * [x] bar
        
        1. [x] foo
        2. [ ] bar
      `;

      assertConverting(markdown, markdown);
    });

    it('list in blockQuote', () => {
      const markdown = source`
        > * foo
        >   * baz
        > * bar
        >> 1. qux
        > > 2. quxx 
      `;
      const expected = source`
        > * foo
        >   * baz
        > * bar
        > > 1. qux
        > > 2. quxx 
      `;

      assertConverting(markdown, expected);
    });

    it('soft break', () => {
      const markdown = source`
        foo
        bar

        baz



        qux
      `;

      const expected = source`
        foo
        bar

        baz

        qux
      `;

      assertConverting(markdown, expected);
    });

    it('<br> html string', () => {
      const markdown = source`
        foo
        <br>
        bar
        <br>
        <br>
        baz
        <br>
        <br>
        <br>
        qux
      `;
      const expected = source`
        foo
        
        bar

        <br>
        baz

        <br>
        <br>
        qux
      `;

      assertConverting(markdown, expected);
    });

    it('<br> html string with soft break', () => {
      const markdown = source`
        foo

        <br>
        bar
        
        <br>
        <br>
        baz
        

        <br>
        qux
        <br>

        quux

        <br>

        quuz
      `;
      const expected = source`
        foo
        
        <br>
        bar

        <br>
        <br>
        baz

        <br>
        qux

        <br>
        quux

        <br>
        <br>
        quuz
      `;

      assertConverting(markdown, expected);
    });
  });

  describe('convert inline html', () => {
    it('emphasis type', () => {
      const markdown = source`
        <b>foo</b>
        <strong>foo</strong>

        <i>foo</i>
        <em>foo</em>
        
        <s>foo</s>
        <del>foo</del>

        <code>foo</code>
      `;

      assertConverting(markdown, markdown);
    });

    it('link type', () => {
      const markdown = source`
        <a href="#">foo</a>

        <img src="#">

        <img src="#" alt="test">
      `;

      assertConverting(markdown, markdown);
    });

    it('table with <br>', () => {
      const markdown = source`
        | thead<br>thead | thead |
        | ----- | ----- |
        | tbody<br>tbody | tbody |
        | tbody | tbody<br>tbody<br>tbody |
      `;
      const expected = source`
        | thead<br>thead | thead |
        | ---------- | ----- |
        | tbody<br>tbody | tbody |
        | tbody | tbody<br>tbody<br>tbody |
      `;

      assertConverting(markdown, `${expected}\n`);
    });

    it('table with list', () => {
      const markdown = source`
        | thead |
        | ----- |
        | <ul><li>bullet</li></ul> |
        | <ol><li>ordered</li></ol> |
        | <ul><li>nested<ul><li>nested</li></ul></li></ul> |
        | <ul><li>nested<ul><li>nested</li><li>nested</li></ul></li></ul> |
        | <ol><li>mix**ed**<ul><li>**mix**ed</li></ul></li></ol> |
        | <ol><li>mix<i>ed</i><ul><li><strong>mix</strong>ed</li></ul></li></ol> |
        | foo<ul><li>bar</li></ul>baz |
        | ![altText](imgUrl) **mixed**<ul><li>[linkText](linkUrl) mixed</li></ul> |
      `;

      assertConverting(markdown, `${markdown}\n`);
    });
  });

  describe('convert block html', () => {
    it('paragraph and division are not converted to html block', () => {
      const markdown = source`
        <p>paragraph</p>

        <div>division</div>
      `;
      const expected = source`
        paragraph
        division
      `;

      assertConverting(markdown, expected);
    });

    it('heading', () => {
      const markdown = source`
        <h1>heading1</h1>
        <h2>heading2</h2>
        <h3>heading3</h3>
        <h4>heading4</h4>
        <h5>heading4</h5>
        <h6>heading4</h6>
      `;
      const expected = oneLineTrim`
        <h1>heading1</h1>
        <h2>heading2</h2>
        <h3>heading3</h3>
        <h4>heading4</h4>
        <h5>heading4</h5>
        <h6>heading4</h6>
      `;

      assertConverting(markdown, expected);
    });

    it('pre', () => {
      const markdown = source`
        <pre>code</pre>
      `;

      assertConverting(markdown, markdown);
    });

    it('blockquote', () => {
      const markdown = source`
        <blockquote>foo</blockquote>
        <blockquote>foo<blockquote>foo</blockquote></blockquote>
      `;
      const expected = oneLineTrim`
        <blockquote>foo</blockquote>
        <blockquote>foo<blockquote>foo</blockquote></blockquote>
      `;

      assertConverting(markdown, expected);
    });

    it('bullet list', () => {
      const markdown = source`
        <ul><li>foo</li></ul>
        <ul><li>foo<ul><li>foo</li></ul></li></ul>
      `;
      const expected = oneLineTrim`
        <ul><li>foo</li></ul>
        <ul><li>foo<ul><li>foo</li></ul></li></ul>
      `;

      assertConverting(markdown, expected);
    });

    it('ordered list', () => {
      const markdown = source`
        <ol><li>foo</li></ol>
        <ol><li>foo<ol><li>foo</li></ol></li></ol>
      `;
      const expected = oneLineTrim`
        <ol><li>foo</li></ol>
        <ol><li>foo<ol><li>foo</li></ol></li></ol>
      `;

      assertConverting(markdown, expected);
    });

    it('task', () => {
      const markdown = source`
        <ul><li class="task-list-item" data-task>bullet task</li></ul>
        <ul><li class="task-list-item checked" data-task data-task-checked>ordered task</li></ul>
      `;
      const expected = oneLineTrim`
        <ul><li class="task-list-item" data-task>bullet task</li></ul>
        <ul><li class="task-list-item checked" data-task data-task-checked>ordered task</li></ul>
      `;

      assertConverting(markdown, expected);
    });

    it('table', () => {
      const markdown = source`
        <table><thead><tr><th>foo</th></tr></thead><tbody><tr><td>bar</td></tr></tbody></table>
      `;

      assertConverting(markdown, markdown);
    });

    it('with html inline', () => {
      const markdown = source`
        <h1><b>foo</b></h1>
        <ul><li>foo <i>bar</i></li></ul>
        <blockquote><s>foo</s> bar</blockquote>
      `;
      const expected = oneLineTrim`
        <h1><b>foo</b></h1>
        <ul><li>foo <i>bar</i></li></ul>
        <blockquote><s>foo</s> bar</blockquote>
      `;

      assertConverting(markdown, expected);
    });
  });

  describe('sanitize when using html', () => {
    it('href attribute with link', () => {
      const markdown = source`
        <a href="javascript:alert();">xss</a>

        <a href="  JaVaScRiPt: alert();">xss</a>

        <a href="vbscript:alert();">xss</a>

        <a href="  VBscript: alert(); ">xss</a>

        <a href="livescript:alert();">xss</a>

        <a href="  LIVEScript: alert() ;">xss</a>

        123<a href=' javascript:alert();'>xss</a>

        <a href='javas<!-- -->cript:alert()'>xss</a>
      `;
      const expected = source`
        <a href="">xss</a>

        <a href="">xss</a>

        <a href="">xss</a>

        <a href="">xss</a>

        <a href="">xss</a>

        <a href="">xss</a>

        123<a href="">xss</a>

        <a href="">xss</a>
      `;

      assertConverting(markdown, expected);
    });

    it('src attribute with image', () => {
      const markdown = source`
        <img src="javascript:alert();">

        <img src="  JaVaScRiPt: alert();">

        <img src="vbscript:alert();">

        <img src="  VBscript: alert(); ">

        <img src="  LIVEScript: alert() ;">

        <img src="java<!-- -->script:alert();">
      `;
      const expected = source`
        <img src="">

        <img src="">

        <img src="">

        <img src="">

        <img src="">

        <img src="">
      `;

      assertConverting(markdown, expected);
    });
  });

  describe('should custom convertor when converting from wysiwyg to markdown', () => {
    function createCustomConvertor(customConvertor: ToMdConvertorMap) {
      schema = createSchema();
      convertor = new Convertor(schema, customConvertor, new EventEmitter());
    }

    it('should change delimeter', () => {
      const toMdCustomConvertor = {
        thematicBreak() {
          return {
            delim: '- - -',
          };
        },
      };

      createCustomConvertor(toMdCustomConvertor);

      assertConverting('***', '- - -');
    });

    it('should change raw html', () => {
      const toMdCustomConvertor = {
        thematicBreak() {
          return {
            rawHTML: '<hr class="foo">',
          };
        },
      };

      createCustomConvertor(toMdCustomConvertor);

      assertConverting('***', '<hr class="foo">');
    });

    it('should not convert raw html when returning only delimiter', () => {
      const toMdCustomConvertor = {
        thematicBreak() {
          return {
            delim: '***',
          };
        },
      };

      createCustomConvertor(toMdCustomConvertor);

      assertConverting('<hr>', '***');
    });

    it('should convert to original value', () => {
      const toMdCustomConvertor = {
        thematicBreak(_: NodeInfo | MarkInfo, { origin }: ToMdConvertorContext) {
          return origin!();
        },
      };

      createCustomConvertor(toMdCustomConvertor);

      assertConverting('***', '***');
    });

    it('should convert by mixing return values', () => {
      const toMdCustomConvertor = {
        heading({ node }: NodeInfo | MarkInfo, { origin }: ToMdConvertorContext) {
          const { level, headingType } = node.attrs;

          if (headingType === 'setext') {
            const delim = level === 1 ? '========' : '------';

            return { delim };
          }

          return origin!();
        },
      };

      createCustomConvertor(toMdCustomConvertor);

      const markdown = source`
        heading1
        ===

        heading2
        ---

        # heading1
      `;
      const expected = source`
        heading1
        ========

        heading2
        ------

        # heading1
      `;

      assertConverting(markdown, expected);
    });
  });

  describe('with front matter parser option', () => {
    function assertFrontMatterConverting(markdown: string, expected: string) {
      const useFrontMatterParser = new Parser({
        disallowedHtmlBlockTags: ['br', 'img'],
        frontMatter: true,
      });
      const mdNode = useFrontMatterParser.parse(markdown);

      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(expected);
    }

    it('should convert front matter', () => {
      const markdown = source`
        ---
        title: foo
        desc: bar
        ---
      `;

      assertFrontMatterConverting(markdown, markdown);
    });
  });
});
