import { Parser, CustomParserMap } from '../blocks';
import { pos } from './helper.spec';
import { Node } from '../node';

it('tags in disallowedHtmlBlockTags should not be parsed as a HTML block', () => {
  const reader = new Parser({ disallowedHtmlBlockTags: ['br', 'span'] });
  const root = reader.parse('<BR />\nHello\n\n<span class="toast">\nWorld');

  expect(root).toMatchObject({
    type: 'document',
    firstChild: {
      type: 'paragraph',
      firstChild: {
        type: 'htmlInline',
        literal: '<BR />',
        next: {
          type: 'softbreak',
          next: {
            type: 'text',
            literal: 'Hello'
          }
        }
      },
      next: {
        type: 'paragraph',
        firstChild: {
          type: 'htmlInline',
          literal: '<span class="toast">',
          next: {
            type: 'softbreak',
            next: {
              type: 'text',
              literal: 'World'
            }
          }
        }
      }
    }
  });
});

describe('disallowDeepHeading: true', () => {
  it('the nested seTextHeading is disallowed in list', () => {
    const reader = new Parser({ disallowDeepHeading: true });
    const root = reader.parse('- item1\n\t-');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'list',
        firstChild: {
          type: 'item',
          listData: {
            bulletChar: '-',
            markerOffset: 0,
            padding: 2,
            start: 0,
            type: 'bullet'
          },
          firstChild: {
            type: 'paragraph',
            sourcepos: pos(1, 3, 2, 2),
            firstChild: {
              type: 'text',
              literal: 'item1',
              next: {
                type: 'softbreak',
                next: {
                  type: 'text',
                  literal: '-',
                  sourcepos: pos(2, 2, 2, 2)
                }
              }
            }
          }
        }
      }
    });
  });

  it('the nested atxHeading is disallowed in list', () => {
    const reader = new Parser({ disallowDeepHeading: true });
    const root = reader.parse('- # item1');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'list',
        firstChild: {
          type: 'item',
          listData: {
            bulletChar: '-',
            markerOffset: 0,
            padding: 2,
            start: 0,
            type: 'bullet'
          },
          firstChild: {
            type: 'paragraph',
            sourcepos: pos(1, 3, 1, 9),
            firstChild: {
              type: 'text',
              literal: '# item1',
              sourcepos: pos(1, 3, 1, 9)
            }
          }
        }
      }
    });
  });

  it('the nested seTextHeading is disallowed in blockquote', () => {
    const reader = new Parser({ disallowDeepHeading: true });
    const root = reader.parse('> item1\n> -');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'blockQuote',
        sourcepos: pos(1, 1, 2, 3),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 3, 2, 3),
          firstChild: {
            type: 'text',
            literal: 'item1',
            sourcepos: pos(1, 3, 1, 7),
            next: {
              type: 'softbreak',
              next: {
                type: 'text',
                literal: '-',
                sourcepos: pos(2, 3, 2, 3)
              }
            }
          }
        }
      }
    });
  });

  it('the nested atxHeading is disallowed in blockquote', () => {
    const reader = new Parser({ disallowDeepHeading: true });
    const root = reader.parse('> # item1');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'blockQuote',
        sourcepos: pos(1, 1, 1, 9),
        firstChild: {
          type: 'paragraph',
          sourcepos: pos(1, 3, 1, 9),
          firstChild: {
            type: 'text',
            literal: '# item1',
            sourcepos: pos(1, 3, 1, 9)
          }
        }
      }
    });
  });
});

it('should apply the custom parser', () => {
  let inEmph = false;
  const customParser: CustomParserMap = {
    emph(node: Node, { entering }) {
      inEmph = entering;

      while (node.firstChild) {
        node.insertBefore(node.firstChild);
      }
      node.unlink();
    },
    text(node: Node) {
      if (inEmph) {
        node.literal = node.literal!.toUpperCase();
      }
    }
  };
  const reader = new Parser({ customParser });
  const root = reader.parse('*test*');

  expect(root).toMatchObject({
    type: 'document',
    firstChild: {
      type: 'paragraph',
      sourcepos: pos(1, 1, 1, 6),
      firstChild: {
        type: 'text',
        sourcepos: pos(1, 2, 1, 5),
        literal: 'TEST'
      }
    }
  });
});
