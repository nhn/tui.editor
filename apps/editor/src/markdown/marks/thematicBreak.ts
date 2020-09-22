import { DOMOutputSpecArray } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { TextSelection } from 'prosemirror-state';
import { Context } from '@t/spec';
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

  commands({ schema }: Context): Command {
    return (state, dispatch) => {
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
    return { 'Mod-l': this.commands(context), 'Mod-L': this.commands(context) };
  }
}
