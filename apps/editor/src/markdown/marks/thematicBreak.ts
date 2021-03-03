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

  private line(): EditorCommand {
    return () => (state, dispatch) => {
      const [from, to] = resolveSelectionPos(state.selection);
      const emptyNode = createParagraph(state.schema);
      const lineNode = createParagraph(state.schema, thematicBreakSyntax);
      const nodes = [lineNode];

      if (to >= state.doc.resolve(to).end()) {
        nodes.push(emptyNode);
      }

      const tr = state.tr.replaceWith(from, to, nodes);

      // add 3(`***` length) and 3(start, end block tag position)
      dispatch!(tr.setSelection(createTextSelection(tr, from + 6)));

      return true;
    };
  }

  commands() {
    return { hr: this.line() };
  }

  keymaps() {
    const lineCommand = this.line()();

    return { 'Mod-l': lineCommand, 'Mod-L': lineCommand };
  }
}
