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

describe('findNodeAtPosition()', () => {
  it('returns a node at the given position', () => {
    const doc = new MarkdownDocument('# Hello *World*\n\n- Item 1\n- Item **2**');

    expect(doc.findNodeAtPosition([1, 1])).toMatchObject({
      type: 'heading'
    });

    expect(doc.findNodeAtPosition([1, 3])).toMatchObject({
      type: 'text',
      literal: 'Hello '
    });

    expect(doc.findNodeAtPosition([1, 9])).toMatchObject({
      type: 'emph',
      firstChild: {
        type: 'text',
        literal: 'World'
      }
    });

    expect(doc.findNodeAtPosition([1, 10])).toMatchObject({
      type: 'text',
      literal: 'World'
    });

    expect(doc.findNodeAtPosition([3, 1])).toMatchObject({
      type: 'item'
    });

    expect(doc.findNodeAtPosition([3, 3])).toMatchObject({
      type: 'text',
      literal: 'Item 1'
    });

    expect(doc.findNodeAtPosition([4, 8])).toMatchObject({
      type: 'strong',
      firstChild: {
        type: 'text',
        literal: '2'
      }
    });

    expect(doc.findNodeAtPosition([4, 10])).toMatchObject({
      type: 'text',
      literal: '2'
    });

    expect(doc.findNodeAtPosition([5, 1])).toBeNull();
  });

  it('returns null if matched node does not exist', () => {
    const doc = new MarkdownDocument('# Hello\n\nWorld');

    // position in between two node (blank line)
    expect(doc.findNodeAtPosition([2, 1])).toBeNull();

    // position out of document range
    expect(doc.findNodeAtPosition([4, 1])).toBeNull();
  });
});

describe('findFirstNodeAtLine()', () => {
  const markdown = [
    '# Hello *World*',
    '',
    '- Item D1',
    '  - Item D2',
    '![Image](URL)',
    '',
    'Paragraph'
  ].join('\n');

  it('returns the first node at the given line', () => {
    const doc = new MarkdownDocument(markdown);

    expect(doc.findFirstNodeAtLine(1)).toMatchObject({ type: 'heading' });
    expect(doc.findFirstNodeAtLine(3)).toMatchObject({
      type: 'list',
      prev: { type: 'heading' }
    });
    expect(doc.findFirstNodeAtLine(4)).toMatchObject({
      type: 'list',
      parent: { type: 'item' }
    });
    expect(doc.findFirstNodeAtLine(5)).toMatchObject({ type: 'image' });
    expect(doc.findFirstNodeAtLine(7)).toMatchObject({ type: 'paragraph' });
  });

  it('if the given line is blank, returns the first node at the previous line', () => {
    const doc = new MarkdownDocument(markdown);

    expect(doc.findFirstNodeAtLine(2)).toMatchObject({ type: 'heading' });
    expect(doc.findFirstNodeAtLine(6)).toMatchObject({ type: 'image' });
    expect(doc.findFirstNodeAtLine(8)).toMatchObject({ type: 'paragraph' });
  });

  it('returns null if nothing mathces', () => {
    const doc = new MarkdownDocument('\n\n');

    expect(doc.findFirstNodeAtLine(0)).toBeNull();
    expect(doc.findFirstNodeAtLine(1)).toBeNull();
    expect(doc.findFirstNodeAtLine(2)).toBeNull();
    expect(doc.findFirstNodeAtLine(3)).toBeNull();
  });
});

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

it('return the node - findNodeById()', () => {
  const doc = new MarkdownDocument('# Hello *World*\n\n- Item 1\n- Item **2**');
  const firstNodeId = doc.findFirstNodeAtLine(1)!.id;

  expect(doc.findNodeById(firstNodeId)).toMatchObject({
    type: 'heading'
  });
});

it('remove all node in the map - removeAllNode()', () => {
  const doc = new MarkdownDocument('# Hello *World*\n\n- Item 1\n- Item **2**');
  const firstNodeId = doc.findFirstNodeAtLine(1)!.id;

  doc.removeAllNode();
  expect(doc.findNodeById(firstNodeId)).toEqual(null);
});
