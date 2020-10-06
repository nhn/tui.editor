// @ts-ignore
import { source } from 'common-tags';

// @ts-ignore
import { Parser } from '@toast-ui/toastmark';

import { Schema } from 'prosemirror-model';
import { createSpecs } from '@/wysiwyg/specCreator';

import Convertor from '@/convertors/convertor';

const parser = new Parser();

function createSchema() {
  const specs = createSpecs();

  return new Schema({
    nodes: specs.nodes,
    marks: specs.marks
  });
}

describe('Convertor', () => {
  let convertor: Convertor;
  let schema: Schema;

  beforeEach(() => {
    schema = createSchema();
    convertor = new Convertor(schema);
  });

  describe('convert between markdown and wysiwyg node to', () => {
    it('paragrpah', () => {
      const markdown = 'foo';

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(markdown);
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
      const expceted = source`
        # heading1
        
        ## heading2
        
        ### heading3
        
        #### heading4
        
        ##### heading5
        
        ###### heading6
      `;

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(expceted);
    });

    it('codeBlock', () => {
      const markdown = source`
        \`\`\`
        foo
        \`\`\`
      `;

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(markdown);
    });

    it('bullet list', () => {
      const markdown = source`
        * foo
        * bar
          * qux
        * baz
    	`;

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(markdown);
    });

    it('ordered list', () => {
      const markdown = source`
        1. foo
        2. bar
        3. baz
    	`;

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(markdown);
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

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(expected);
    });

    it('thematicBreak', () => {
      const markdown = source`
        ---
        ***
        - - -
        * * * *
    	`;
      const expected = source`
        ---
        
        ---
        
        ---
        
        ---
      `;

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(expected);
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

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(expected);
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

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(expected);
    });

    it('code', () => {
      const markdown = '`foo bar baz`';

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(markdown);
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

      const mdNode = parser.parse(markdown);
      const wwNode = convertor.toWysiwygModel(mdNode);
      const result = convertor.toMarkdownText(wwNode!);

      expect(result).toBe(expected);
    });
  });

  it('strike', () => {
    const markdown = '~~strike~~';

    const mdNode = parser.parse(markdown);
    const wwNode = convertor.toWysiwygModel(mdNode);
    const result = convertor.toMarkdownText(wwNode!);

    expect(result).toBe(markdown);
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
    `;
    const expected = source`
      | thead | thead |
      | ----- | ----- |
      | tbody | tbody |

      | thead | thead |
      | ----- | ----- |
      | tbody | tbody |
      | tbody | tbody |
    `;

    const mdNode = parser.parse(markdown);
    const wwNode = convertor.toWysiwygModel(mdNode);
    const result = convertor.toMarkdownText(wwNode!);

    expect(result).toBe(`${expected}\n`);
  });

  it('task', () => {
    const markdown = source`
      * [ ] foo
        * [x] baz
      * [x] bar
      
      1. [x] foo
      2. [ ] bar
    `;

    const mdNode = parser.parse(markdown);
    const wwNode = convertor.toWysiwygModel(mdNode);
    const result = convertor.toMarkdownText(wwNode!);

    expect(result).toBe(markdown);
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

    const mdNode = parser.parse(markdown);
    const wwNode = convertor.toWysiwygModel(mdNode);
    const result = convertor.toMarkdownText(wwNode!);

    expect(result).toBe(expected);
  });
});
