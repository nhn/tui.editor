import { MarkdownDocument } from '../document';
import { Parser } from '../commonmark/blocks';
import { getChildNodes } from '../nodeHelper';
import { BlockNode } from '../commonmark/node';

const reader = new Parser();

function removeIdAttrFromAllNode(root: BlockNode) {
  const walker = root.walker();
  let event;
  while ((event = walker.next())) {
    const { entering, node } = event;
    if (entering) {
      delete node.id;
    }
  }
}

function assertParseResult(doc: MarkdownDocument, lineTexts: string[]) {
  expect(doc.getLineTexts()).toEqual(lineTexts);

  const root = doc.getRootNode();
  const expectedRoot = reader.parse(lineTexts.join('\n'));

  removeIdAttrFromAllNode(root);
  removeIdAttrFromAllNode(expectedRoot);
  expect(root).toEqual(expectedRoot);
}

function assertResultNodes(doc: MarkdownDocument, nodes: BlockNode[], startIdx = 0) {
  const root = doc.getRootNode();
  const newNodes = getChildNodes(root);

  for (let i = 0; i < nodes.length; i += 1) {
    expect(nodes[i]).toBe(newNodes[i + startIdx]);
  }
}

describe('editText()', () => {
  describe('single paragraph', () => {
    it('insert character within a line', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 6], [1, 6], ',');

      assertParseResult(doc, ['Hello, World']);
      assertResultNodes(doc, result.nodes);
    });

    it('remove entire text', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 1], [1, 12], '');

      assertParseResult(doc, ['']);
      assertResultNodes(doc, result.nodes);
    });

    it('remove preceding newline', () => {
      const doc = new MarkdownDocument('\nHello World');
      const result = doc.editMarkdown([1, 1], [2, 1], '');

      assertParseResult(doc, ['Hello World']);
      assertResultNodes(doc, result.nodes);
    });

    it('remove last newline', () => {
      const doc = new MarkdownDocument('Hello World\n');
      const result = doc.editMarkdown([1, 12], [2, 1], '');

      assertParseResult(doc, ['Hello World']);
      assertResultNodes(doc, result.nodes);
    });

    it('insert characters and newlines', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 6], [1, 7], '!\n\nMy ');

      assertParseResult(doc, ['Hello!', '', 'My World']);
      assertResultNodes(doc, result.nodes);
    });

    it('replace multiline text with characters', () => {
      const doc = new MarkdownDocument('Hello\nMy\nWorld');
      const result = doc.editMarkdown([1, 5], [3, 3], 'ooo Wooo');

      assertParseResult(doc, ['Hellooo Wooorld']);
      assertResultNodes(doc, result.nodes);
    });

    it('prepend characters', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 1], [1, 1], 'Hi, ');

      assertParseResult(doc, ['Hi, Hello World']);
      assertResultNodes(doc, result.nodes);
    });

    it('append character', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 12], [1, 12], '!!');

      assertParseResult(doc, ['Hello World!!']);
      assertResultNodes(doc, result.nodes);
    });

    it('prepend newlines', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 1], [1, 1], '\n\n\n');

      assertParseResult(doc, ['', '', '', 'Hello World']);
      assertResultNodes(doc, result.nodes);
    });

    it('prepend characters (unmatched position)', () => {
      const doc = new MarkdownDocument('  Hello World');
      const result = doc.editMarkdown([1, 1], [1, 1], 'Hi,');

      assertParseResult(doc, ['Hi,  Hello World']);
      assertResultNodes(doc, result.nodes);
    });

    it('insert newlines into preceding empty line of first paragraph', () => {
      const doc = new MarkdownDocument('\nHello World');
      const result = doc.editMarkdown([1, 1], [1, 1], '\n');

      assertParseResult(doc, ['', '', 'Hello World']);
      assertResultNodes(doc, result.nodes);
    });

    it('append characters with newline', () => {
      const doc = new MarkdownDocument('Hello World\n');
      const result = doc.editMarkdown([2, 1], [2, 1], '\nHi');

      assertParseResult(doc, ['Hello World', '', 'Hi']);
      assertResultNodes(doc, result.nodes);
    });
  });

  describe('multiple paragraph', () => {
    it('insert paragraphs within multiple paragraphs', () => {
      const doc = new MarkdownDocument('Hello\n\nMy\n\nWorld');
      const result = doc.editMarkdown([1, 6], [5, 1], ',\n\nMy ');

      assertParseResult(doc, ['Hello,', '', 'My World']);
      assertResultNodes(doc, result.nodes);
    });

    it('replace multiple paragraphs with a heading', () => {
      const doc = new MarkdownDocument('Hello\n\nMy\n\nWorld');
      const result = doc.editMarkdown([1, 1], [5, 1], '# Hello ');

      assertParseResult(doc, ['# Hello World']);
      assertResultNodes(doc, result.nodes);
    });

    it('remove last block with newlines', () => {
      const doc = new MarkdownDocument('Hello\n\nWorld\n');
      const result = doc.editMarkdown([3, 1], [4, 1], '');

      assertParseResult(doc, ['Hello', '', '']);
      assertResultNodes(doc, result.nodes);
    });

    it('insert a characters in between paragraphs', () => {
      const doc = new MarkdownDocument('Hello\n\nWorld');
      const result = doc.editMarkdown([2, 1], [2, 1], 'My');

      assertParseResult(doc, ['Hello', 'My', 'World']);
      assertResultNodes(doc, result.nodes);
    });

    it('update sourcepos for every next nodes', () => {
      const doc = new MarkdownDocument('Hello\n\nMy\n\nWorld *!!*');
      const result = doc.editMarkdown([1, 1], [1, 1], 'Hey,\n');

      assertParseResult(doc, ['Hey,', 'Hello', '', 'My', '', 'World *!!*']);
      assertResultNodes(doc, result.nodes);
    });
  });

  describe('list item', () => {
    it('single empty item - append characters', () => {
      const doc = new MarkdownDocument('-');
      const result = doc.editMarkdown([1, 2], [1, 2], ' Hello');

      assertParseResult(doc, ['- Hello']);
      assertResultNodes(doc, result.nodes);
    });

    it('single item paragraph - append characters', () => {
      const doc = new MarkdownDocument('- Hello');
      const result = doc.editMarkdown([1, 8], [1, 8], ' World');

      assertParseResult(doc, ['- Hello World']);
      assertResultNodes(doc, result.nodes);
    });

    it('single item - append new item', () => {
      const doc = new MarkdownDocument('- Hello');
      const result = doc.editMarkdown([1, 8], [1, 8], '\n- World');

      assertParseResult(doc, ['- Hello', '- World']);
      assertResultNodes(doc, result.nodes);
    });

    it('prepend a new list before an existing list', () => {
      const doc = new MarkdownDocument('Hello\n\n- World');
      const result = doc.editMarkdown([1, 1], [1, 1], '- ');

      assertParseResult(doc, ['- Hello', '', '- World']);
      assertResultNodes(doc, result.nodes);
    });

    it('prepend a new list before a padded paragraph', () => {
      const doc = new MarkdownDocument('\n\n  World');
      const result = doc.editMarkdown([1, 1], [1, 1], '- Hello');

      assertParseResult(doc, ['- Hello', '', '  World']);
      assertResultNodes(doc, result.nodes);
    });

    it('prepend a new list before a padded codeblock containing list-like text', () => {
      const doc = new MarkdownDocument('\n\n    - World');
      const result = doc.editMarkdown([1, 1], [1, 1], '- Hello');

      assertParseResult(doc, ['- Hello', '', '    - World']);
      assertResultNodes(doc, result.nodes);
    });

    it('convert a paragraph preceded by a list to a list ', () => {
      const doc = new MarkdownDocument('- Hello\n\nWorld');
      const result = doc.editMarkdown([3, 1], [3, 1], '- ');

      assertParseResult(doc, ['- Hello', '', '- World']);
      assertResultNodes(doc, result.nodes);
    });

    it('add paddings to a paragraph preceded by a list', () => {
      const doc = new MarkdownDocument('- Hello\n\nWorld');
      const result = doc.editMarkdown([3, 1], [3, 1], '  ');

      assertParseResult(doc, ['- Hello', '', '  World']);
      assertResultNodes(doc, result.nodes);
    });
  });
});
