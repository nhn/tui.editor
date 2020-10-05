import { DOMOutputSpecArray, Mark as ProsemirrorMark, ProsemirrorNode } from 'prosemirror-model';
import { EditorCommand, Context } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { getExtendedRangeOffset, resolveSelectionPos } from '../helper/pos';
import { createParagraph, replaceBlockNodes } from '../helper/manipulation';

const reHeading = /^#+\s/;

interface Payload {
  level: number;
}

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

  private getChangedText(level: number, text: string, curHeadingSyntax: string) {
    const textContent = text.replace(curHeadingSyntax, '');
    let newLevel = '';

    while (level > 0) {
      newLevel += '#';
      level -= 1;
    }

    return textContent ? `${newLevel} ${textContent}` : `${newLevel} `;
  }

  commands({ schema }: Context): EditorCommand<Payload> {
    return payload => (state, dispatch) => {
      const { level } = payload!;
      const { selection, doc, tr } = state;
      const [from, to] = resolveSelectionPos(selection);
      const [startOffset, endOffset] = getExtendedRangeOffset(from, to, doc);

      const nodes: ProsemirrorNode[] = [];

      state.doc.nodesBetween(startOffset, endOffset, ({ isBlock, textContent }) => {
        if (isBlock) {
          const matchedHeading = textContent.match(reHeading);

          const curHeadingSyntax = matchedHeading ? matchedHeading[0] : '';
          const curLevel = curHeadingSyntax.trim().length;

          if (!curLevel || curLevel !== level) {
            const result = this.getChangedText(level, textContent, curHeadingSyntax);

            nodes.push(createParagraph(schema, result));
          }
        }
      });

      if (nodes.length) {
        dispatch!(replaceBlockNodes(tr, startOffset, endOffset, nodes));
        return true;
      }

      return false;
    };
  }
}
