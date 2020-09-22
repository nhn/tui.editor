import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';

export class ListItem extends Mark {
  get name() {
    return 'listItem';
  }

  get schema() {
    return {
      attrs: {
        odd: { default: false },
        even: { default: false },
        listStyle: { default: false }
      },
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        const { odd, even, listStyle } = attrs;
        let classNames = 'list-item';

        if (listStyle) {
          classNames += '|list-item-style';
        }
        if (odd) {
          classNames += '|list-item-odd';
        }
        if (even) {
          classNames += '|list-item-even';
        }
        return ['span', { class: cls(...classNames.split('|')) }, 0];
      }
    };
  }
}
