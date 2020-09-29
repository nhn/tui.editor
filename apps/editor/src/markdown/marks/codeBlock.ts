import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { Context, EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import {
  getExtendedRangeOffset,
  resolveSelectionPos,
  replaceBlockNodes,
  spaceToNbsp
} from '../helper/pos';

const fencedSyntax = '```';

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

      const nodes: ProsemirrorNode[] = [
        schema.nodes.paragraph.create(null, schema.text(fencedSyntax))
      ];

      state.doc.nodesBetween(startOffset, endOffset, ({ isBlock, textContent }) => {
        if (isBlock) {
          nodes.push(
            schema.nodes.paragraph.create(
              null,
              textContent ? schema.text(spaceToNbsp(textContent)) : []
            )
          );
        }
      });
      nodes.push(schema.nodes.paragraph.create(null, schema.text(fencedSyntax)));

      const tr = replaceBlockNodes(state.tr, startOffset, endOffset, nodes);

      dispatch!(tr.setSelection(TextSelection.create(tr.doc, startOffset + 4)));

      return true;
    };
  }
}
