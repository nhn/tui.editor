import { MarkdownDocument } from '../document';

// Shortcut function to prevent prettier from adding linebreak beetween nested arrays
const pos = (a: number, b: number, c: number, d: number) => [
  [a, b],
  [c, d]
];

describe('editText()', () => {
  describe('single paragraph', () => {
    it('insert character within a line', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 6], [1, 6], ', ')!;
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['Hello, World']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 1, 12),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 12),
          firstChild: {
            type: 'text',
            literal: 'Hello, World',
            sourcepos: pos(1, 1, 1, 12)
          },
          next: null
        }
      });

      expect(result.updated!.length).toBe(1);
      expect(result.updated![0]).toBe(root.firstChild!);
    });

    it('insert characters and newlines', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 6], [1, 6], '!\n\nMy ')!;
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['Hello!', '', 'My World']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 3, 8),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 6),
          firstChild: {
            type: 'text',
            literal: 'Hello!',
            sourcepos: pos(1, 1, 1, 6)
          },
          next: {
            type: 'paragraph',
            sourcepos: pos(3, 1, 3, 8),
            firstChild: {
              type: 'text',
              literal: 'My World',
              sourcepos: pos(3, 1, 3, 8)
            },
            next: null
          }
        }
      });

      expect(result.updated!.length).toBe(2);
      expect(result.updated![0]).toBe(root.firstChild!);
      expect(result.updated![1]).toBe(root.firstChild!.next!);
    });

    it('replace multiline text with characters', () => {
      const doc = new MarkdownDocument('Hello\nMy\nWorld');
      const result = doc.editMarkdown([1, 5], [3, 2], 'ooo Wooo')!;
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['Hellooo Wooorld']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 1, 15),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 15),
          firstChild: {
            type: 'text',
            literal: 'Hellooo Wooorld',
            sourcepos: pos(1, 1, 1, 15)
          },
          next: null
        }
      });

      expect(result.updated!.length).toBe(1);
      expect(result.updated![0]).toBe(root.firstChild!);
    });

    it('prepend characters', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 1], null, 'Hi, ')!;
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['Hi, Hello World']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 1, 15),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 15),
          firstChild: {
            type: 'text',
            literal: 'Hi, Hello World',
            sourcepos: pos(1, 1, 1, 15)
          },
          next: null
        }
      });

      expect(result.updated!.length).toBe(1);
      expect(result.updated![0]).toBe(root.firstChild!);
    });

    it('append character', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown(null, [1, 12], '!!')!;
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['Hello World!!']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 1, 13),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 13),
          firstChild: {
            type: 'text',
            literal: 'Hello World!!',
            sourcepos: pos(1, 1, 1, 13)
          },
          next: null
        }
      });

      expect(result.updated!.length).toBe(1);
      expect(result.updated![0]).toBe(root.firstChild!);
    });

    it('prepend newlines', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 1], null, '\n\n\n')!;
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['', '', '', 'Hello World']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 4, 11),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(4, 1, 4, 11),
          firstChild: {
            type: 'text',
            literal: 'Hello World',
            sourcepos: pos(4, 1, 4, 11)
          },
          next: null
        }
      });

      expect(result.updated!.length).toBe(1);
      expect(result.updated![0]).toBe(root.firstChild!);
    });

    it('prepend characters (unmatched position)', () => {
      const doc = new MarkdownDocument('  Hello World');
      const result = doc.editMarkdown([1, 1], null, 'Hi,')!;
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['Hi,  Hello World']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 1, 16),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 16),
          firstChild: {
            type: 'text',
            literal: 'Hi,  Hello World',
            sourcepos: pos(1, 1, 1, 16)
          },
          next: null
        }
      });

      expect(result.updated!.length).toBe(1);
      expect(result.updated![0]).toBe(root.firstChild!);
    });

    it('append characters with newline', () => {
      const doc = new MarkdownDocument('Hello World\n');
      const result = doc.editMarkdown([2, 1], null, '\nHi')!;
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['Hello World', '', 'Hi']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 3, 2),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 11),
          firstChild: {
            type: 'text',
            literal: 'Hello World',
            sourcepos: pos(1, 1, 1, 11)
          },
          next: {
            type: 'paragraph',
            sourcepos: pos(3, 1, 3, 2),
            firstChild: {
              type: 'text',
              literal: 'Hi',
              sourcepos: pos(3, 1, 3, 2)
            },
            next: null
          }
        }
      });

      expect(result.updated!.length).toBe(2);
      expect(result.updated![0]).toBe(root.firstChild!);
      expect(result.updated![1]).toBe(root.firstChild!.next!);
    });
  });

  describe('multiple paragraph', () => {
    it('insert paragraphs within multiple paragraphs', () => {
      const doc = new MarkdownDocument('Hello\n\nMy\n\nWorld');
      const result = doc.editMarkdown([1, 6], [5, 1], ',\n\nMy W')!;
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['Hello,', '', 'My World']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 3, 8),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 6),
          firstChild: {
            type: 'text',
            literal: 'Hello,',
            sourcepos: pos(1, 1, 1, 6)
          },
          next: {
            type: 'paragraph',
            sourcepos: pos(3, 1, 3, 8),
            firstChild: {
              type: 'text',
              literal: 'My World',
              sourcepos: pos(3, 1, 3, 8)
            },
            next: null
          }
        }
      });

      expect(result.updated!.length).toBe(2);
      expect(result.updated![0]).toBe(root.firstChild!);
      expect(result.updated![1]).toBe(root.firstChild!.next!);
    });

    it('replace multiple paragraphs with a heading', () => {
      const doc = new MarkdownDocument('Hello\n\nMy\n\nWorld');
      const result = doc.editMarkdown([1, 1], [5, 1], '# Hello W')!;
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['# Hello World']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 1, 13),
        firstChild: {
          type: 'heading',
          level: 1,
          sourcepos: pos(1, 1, 1, 13),
          firstChild: {
            type: 'text',
            literal: 'Hello World',
            sourcepos: pos(1, 3, 1, 13)
          }
        }
      });
      expect(result.updated!.length).toBe(1);
      expect(result.updated![0]).toBe(root.firstChild!);
    });
  });
});
