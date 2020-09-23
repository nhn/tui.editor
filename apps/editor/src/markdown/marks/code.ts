import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { resolveSelectionPos } from '../helper/pos';

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
        marked: { default: false }
      },
      toDOM(mark: ProsemirrorMark): DOMOutputSpecArray {
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

        return ['span', { class: cls(...classNames.split('|')) }, 0];
      }
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => {
      const [from, to] = resolveSelectionPos(state.selection);
      const { empty } = state.selection;
      const slice = state.selection.content();
      // @ts-ignore
      const textContent = slice.content.textBetween(0, slice.content.size, '\n');
      let { tr } = state;

      if (reCode.test(textContent)) {
        tr = tr.delete(to - 1, to).delete(from, from + 1);
      } else {
        tr = tr.insertText(codeSyntax, to).insertText(codeSyntax, from);
        const selection = empty
          ? TextSelection.create(tr.doc, from + 1, from + 1)
          : TextSelection.create(tr.doc, from, to + 2);

        tr = tr.setSelection(selection);
      }
      dispatch!(tr);

      return true;
    };
  }
}
