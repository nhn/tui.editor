import { DOMOutputSpecArray } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { EditorCommand } from '@t/spec';
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

  commands(): EditorCommand {
    return () => (state, dispatch) => {
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
    const commandResult = this.commands()();

    return { 'Mod-b': commandResult, 'Mod-B': commandResult };
  }
}
