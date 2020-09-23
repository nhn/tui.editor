import { DOMOutputSpecArray } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { Context, EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { interpolatePos } from '../helper/pos';

const thematicBreakSyntax = '***';

export class ThematicBreak extends Mark {
  get name() {
    return 'thematicBreak';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('thematic-break') }, 0];
      }
    };
  }

  get commandName() {
    return 'hr';
  }

  commands({ schema }: Context): EditorCommand {
    return () => (state, dispatch) => {
      const [from, to] = interpolatePos(state.selection);
      const tr = state.tr.replaceWith(from, to, [
        schema.nodes.paragraph.create(null, schema.text(thematicBreakSyntax)),
        schema.nodes.paragraph.create(null)
      ]);
      // add 3(`***` length) and 3(start, end block tag position)
      const selection = TextSelection.create(tr.doc, Math.min(to + 6, tr.doc.content.size));

      dispatch!(tr.setSelection(selection));

      return true;
    };
  }

  keymaps(context: Context) {
    const commandResult = this.commands(context)();

    return { 'Mod-l': commandResult, 'Mod-L': commandResult };
  }
}
