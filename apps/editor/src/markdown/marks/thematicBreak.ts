import { DOMOutputSpecArray } from 'prosemirror-model';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';

export class ThematicBreak extends Mark {
  get name() {
    return 'thematicBreak';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('thematic-break') }, 0];
      }
    };
  }
}
