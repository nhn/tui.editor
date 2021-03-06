import { DOMOutputSpecArray, Mark as ProsemirrorMark, ProsemirrorNode } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { createParagraph, replaceNodes } from '@/helper/manipulation';
import { getRangeInfo } from '../helper/pos';
import { getTextContent } from '../helper/query';

const reHeading = /^#{1,6}\s/;

interface Payload {
  level: number;
}

export class Heading extends Mark {
  get name() {
    return 'heading';
  }

  get defaultSchema() {
    return {
      attrs: {
        level: { default: 1 },
        seText: { default: false },
      },
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        const { level, seText } = attrs;
        let classNames = `heading|heading${level}`;

        if (seText) {
          classNames += '|delimiter|setext';
        }
        return ['span', { class: clsWithMdPrefix(...classNames.split('|')) }, 0];
      },
    };
  }

  private createHeadingText(level: number, text: string, curHeadingSyntax: string) {
    const textContent = text.replace(curHeadingSyntax, '').trim();
    let headingText = '';

    while (level > 0) {
      headingText += '#';
      level -= 1;
    }

    return `${headingText} ${textContent}`;
  }

  commands(): EditorCommand<Payload> {
    return (payload) => ({ selection, doc, tr, schema }, dispatch) => {
      const { level } = payload!;
      const { startFromOffset, endToOffset, startIndex, endIndex } = getRangeInfo(selection);
      const nodes: ProsemirrorNode[] = [];

      for (let i = startIndex; i <= endIndex; i += 1) {
        const textContent = getTextContent(doc, i);
        const matchedHeading = textContent.match(reHeading);
        const curHeadingSyntax = matchedHeading ? matchedHeading[0] : '';
        const curLevel = curHeadingSyntax.trim().length;

        if (curLevel !== level) {
          const result = this.createHeadingText(level, textContent, curHeadingSyntax);

          nodes.push(createParagraph(schema, result));
        }
      }

      if (nodes.length) {
        dispatch!(replaceNodes(tr, startFromOffset, endToOffset, nodes));
        return true;
      }
      return false;
    };
  }
}
