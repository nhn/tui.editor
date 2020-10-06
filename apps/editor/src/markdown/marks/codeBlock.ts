import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { Context, EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { getExtendedRangeOffset, resolveSelectionPos } from '../helper/pos';
import { createParagraph, replaceBlockNodes } from '../helper/manipulation';

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

  commands({ schema }: Context): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, doc } = state;
      const [from, to] = resolveSelectionPos(selection);
      const [startOffset, endOffset] = getExtendedRangeOffset(from, to, doc);

      const fencedNode = createParagraph(schema, '```');
      const nodes: ProsemirrorNode[] = [fencedNode];

      state.doc.nodesBetween(startOffset, endOffset, ({ isBlock, textContent }) => {
        if (isBlock) {
          nodes.push(createParagraph(schema, textContent));
        }
      });
      nodes.push(fencedNode);

      const tr = replaceBlockNodes(state.tr, startOffset, endOffset, nodes);

      dispatch!(tr.setSelection(TextSelection.create(tr.doc, startOffset + 4)));

      return true;
    };
  }

  keymaps(context: Context) {
    const codeBlockCommand = this.commands(context)();

    return { 'Shift-Mod-p': codeBlockCommand, 'Shift-Mod-P': codeBlockCommand };
  }
}
