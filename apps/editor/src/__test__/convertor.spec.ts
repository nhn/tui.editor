import { source } from 'common-tags';

// @ts-ignore
import { Parser } from '@toast-ui/toastmark';

import { Schema } from 'prosemirror-model';
import { createSpecs } from '@/wysiwyg/specCreator';

import Convertor from '@/convertors/convertor';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';

const parser = new Parser({
  disallowedHtmlBlockTags: ['br', 'img']
});

function createSchema() {
  const adaptor = new WwToDOMAdaptor({}, {});
  const specs = createSpecs(adaptor);

  return new Schema({
    nodes: specs.nodes,
    marks: specs.marks
  });
}

describe('Convertor', () => {
  let convertor: Convertor;
  let schema: Schema;

  function assertConverting(markdown: string, expected: string) {
    const mdNode = parser.parse(markdown);

    const wwNode = convertor.toWysiwygModel(mdNode);
    const result = convertor.toMarkdownText(wwNode!);

    expect(result).toBe(expected);
  }

  beforeEach(() => {
    schema = createSchema();
    convertor = new Convertor(schema, {});
  });

  describe('convert between markdown and wysiwyg node to', () => {
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
      `;

      assertConverting(markdown, expected);
    });

    it('table with <br> html string', () => {
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

    it('table with list html string', () => {
      const markdown = source`
        | thead | thead |
        | ----- | ----- |
        | <ul><li>bullet</li></ul> | <ol><li>ordered</li></ol> |
        | <ul><li>nested<ul><li>nested</li></ul></li></ul> |  |
        | <ul><li>nested<ul><li>nested</li><li>nested</li></ul></li></ul> |  |
        | <ol><li>mixed<ul><li>**mix**ed</li></ul></li></ol> |  |
      `;
      const expected = source`
        | thead | thead |
        | ----- | ----- |
        | <ul><li>bullet</li></ul> | <ol><li>ordered</li></ol> |
        | <ul><li>nested<ul><li>nested</li></ul></li></ul> |  |
        | <ul><li>nested<ul><li>nested</li><li>nested</li></ul></li></ul> |  |
        | <ol><li>mixed<ul><li>**mix**ed</li></ul></li></ol> |  |
      `;

      assertConverting(markdown, `${expected}\n`);
    });

    it('inlineHtml (emphasis type)', () => {
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

    it('inlineHtml (link type)', () => {
      const markdown = source`
        <a href="#">foo</a>

        <img src="#">

        <img src="#" alt="test">
      `;

      assertConverting(markdown, markdown);
    });

    it('htmlBlock', () => {
      assertConverting('<hr>', '<hr>');
    });
  });

  describe('sanitize when using html', () => {
    it('href attribute with <a>', () => {
      assertConverting('<a href="javascript:alert();">xss</a>', '<a href="">xss</a>');
    });

    xit('src attribute with <img>', () => {
      // @TODO fix test that breaks when sanitizing inline html of the same type
      assertConverting('<img src="javascript:alert();">', '<img src="">');
    });
  });
});
