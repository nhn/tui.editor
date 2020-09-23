import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { Context, EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { interpolatePos } from '../helper/pos';

function decodeURIGraceful(uri: string) {
  const uriList = uri.split(' ');

  return uriList
    .reduce((decodedURIList, targetUri) => {
      let decodedURI = '';

      try {
        decodedURI = decodeURIComponent(targetUri).replace(/ /g, '%20');
      } catch (e) {
        decodedURI = targetUri;
      }

      return decodedURIList.concat(decodedURI);
    }, [] as string[])
    .join(' ');
}

function encodeMarkdownText(text: string) {
  return text
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\[/g, '%5B')
    .replace(/\]/g, '%5D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E');
}

function escapeMarkdownText(text: string) {
  return text
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>');
}

export class Link extends Mark {
  get name() {
    return 'link';
  }

  get schema() {
    return {
      attrs: {
        url: { default: false },
        desc: { default: false }
      },
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpecArray {
        const { url, desc } = attrs;
        let classNames = 'link';

        if (url) {
          classNames += '|link-url|marked-text';
        }
        if (desc) {
          classNames += '|link-desc|marked-text';
        }

        return ['span', { class: cls(...classNames.split('|')) }, 0];
      }
    };
  }

  get commandName() {
    return 'addImage';
  }

  commands({ schema }: Context): EditorCommand {
    return payload => (state, dispatch) => {
      const [from, to] = interpolatePos(state.selection);

      let { altText, imageUrl } = payload!;

      altText = decodeURIGraceful(altText);
      altText = escapeMarkdownText(altText);
      imageUrl = encodeMarkdownText(imageUrl);

      const imageSyntax = `![${altText}](${imageUrl})`;
      const tr = state.tr.replaceWith(from, to, schema.text(imageSyntax));

      dispatch!(tr);

      return true;
    };
  }
}
