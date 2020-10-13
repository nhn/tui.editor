import { DOMOutputSpecArray } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { resolveSelectionPos } from '../helper/pos';
import { createTextSelection } from '../helper/manipulation';

const reStrike = /^(~{2}).*([\s\S]*)\1$/m;
const strikeSyntax = '~~';

export class Strike extends Mark {
  get name() {
    return 'strike';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('strike') }, 0];
      }
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => {
      const [from, to] = resolveSelectionPos(state.selection);
      const { empty } = state.selection;
      const slice = state.selection.content();
      const textContent = slice.content.textBetween(0, slice.content.size, '\n');
      let { tr } = state;

      if (reStrike.test(textContent)) {
        tr = tr.delete(to - 2, to).delete(from, from + 2);
      } else {
        tr = tr.insertText(strikeSyntax, to).insertText(strikeSyntax, from);
        const selection = empty
          ? createTextSelection(tr, from + 2)
          : createTextSelection(tr, from, to + 4);

        tr = tr.setSelection(selection);
      }
      dispatch!(tr);

      return true;
    };
  }

  keymaps() {
    const strikeCommand = this.commands()();

    return { 'Mod-s': strikeCommand, 'Mod-S': strikeCommand };
  }
}
