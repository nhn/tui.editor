import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import {
  createParagraph,
  createTextSelection,
  insertNodes,
  replaceNodes,
} from '@/helper/manipulation';
import { isCodeBlockNode } from '@/utils/markdown';
import { getExtendedRangeOffset, getPosInfo, resolveSelectionPos } from '../helper/pos';
import { getTextByMdLine } from '../helper/query';

export class CodeBlock extends Mark {
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

  private keepIndentation(): Command {
    return ({ selection, tr, doc, schema }, dispatch) => {
      const { toastMark } = this.context;
      const { to, startOffset, endOffset, endLine } = getPosInfo(doc, selection, true);
      const lineText = getTextByMdLine(doc, endLine);

      if (selection.from === selection.to && lineText.trim()) {
        let matched;
        const mdNode = toastMark.findFirstNodeAtLine(endLine);

        if (isCodeBlockNode(mdNode) && (matched = lineText.match(/^\s+/))) {
          const [spaces] = matched;
          const slicedText = lineText.slice(to - startOffset);

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
