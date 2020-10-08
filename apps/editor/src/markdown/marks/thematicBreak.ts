import { DOMOutputSpecArray } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { resolveSelectionPos } from '../helper/pos';
import { createParagraph } from '../helper/manipulation';

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

  private line(): EditorCommand {
    return () => (state, dispatch) => {
      const { schema } = this.context;
      const [from, to] = resolveSelectionPos(state.selection);
      const emptyNode = createParagraph(schema);
      const lineNode = createParagraph(schema, thematicBreakSyntax);
      const nodes = [lineNode];

      if (to >= state.doc.resolve(to).end()) {
        nodes.push(emptyNode);
      }

      const tr = state.tr.replaceWith(from, to, nodes);
      // add 3(`***` length) and 3(start, end block tag position)
      const selection = TextSelection.create(tr.doc, Math.min(from + 6, tr.doc.content.size));

      dispatch!(tr.setSelection(selection));

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
