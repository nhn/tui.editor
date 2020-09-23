import {
  DOMOutputSpecArray,
  Mark as ProsemirrorMark,
  Node as ProsemirrorNode
} from 'prosemirror-model';
import { EditorCommand, Context } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { resolveSelectionPos } from '../helper/pos';

const reHeading = /^#+\s/;

export class Heading extends Mark {
  get name() {
    return 'heading';
  }

  get schema() {
    return {
      attrs: {
        level: { default: 1 },
        seText: { default: false }
      },
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        const { level, seText } = attrs;
        let classNames = `heading|heading${level}`;

        if (seText) {
          classNames += '|delimiter|setext';
        }
        return ['span', { class: cls(...classNames.split('|')) }, 0];
      }
    };
  }

  private getHeading(level: number, text: string, curHeadingSyntax: string) {
    const textContent = text.replace(curHeadingSyntax, '');
    let newLevel = '';

    while (level > 0) {
      newLevel += '#';
      level -= 1;
    }

    // insert the nbsp to preserve the space for markdown parser
    return `${newLevel}\u00a0${textContent}`;
  }

  commands({ schema }: Context): EditorCommand {
    return payload => (state, dispatch) => {
      const { level } = payload!;
      const { selection, doc, tr } = state;
      const [from, to] = resolveSelectionPos(selection);

      const startResolvedPos = doc.resolve(from);
      const startOffset = startResolvedPos.start();
      const endOffset = selection.empty ? startResolvedPos.end() : doc.resolve(to).end();

      const nodes: ProsemirrorNode[] = [];

      state.doc.nodesBetween(startOffset, endOffset, node => {
        if (node.isBlock) {
          const { textContent } = node;
          const matchedHeading = textContent.match(reHeading);

          const curHeadingSyntax = matchedHeading ? matchedHeading[0] : '';
          const curLevel = curHeadingSyntax.trim().length;

          if (!curLevel || curLevel !== level) {
            const result = this.getHeading(level, textContent, curHeadingSyntax);

            nodes.push(schema.nodes.paragraph.create(null, schema.text(result)));
          }
        }
      });

      dispatch!(
        tr
          .replaceWith(startOffset - 1, endOffset + 1, nodes)
          // To prevent incorrect calculation of the position for markdown parser
          .setMeta('resolvedPos', [startOffset, endOffset])
      );

      return true;
    };
  }
}
