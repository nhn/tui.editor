import { DOMOutputSpec } from 'prosemirror-model';
import type { Transaction } from 'prosemirror-state';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { createTextNode, createTextSelection } from '@/helper/manipulation';
import { getRangeInfo } from '../helper/pos';

const thematicBreakSyntax = '***';

export class ThematicBreak extends Mark {
  get name() {
    return 'thematicBreak';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpec {
        return ['span', { class: clsWithMdPrefix('thematic-break') }, 0];
      },
    };
  }

  private hr(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, schema, tr } = state;
      const { from, to, endToOffset } = getRangeInfo(selection);
      const node = createTextNode(schema, thematicBreakSyntax);

      (tr
        .split(from)
        .replaceWith(tr.mapping.map(from), tr.mapping.map(to), node)
        .split(tr.mapping.map(to)) as Transaction).setSelection(
        createTextSelection(tr, tr.mapping.map(endToOffset))
      );

      dispatch!(tr);
      return true;
    };
  }

  commands() {
    return { hr: this.hr() };
  }

  keymaps() {
    const lineCommand = this.hr()();

    return { 'Mod-l': lineCommand, 'Mod-L': lineCommand };
  }
}
