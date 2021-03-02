import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { EditorCommand, MdSpecContext } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import {
  createParagraph,
  createTextSelection,
  insertNodes,
  replaceNodes,
} from '@/helper/manipulation';
import { isCodeBlockNode } from '@/utils/markdown';
import { getRangeInfo, resolveSelectionPos } from '../helper/pos';

export class CodeBlock extends Mark {
  context!: MdSpecContext;

  get name() {
    return 'codeBlock';
  }

  get defaultSchema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: clsWithMdPrefix('code-block') }, 0];
      },
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, doc, schema } = state;
      const { startOffset, endOffset, startIndex, endIndex } = getRangeInfo(selection);
      const fencedNode = createParagraph(schema, '```');
      const nodes: ProsemirrorNode[] = [fencedNode];

      for (let i = startIndex; i <= endIndex; i += 1) {
        const { textContent } = doc.child(i);

        nodes.push(createParagraph(schema, textContent));
      }
      nodes.push(fencedNode);

      const tr = replaceNodes(state.tr, startOffset, endOffset, nodes);

      dispatch!(tr.setSelection(createTextSelection(tr, startOffset + 4)));

      return true;
    };
  }

  private keepIndentation(): Command {
    return ({ selection, tr, doc, schema }, dispatch) => {
      const { toastMark } = this.context;
      const [from, to] = resolveSelectionPos(selection);
      const { startOffset, endOffset, endIndex } = getRangeInfo(selection);
      const { textContent } = doc.child(endIndex);

      if (from === to && textContent.trim()) {
        let matched;
        const mdNode = toastMark.findFirstNodeAtLine(endIndex + 1);

        if (isCodeBlockNode(mdNode) && (matched = textContent.match(/^\s+/))) {
          const [spaces] = matched;
          const slicedText = textContent.slice(to - startOffset);
          const node = createParagraph(schema, spaces + slicedText);
          const newTr = slicedText
            ? replaceNodes(tr, to, endOffset, node, { from: 0, to: 1 })
            : insertNodes(tr, endOffset, node);
          const newSelection = createTextSelection(newTr, endOffset + spaces.length + 2);

          dispatch!(newTr.setSelection(newSelection));

          return true;
        }
      }
      return false;
    };
  }

  keymaps() {
    const codeBlockCommand = this.commands()();

    return {
      'Shift-Mod-p': codeBlockCommand,
      'Shift-Mod-P': codeBlockCommand,
      Enter: this.keepIndentation(),
    };
  }
}
