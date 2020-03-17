import { Parser } from '../blocks';

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
