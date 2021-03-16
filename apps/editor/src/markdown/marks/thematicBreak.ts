import { DOMOutputSpecArray } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { createParagraph, createTextSelection } from '@/helper/manipulation';
import { resolveSelectionPos } from '../helper/pos';

const thematicBreakSyntax = '***';

export class ThematicBreak extends Mark {
  get name() {
    return 'thematicBreak';
  }

  get defaultSchema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: clsWithMdPrefix('thematic-break') }, 0];
      },
    };
  }

  private hr(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, schema, tr, doc } = state;
      const [from, to] = resolveSelectionPos(selection);
      const emptyNode = createParagraph(schema);
      const hrNode = createParagraph(schema, thematicBreakSyntax);
      const nodes = [hrNode];

      if (to >= doc.resolve(to).end()) {
        nodes.push(emptyNode);
      }

      // add 3(`***` length) and 3(start, end block tag position)
      dispatch!(tr.replaceWith(from, to, nodes).setSelection(createTextSelection(tr, from + 6)));

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
