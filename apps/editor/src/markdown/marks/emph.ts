import { DOMOutputSpecArray } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { resolveSelectionPos } from '../helper/pos';
import { createTextSelection } from '../helper/manipulation';

const reEmph = /^(\*|_).*([\s\S]*)\1$/m;
const emphSyntax = '*';

export class Emph extends Mark {
  get name() {
    return 'emph';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('emph') }, 0];
      }
    };
  }

  private italic(): EditorCommand {
    return () => (state, dispatch) => {
      const [from, to] = resolveSelectionPos(state.selection);
      const { empty } = state.selection;
      const slice = state.selection.content();
      const textContent = slice.content.textBetween(0, slice.content.size, '\n');
      let { tr } = state;

      if (reEmph.test(textContent)) {
        tr = tr.delete(to - 1, to).delete(from, from + 1);
      } else {
        tr = tr.insertText(emphSyntax, to).insertText(emphSyntax, from);
        const selection = empty
          ? createTextSelection(tr, from + 1)
          : createTextSelection(tr, from, to + 2);

        tr = tr.setSelection(selection);
      }
      dispatch!(tr);

      return true;
    };
  }

  commands() {
    return { italic: this.italic() };
  }

  keymaps() {
    const italicCommand = this.italic()();

    return { 'Mod-i': italicCommand, 'Mod-I': italicCommand };
  }
}
