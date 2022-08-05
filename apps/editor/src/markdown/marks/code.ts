import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { toggleMark } from '../helper/mdCommand';

const reCode = /^(`).*([\s\S]*)\1$/m;
const codeSyntax = '`';

export class Code extends Mark {
  get name() {
    return 'code';
  }

  get schema() {
    return {
      attrs: {
        start: { default: false },
        end: { default: false },
        marked: { default: false },
      },
      toDOM(mark: ProsemirrorMark): DOMOutputSpec {
        const { start, end, marked } = mark.attrs;
        let classNames = 'code';

        if (start) {
          classNames += '|delimiter|start';
        }
        if (end) {
          classNames += '|delimiter|end';
        }
        if (marked) {
          classNames += '|marked-text';
        }

        return ['span', { class: clsWithMdPrefix(...classNames.split('|')) }, 0];
      },
    };
  }

  commands(): EditorCommand {
    return toggleMark(reCode, codeSyntax);
  }

  keymaps() {
    const codeCommand = this.commands()();

    return { 'Shift-Mod-c': codeCommand, 'Shift-Mod-C': codeCommand };
  }
}
