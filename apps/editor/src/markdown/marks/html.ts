import { DOMOutputSpecArray } from 'prosemirror-model';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';

export class Html extends Mark {
  get name() {
    return 'html';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('html') }, 0];
      }
    };
  }
}
