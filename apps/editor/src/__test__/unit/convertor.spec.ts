import { source, oneLineTrim } from 'common-tags';

import { Context, MdNode, Parser, HTMLConvertorMap } from '@toast-ui/toastmark';

import { Node, Schema } from 'prosemirror-model';
import { createSpecs } from '@/wysiwyg/specCreator';

import Convertor from '@/convertors/convertor';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';
import EventEmitter from '@/event/eventEmitter';

import { ToMdConvertorMap, ToMdConvertorContext, NodeInfo, MarkInfo } from '@t/convertor';
import { createHTMLSchemaMap } from '@/wysiwyg/nodes/html';
import { sanitizeHTML } from '@/sanitizer/htmlSanitizer';
import { createHTMLrenderer } from './markdown/util';

function createSchema() {
  const specs = createSpecs({});

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
    convertor = new Convertor(schema, {}, {}, new EventEmitter());
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
        ![altText](url?key=abc&attribute=abc)
        `;
      const expected = source`
        ![](imgUrl)
        ![altText](imgUrl)
        ![altText](img*Url)
        ![altText](url?key=abc&attribute=abc)
    	`;

      assertConverting(markdown, expected);
    });

    it('link', () => {
      const markdown = source`
        [](url)foo
        [text](url)
        [text](ur*l)
        [Editor](https://github.com/nhn_test/tui.editor)
        [this.is_a_test_link.com](this.is_a_test_link.com)
        [text](url?key=abc&attribute=abc)
        `;
      const expected = source`
        foo
        [text](url)
        [text](ur*l)
        [Editor](https://github.com/nhn_test/tui.editor)
        [this.is_a_test_link.com](this.is_a_test_link.com)
        [text](url?key=abc&attribute=abc)
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

    // @TODO: should normalize table cell
    // it('should normalize wrong table syntax when converting', () => {
    //   const markdown = source`
    //     | col1 | col2 | col3 |
    //     | --- | --- |
    //     | cell1 | cell2 | cell3 |
    //   `;
    //   const expected = source`
    //     | col1 | col2 | col3 |
    //     | ---- | ---- | ---- |
    //     | cell1 | cell2 |  |
    //   `;

    //   assertConverting(markdown, `${expected}\n`);
    // });

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
        >     * baz
        > * bar
        > > 1. qux
        > > 2. quxx 
      `;

      assertConverting(markdown, expected);
    });

    it('block nodes in list', () => {
      const markdown = source`
        1. foo

            \`\`\`
            bar
            \`\`\`
        
            > bam
      `;
      const expected = source`
        1. foo

            \`\`\`
            bar
            \`\`\`
        
            > bam
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

    it('<br>', () => {
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

    it('<br> with soft break', () => {
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

    it('<br> with html inline node', () => {
      const markdown = source`
        foo
        bar
        Para       <b>Word</b><br>
      `;
      const expected = source`
        foo
        bar
        Para <b>Word</b>
      `;

      assertConverting(markdown, expected);
    });

    it('<br> with following <br>', () => {
      const markdown = source`
        text1
        <br>
        text2<br>
        <br>
        text3
      `;
      const expected = source`
        text1
        
        text2
        
        text3
      `;

      assertConverting(markdown, expected);
    });

    it('<br> in the middle of the paragraph', () => {
      const markdown = source`
        text1
        <br>
        te<br>xt2<br>
        <br>
        text3
      `;
      const expected = source`
        text1
        
        te
        xt2
        
        text3
      `;

      assertConverting(markdown, expected);
    });

    it('should convert html comment', () => {
      const markdown = source`
        <!--
        foo

        bar
        baz
        -->
      `;

      assertConverting(markdown, markdown);
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
        | tbody | **tbody**<br>_tbody_<br>~~tbody~~<br>\`tbody\` |
        | tbody | ![img](imgUrl)<br>[link](linkUrl) |
      `;
      const expected = source`
        | thead<br>thead | thead |
        | ---------- | ----- |
        | tbody<br>tbody | tbody |
        | tbody | tbody<br>tbody<br>tbody |
        | tbody | **tbody**<br>*tbody*<br>~~tbody~~<br>\`tbody\` |
        | tbody | ![img](imgUrl)<br>[link](linkUrl) |
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

    it('table with unmatched html list', () => {
      const markdown = source`
        | thead |
        | ----- |
        | <ul><li>bullet</li><ul> |
        | <ol><li>ordered</li><ol> |
        | <ul><li>nested<ul><li>nested</li><ul><li><ul> |
      `;
      const expected = source`
        | thead |
        | ----- |
        | <ul><li>bullet</li></ul> |
        | <ol><li>ordered</li></ol> |
        | <ul><li>nested<ul><li>nested</li></ul></li></ul> |
      `;

      assertConverting(markdown, `${expected}\n`);
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

  describe('convert custom inline', () => {
    it('with info only', () => {
      const markdown = source`$$custom$$`;
      const expected = oneLineTrim`$$custom$$`;

      assertConverting(markdown, expected);
    });

    it('with info and text', () => {
      const markdown = source`$$custom inline$$`;
      const expected = oneLineTrim`$$custom inline$$`;

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
      `;
      const expected = source`
        <a href="">xss</a>

        <a href="">xss</a>

        <a href="">xss</a>

        <a href="">xss</a>

        <a href="">xss</a>

        <a href="">xss</a>

        123<a href="">xss</a>
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
      `;
      const expected = source`
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
      convertor = new Convertor(schema, customConvertor, {}, new EventEmitter());
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

  describe('should convert html block node which is not supported as default', () => {
    function createConvertorWithHTMLRenderer() {
      const customHTMLRenderer = createHTMLrenderer();
      const adaptor = new WwToDOMAdaptor({}, customHTMLRenderer);
      const htmlSchemaMap = createHTMLSchemaMap(customHTMLRenderer, sanitizeHTML, adaptor);
      const specs = createSpecs({});

      schema = new Schema({
        nodes: { ...specs.nodes, ...htmlSchemaMap.nodes },
        marks: { ...specs.marks, ...htmlSchemaMap.marks },
      });
      convertor = new Convertor(schema, {}, {}, new EventEmitter());
    }

    beforeEach(() => {
      createConvertorWithHTMLRenderer();
    });

    it('should convert html block node to wysiwyg ignoring sanitizer tag', () => {
      const markdown =
        '<iframe src="https://www.youtube.com/embed/XyenY12fzAk" height="315" width="420"></iframe>';
      const expected =
        '<iframe width="420" height="315" src="https://www.youtube.com/embed/XyenY12fzAk"></iframe>';

      assertConverting(markdown, expected);
    });

    it('should convert html block element which has "=" character as the attribute value', () => {
      const markdown =
        '<iframe src="//player.bilibili.com/player.html?aid=588782532&bvid=BV1hB4y1K7ro&cid=360826679&page=1" height="315" width="420"></iframe>';
      const expected =
        '<iframe width="420" height="315" src="//player.bilibili.com/player.html?aid=588782532&amp;bvid=BV1hB4y1K7ro&amp;cid=360826679&amp;page=1"></iframe>';

      assertConverting(markdown, expected);
    });

    it('should convert html block node as the block node through inserting the blank line', () => {
      const markdown = source`
        para1

        <iframe src="https://www.youtube.com/embed/XyenY12fzAk" width="420" height="315"></iframe>

        para2
      `;
      const expected = source`
        para1

        <iframe height="315" width="420" src="https://www.youtube.com/embed/XyenY12fzAk"></iframe>

        para2
      `;

      assertConverting(markdown, expected);
    });

    it('should convert html inline node', () => {
      const markdown = 'inline <big class="my-big">content</big>';

      assertConverting(markdown, markdown);
    });
  });

  describe('with custom convertor when converting from markdown to wysiwyg', () => {
    function createCustomConvertor(customConvertor: HTMLConvertorMap) {
      schema = createSchema();
      convertor = new Convertor(schema, {}, customConvertor, new EventEmitter());
    }

    it('should convert markdown to wysiwyg', () => {
      const toHTMLConvertor: HTMLConvertorMap = {
        paragraph(_: MdNode, { entering, origin, options }: Context) {
          if (options.nodeId) {
            return {
              type: entering ? 'openTag' : 'closeTag',
              outerNewLine: true,
              tagName: 'p',
            };
          }

          return origin!();
        },
      };

      createCustomConvertor(toHTMLConvertor);

      const markdown = source`
        > * Wrappers
        >     1. [x] React
        >     2. [x] Vue
        >     3. [ ] Ember
      `;

      assertConverting(markdown, markdown);
    });
  });

  describe('should escape markdown text in wysiwyg', () => {
    it('with markdown text', () => {
      const markdown = source`
        \\# heading
        \\> blockquote
        \\*test\\*
        \\* list
      `;

      assertConverting(markdown, markdown);
    });

    it('with html text', () => {
      const markdown = source`
        \\<div>block\\</div>
        \\<strong>bold\\</strong>
      `;

      assertConverting(markdown, markdown);
    });
  });

  it('should convert empty line between lists of wysiwig to <br>', () => {
    const wwNodeJson = {
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'test_1' }] },
                { type: 'paragraph', content: [] },
              ],
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'test_2' }] }],
            },
          ],
        },
      ],
    };

    const wwNode = Node.fromJSON(schema, wwNodeJson);

    const result = convertor.toMarkdownText(wwNode);

    expect(result).toBe(`* test\\_1\n<br>\n* test\\_2`);
  });

  it('should escape the backslash, which is a plain chracter in the middle of a sentence', () => {
    const markdown = source`
      backslash \\in the middle of a sentence
      `;
    const expected = source`
      backslash \\\\in the middle of a sentence
      `;

    assertConverting(markdown, expected);
  });
});
