import { DOMOutputSpecArray } from 'prosemirror-model';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';

export class CustomInline extends Mark {
  get name() {
    return 'customInline';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: clsWithMdPrefix('custom-inline') }, 0];
      },
    };
  }
}
