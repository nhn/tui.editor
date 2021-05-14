import { DOMOutputSpecArray } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { createParagraph, createTextSelection, replaceNodes } from '@/helper/manipulation';
import { getRangeInfo } from '../helper/pos';

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
      const { selection, schema, tr } = state;
      const { from, to, endToOffset } = getRangeInfo(selection);
      const emptyNode = createParagraph(schema);
      const hrNode = createParagraph(schema, thematicBreakSyntax);
      const nodes = [hrNode];

      if (to >= endToOffset) {
        nodes.push(emptyNode);
      }

      replaceNodes(tr, from, to, nodes, { from: 0, to: 0 });
      // add 3(`***` length) and 3(start, end block tag position)
      dispatch!(tr.setSelection(createTextSelection(tr, from + 6)));

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
