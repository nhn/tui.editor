import { DOMOutputSpecArray } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { interpolatePos } from './helper/pos';

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

  get commandName() {
    return 'italic';
  }

  commands(): Command {
    return (state, dispatch) => {
      const [from, to] = interpolatePos(state.selection);
      const { empty } = state.selection;
      const slice = state.selection.content();
      // @ts-ignore
      const textContent = slice.content.textBetween(0, slice.content.size, '\n');
      let { tr } = state;

      if (reEmph.test(textContent)) {
        tr = tr.delete(to - 1, to).delete(from, from + 1);
      } else {
        tr = tr.insertText(emphSyntax, to, to).insertText(emphSyntax, from, from);
        const selection = empty
          ? TextSelection.create(tr.doc, from + 1, from + 1)
          : TextSelection.create(tr.doc, from, to + 2);

        tr = tr.setSelection(selection);
      }
      dispatch!(tr);

      return true;
    };
  }

  keymaps() {
    return { 'Mod-i': this.commands(), 'Mod-I': this.commands() };
  }
}
