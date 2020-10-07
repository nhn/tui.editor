import { DOMOutputSpec, Mark as ProsemirrorMark, DOMOutputSpecArray } from 'prosemirror-model';

import Mark from '@/spec/mark';

export class Link extends Mark {
  get name() {
    return 'link';
  }

  get schema() {
    return {
      attrs: {
        href: { default: '' },
        title: { default: '' }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom: DOMOutputSpec) {
            return {
              href: (dom as HTMLElement).getAttribute('href'),
              title: (dom as HTMLElement).getAttribute('title') || ''
            };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        return ['a', attrs];
      }
    };
  }
}
