import { DOMOutputSpecArray } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { interpolatePos } from '../helper/pos';

const reStrong = /^(\*{2}|_{2}).*([\s\S]*)\1$/m;
const strongSyntax = '**';

export class Strong extends Mark {
  get name() {
    return 'strong';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('strong') }, 0];
      }
    };
  }

  get commandName() {
    return 'bold';
  }

  commands(): Command {
    return (state, dispatch) => {
      const [from, to] = interpolatePos(state.selection);
      const { empty } = state.selection;
      const slice = state.selection.content();
      // @ts-ignore
      const textContent = slice.content.textBetween(0, slice.content.size, '\n');
      let { tr } = state;

      if (reStrong.test(textContent)) {
        tr = tr.delete(to - 2, to).delete(from, from + 2);
      } else {
        tr = tr.insertText(strongSyntax, to).insertText(strongSyntax, from);
        const selection = empty
          ? TextSelection.create(tr.doc, from + 2, from + 2)
          : TextSelection.create(tr.doc, from, to + 4);

        tr = tr.setSelection(selection);
      }
      dispatch!(tr);

      return true;
    };
  }

  keymaps() {
    return { 'Mod-b': this.commands(), 'Mod-B': this.commands() };
  }
}
