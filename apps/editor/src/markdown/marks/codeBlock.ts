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
import { getRangeInfo } from '../helper/pos';
import { getTextContent } from '../helper/query';

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
      const { startFromOffset, endToOffset, startIndex, endIndex } = getRangeInfo(selection);
      const fencedNode = createParagraph(schema, '```');
      const nodes: ProsemirrorNode[] = [fencedNode];

      for (let i = startIndex; i <= endIndex; i += 1) {
        const textContent = getTextContent(doc, i);

        nodes.push(createParagraph(schema, textContent));
      }
      nodes.push(fencedNode);

      const tr = replaceNodes(state.tr, startFromOffset, endToOffset, nodes);

      dispatch!(tr.setSelection(createTextSelection(tr, startFromOffset + 4)));

      return true;
    };
  }

  private keepIndentation(): Command {
    return ({ selection, tr, doc, schema }, dispatch) => {
      const { toastMark } = this.context;
      const { startFromOffset, endToOffset, endIndex, from, to } = getRangeInfo(selection);
      const textContent = getTextContent(doc, endIndex);

      if (from === to && textContent.trim()) {
        const matched = textContent.match(/^\s+/);
        const mdNode = toastMark.findFirstNodeAtLine(endIndex + 1)!;

        if (isCodeBlockNode(mdNode) && matched) {
          const [spaces] = matched;
          const slicedText = textContent.slice(to - startFromOffset);
          const node = createParagraph(schema, spaces + slicedText);
          const newTr = slicedText
            ? replaceNodes(tr, to, endToOffset, node, { from: 0, to: 1 })
            : insertNodes(tr, endToOffset, node);
          const newSelection = createTextSelection(newTr, endToOffset + spaces.length + 2);

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
