import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';
import { Context, EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { resolveSelectionPos } from '../helper/pos';

const reBlockQuoteSyntax = /^> ?/;

export class BlockQuote extends Mark {
  get name() {
    return 'blockQuote';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('block-quote') }, 0];
      }
    };
  }

  commands({ schema }: Context): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, doc, tr } = state;
      const [from, to] = resolveSelectionPos(selection);

      const startResolvedPos = doc.resolve(from);
      const startOffset = startResolvedPos.start();
      const endOffset = selection.empty ? startResolvedPos.end() : doc.resolve(to).end();
      const isBlockQuote = reBlockQuoteSyntax.test(startResolvedPos.node().textContent);

      const nodes: ProsemirrorNode[] = [];

      state.doc.nodesBetween(startOffset, endOffset, node => {
        const { isBlock, textContent } = node;

        if (isBlock) {
          const result = isBlockQuote
            ? textContent.replace(reBlockQuoteSyntax, '').trim()
            : // insert the nbsp to preserve the space for markdown parser
              `>\u00a0${textContent.trim()}`;

          nodes.push(schema.nodes.paragraph.create(null, schema.text(result)));
        }
      });

      // @TODO: set caret position
      dispatch!(
        tr
          .replaceWith(startOffset - 1, endOffset + 1, nodes)
          // To prevent incorrect calculation of the position for markdown parser
          .setMeta('resolvedPos', [startOffset, endOffset])
      );

      return true;
    };
  }

  keymaps(context: Context) {
    const commandResult = this.commands(context)();

    return { 'alt-q': commandResult, 'alt-Q': commandResult };
  }
}
