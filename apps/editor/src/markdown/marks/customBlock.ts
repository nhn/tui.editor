import { DOMOutputSpecArray } from 'prosemirror-model';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';

export class CustomBlock extends Mark {
  get name() {
    return 'customBlock';
  }

  get defaultSchema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('custom-block') }, 0];
      },
    };
  }
}
