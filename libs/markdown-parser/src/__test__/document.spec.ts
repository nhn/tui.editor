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

      expect(doc.getLineTexts()).toEqual(['Hello, World']);
      expect(result.updated).toMatchObject([
        {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 12),
          firstChild: {
            type: 'text',
            literal: 'Hello, World',
            sourcepos: pos(1, 1, 1, 12)
          }
        }
      ]);
    });

    it('insert characters and newlines', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 6], [1, 6], '!\n\nMy ')!;

      expect(doc.getLineTexts()).toEqual(['Hello!', '', 'My World']);
      expect(result.updated).toMatchObject([
        {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 6),
          firstChild: {
            type: 'text',
            literal: 'Hello!',
            sourcepos: pos(1, 1, 1, 6)
          }
        },
        {
          type: 'paragraph',
          sourcepos: pos(3, 1, 3, 8),
          firstChild: {
            type: 'text',
            literal: 'My World',
            sourcepos: pos(3, 1, 3, 8)
          }
        }
      ]);
    });

    it('replace multiline text with characters', () => {
      const doc = new MarkdownDocument('Hello\nMy\nWorld');
      const result = doc.editMarkdown([1, 5], [3, 2], 'ooo Wooo')!;

      expect(doc.getLineTexts()).toEqual(['Hellooo Wooorld']);
      expect(result.updated).toMatchObject([
        {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 15),
          firstChild: {
            type: 'text',
            literal: 'Hellooo Wooorld',
            sourcepos: pos(1, 1, 1, 15)
          }
        }
      ]);
    });

    it('prepend characters', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 1], null, 'Hi, ')!;

      expect(doc.getLineTexts()).toEqual(['Hi, Hello World']);
      expect(result.updated).toMatchObject([
        {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 15),
          firstChild: {
            type: 'text',
            literal: 'Hi, Hello World',
            sourcepos: pos(1, 1, 1, 15)
          }
        }
      ]);
    });

    it('append character', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown(null, [1, 12], '!!')!;

      expect(doc.getLineTexts()).toEqual(['Hello World!!']);
      expect(result.updated).toMatchObject([
        {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 13),
          firstChild: {
            type: 'text',
            literal: 'Hello World!!',
            sourcepos: pos(1, 1, 1, 13)
          }
        }
      ]);
    });

    it('prepend newlines', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 1], null, '\n\n\n')!;

      expect(doc.getLineTexts()).toEqual(['', '', '', 'Hello World']);
      expect(result.updated).toMatchObject([
        {
          type: 'paragraph',
          sourcepos: pos(4, 1, 4, 11),
          firstChild: {
            type: 'text',
            literal: 'Hello World',
            sourcepos: pos(4, 1, 4, 11)
          }
        }
      ]);
    });

    it('prepend character (unmatched position)', () => {
      const doc = new MarkdownDocument('  Hello World');
      const result = doc.editMarkdown([1, 1], null, 'Hi,')!;

      expect(doc.getLineTexts()).toEqual(['Hi,  Hello World']);
      expect(result.updated).toMatchObject([
        {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 16),
          firstChild: {
            type: 'text',
            literal: 'Hi,  Hello World',
            sourcepos: pos(1, 1, 1, 16)
          }
        }
      ]);
    });

    it('append character with newline', () => {
      const doc = new MarkdownDocument('Hello World\n');
      const result = doc.editMarkdown([2, 1], null, '\nHi')!;

      expect(doc.getLineTexts()).toEqual(['Hello World', '', 'Hi']);
      expect(result.updated).toMatchObject([
        {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 11),
          firstChild: {
            type: 'text',
            literal: 'Hello World',
            sourcepos: pos(1, 1, 1, 11)
          }
        },
        {
          type: 'paragraph',
          sourcepos: pos(3, 1, 3, 2),
          firstChild: {
            type: 'text',
            literal: 'Hi',
            sourcepos: pos(3, 1, 3, 2)
          }
        }
      ]);
    });
  });
});
