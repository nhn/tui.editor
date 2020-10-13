import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { getExtendedRangeOffset, resolveSelectionPos } from '../helper/pos';
import { createParagraph, createTextSelection, replaceNodes } from '../helper/manipulation';

export class CodeBlock extends Mark {
  get name() {
    return 'codeBlock';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('code-block') }, 0];
      }
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, doc, schema } = state;
      const [from, to] = resolveSelectionPos(selection);
      const [startOffset, endOffset] = getExtendedRangeOffset(from, to, doc);

      const fencedNode = createParagraph(schema, '```');
      const nodes: ProsemirrorNode[] = [fencedNode];

      doc.nodesBetween(startOffset, endOffset, ({ isBlock, textContent }) => {
        if (isBlock) {
          nodes.push(createParagraph(schema, textContent));
        }
      });
      nodes.push(fencedNode);

      const tr = replaceNodes(state.tr, startOffset, endOffset, nodes);

      dispatch!(tr.setSelection(createTextSelection(tr, startOffset + 4)));

      return true;
    };
  }

  keymaps() {
    const codeBlockCommand = this.commands()();

    return { 'Shift-Mod-p': codeBlockCommand, 'Shift-Mod-P': codeBlockCommand };
  }
}
