import { DOMOutputSpecArray, Fragment } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import type { Transaction } from 'prosemirror-state';
import { EditorCommand, MdSpecContext } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { createText, createTextSelection } from '@/helper/manipulation';
import { isCodeBlockNode } from '@/utils/markdown';
import { getRangeInfo } from '../helper/pos';
import { getTextContent } from '../helper/query';

const fencedCodeBlockSyntax = '```';

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
      const { selection, doc, schema, tr } = state;
      const { startFromOffset, endToOffset, startIndex, endIndex } = getRangeInfo(selection);
      const fencedNode = createText(schema, fencedCodeBlockSyntax);
      let from = startFromOffset;

      // add fenced start block
      tr.insert(startFromOffset, fencedNode).split(startFromOffset + 3);

      for (let i = startIndex; i <= endIndex; i += 1) {
        const { nodeSize, textContent, content } = doc.child(i);
        const node = textContent ? createText(schema, textContent) : Fragment.empty;
        const mappedFrom = tr.mapping.map(from);
        const mappedTo = mappedFrom + content.size;

        tr.replaceWith(mappedFrom, mappedTo, node);
        from += nodeSize;
      }
      // add fenced end block
      tr.split(tr.mapping.map(endToOffset)).insert(tr.mapping.map(endToOffset), fencedNode);

      dispatch!(
        tr.setSelection(
          // subtract fenced syntax length and open, close tag(2)
          createTextSelection(tr, tr.mapping.map(endToOffset) - (fencedCodeBlockSyntax.length + 2))
        )
      );

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
          const slicedTextLen = slicedText.length;
          const node = createText(schema, spaces + slicedText);

          (tr.split(endToOffset) as Transaction)
            .delete(endToOffset - slicedTextLen, endToOffset)
            .insert(tr.mapping.map(endToOffset), node)
            .setSelection(createTextSelection(tr, tr.mapping.map(endToOffset) - slicedTextLen));

          dispatch!(tr);

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
