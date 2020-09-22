import { DOMOutputSpecArray } from 'prosemirror-model';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';

export class CodeBlock extends Mark {
  get name() {
    return 'codeBlock';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('code-block') }, 0];
      }
    };
  }
}
