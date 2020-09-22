import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';

export class Heading extends Mark {
  get name() {
    return 'heading';
  }

  get schema() {
    return {
      attrs: {
        level: { default: 1 },
        seText: { default: false }
      },
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        const { level, seText } = attrs;
        let classNames = `heading|heading${level}`;

        if (seText) {
          classNames += '|delimiter|setext';
        }
        return ['span', { class: cls(...classNames.split('|')) }, 0];
      }
    };
  }
}
