import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { createTextSelection, replaceTextNode } from '@/helper/manipulation';
import { getRangeInfo } from '../helper/pos';

const reHeading = /^#{1,6}\s/;

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
        seText: { default: false },
      },
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpec {
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
    return (payload) => (state, dispatch) => {
      const { level } = payload!;
      const { startFromOffset, endToOffset, startIndex, endIndex } = getRangeInfo(state.selection);

      const tr = replaceTextNode({
        state,
        from: startFromOffset,
        startIndex,
        endIndex,
        createText: (textContent) => {
          const matchedHeading = textContent.match(reHeading);
          const curHeadingSyntax = matchedHeading ? matchedHeading[0] : '';

          return this.createHeadingText(level, textContent, curHeadingSyntax);
        },
      });

      dispatch!(tr.setSelection(createTextSelection(tr, tr.mapping.map(endToOffset))));
      return true;
    };
  }
}
