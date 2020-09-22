import { DOMOutputSpecArray } from 'prosemirror-model';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';

export class Table extends Mark {
  get name() {
    return 'table';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('table') }, 0];
      }
    };
  }
}
