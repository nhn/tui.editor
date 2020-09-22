import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';

export class Link extends Mark {
  get name() {
    return 'link';
  }

  get schema() {
    return {
      attrs: {
        url: { default: false },
        desc: { default: false }
      },
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        const { url, desc } = attrs;
        let classNames = 'link';

        if (url) {
          classNames += '|link-url|marked-text';
        }
        if (desc) {
          classNames += '|link-desc|marked-text';
        }

        return ['span', { class: cls(...classNames.split('|')) }, 0];
      }
    };
  }
}
