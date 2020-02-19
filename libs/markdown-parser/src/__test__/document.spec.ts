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
      const result = doc.editMarkdown([1, 6], [1, 6], ',');
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

      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toBe(root.firstChild!);
    });

    it('remove preceding newline', () => {
      const doc = new MarkdownDocument('\nHello World');
      const result = doc.editMarkdown([1, 1], [2, 1], '');
      const root = doc.getRootNode();

      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toBe(root.firstChild!);
      expect(doc.getLineTexts()).toEqual(['Hello World']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 1, 11),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 11),
          firstChild: {
            type: 'text',
            literal: 'Hello World',
            sourcepos: pos(1, 1, 1, 11)
          }
        }
      });
    });

    it('remove last newline', () => {
      const doc = new MarkdownDocument('Hello World\n');
      const result = doc.editMarkdown([1, 12], [2, 1], '');
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['Hello World']);
      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toBe(root.firstChild!);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 1, 11),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 11),
          firstChild: {
            type: 'text',
            literal: 'Hello World',
            sourcepos: pos(1, 1, 1, 11)
          }
        }
      });
    });

    it('insert characters and newlines', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 6], [1, 7], '!\n\nMy ');
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

      expect(result.nodes.length).toBe(2);
      expect(result.nodes[0]).toBe(root.firstChild!);
      expect(result.nodes[1]).toBe(root.firstChild!.next!);
    });

    it('replace multiline text with characters', () => {
      const doc = new MarkdownDocument('Hello\nMy\nWorld');
      const result = doc.editMarkdown([1, 5], [3, 3], 'ooo Wooo');
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

      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toBe(root.firstChild!);
    });

    it('prepend characters', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 1], [1, 1], 'Hi, ');
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

      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toBe(root.firstChild!);
    });

    it('append character', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 12], [1, 12], '!!');
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

      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toBe(root.firstChild!);
    });

    it('prepend newlines', () => {
      const doc = new MarkdownDocument('Hello World');
      const result = doc.editMarkdown([1, 1], [1, 1], '\n\n\n');
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

      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toBe(root.firstChild!);
    });

    it('prepend characters (unmatched position)', () => {
      const doc = new MarkdownDocument('  Hello World');
      const result = doc.editMarkdown([1, 1], [1, 1], 'Hi,');
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

      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toBe(root.firstChild!);
    });

    it('prepend newlines', () => {
      const doc = new MarkdownDocument('\nHello World');
      const result = doc.editMarkdown([1, 1], [1, 1], '\n');
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['', '', 'Hello World']);
      expect(result.nodes.length).toBe(0);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 3, 11),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(3, 1, 3, 11),
          firstChild: {
            type: 'text',
            literal: 'Hello World',
            sourcepos: pos(3, 1, 3, 11)
          },
          next: null
        }
      });
    });

    it('append characters with newline', () => {
      const doc = new MarkdownDocument('Hello World\n');
      const result = doc.editMarkdown([2, 1], [2, 1], '\nHi');
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

      expect(result.nodes.length).toBe(2);
      expect(result.nodes[0]).toBe(root.firstChild!);
      expect(result.nodes[1]).toBe(root.firstChild!.next!);
    });
  });

  describe('multiple paragraph', () => {
    it('insert paragraphs within multiple paragraphs', () => {
      const doc = new MarkdownDocument('Hello\n\nMy\n\nWorld');
      const result = doc.editMarkdown([1, 6], [5, 1], ',\n\nMy ');
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

      expect(result.nodes.length).toBe(2);
      expect(result.nodes[0]).toBe(root.firstChild!);
      expect(result.nodes[1]).toBe(root.firstChild!.next!);
    });

    it('replace multiple paragraphs with a heading', () => {
      const doc = new MarkdownDocument('Hello\n\nMy\n\nWorld');
      const result = doc.editMarkdown([1, 1], [5, 1], '# Hello ');
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
      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toBe(root.firstChild!);
    });

    it('remove last block with newlines', () => {
      const doc = new MarkdownDocument('Hello\n\nWorld\n');
      const result = doc.editMarkdown([3, 1], [4, 1], '');
      const root = doc.getRootNode();

      expect(doc.getLineTexts()).toEqual(['Hello', '', '']);
      expect(result.nodes.length).toBe(0);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 1, 5),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 1, 5),
          firstChild: {
            type: 'text',
            sourcepos: pos(1, 1, 1, 5),
            literal: 'Hello'
          },
          next: null
        }
      });
    });

    it('update sourcepos for every next nodes', () => {
      const doc = new MarkdownDocument('Hello\n\nMy\n\nWorld *!!*');
      const result = doc.editMarkdown([1, 1], [1, 1], 'Hey,\n');
      const root = doc.getRootNode();

      expect(result.nodes.length).toBe(1);
      expect(result.nodes[0]).toBe(root.firstChild!);
      expect(doc.getLineTexts()).toEqual(['Hey,', 'Hello', '', 'My', '', 'World *!!*']);
      expect(root).toMatchObject({
        type: 'document',
        sourcepos: pos(1, 1, 6, 10),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 1, 2, 5),
          firstChild: {
            type: 'text',
            sourcepos: pos(1, 1, 1, 4),
            literal: 'Hey,',
            next: {
              type: 'softbreak',
              sourcepos: pos(1, 5, 1, 5),
              next: {
                type: 'text',
                sourcepos: pos(2, 1, 2, 5),
                literal: 'Hello'
              }
            }
          },
          next: {
            type: 'paragraph',
            sourcepos: pos(4, 1, 4, 2),
            firstChild: {
              type: 'text',
              sourcepos: pos(4, 1, 4, 2),
              literal: 'My'
            },
            next: {
              type: 'paragraph',
              sourcepos: pos(6, 1, 6, 10),
              firstChild: {
                type: 'text',
                sourcepos: pos(6, 1, 6, 6),
                literal: 'World ',
                next: {
                  type: 'emph',
                  sourcepos: pos(6, 7, 6, 10),
                  firstChild: {
                    type: 'text',
                    sourcepos: pos(6, 8, 6, 9),
                    literal: '!!'
                  }
                }
              }
            }
          }
        }
      });
    });
  });
});
