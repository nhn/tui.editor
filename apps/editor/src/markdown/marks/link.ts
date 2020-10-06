import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { Context, EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { resolveSelectionPos } from '../helper/pos';

const encodingRegExps = [/\(/g, /\)/g, /\[/g, /\]/g, /</g, />/g];
const encodedList = ['%28', '%29', '%5B', '%5D', '%3C', '%3E'];
const escapedList = ['\\(', '\\)', '\\[', '\\]', '\\<', '\\>'];

function decodeURIGraceful(uri: string) {
  const uriList = uri.split(' ');

  return uriList
    .reduce<string[]>((decodedURIList, targetUri) => {
      let decodedURI = '';

      try {
        decodedURI = decodeURIComponent(targetUri).replace(/ /g, '%20');
      } catch (e) {
        decodedURI = targetUri;
      }

      return decodedURIList.concat(decodedURI);
    }, [])
    .join(' ');
}

function replaceMarkdownText(text: string, encode: boolean) {
  const expectedValues = encode ? encodedList : escapedList;

  return encodingRegExps.reduce(
    (result, regExp, index) => result.replace(regExp, expectedValues[index]),
    text
  );
}

type CommandType = 'image' | 'link';

interface Payload {
  linkText: string;
  altText: string;
  linkUrl: string;
  imageUrl: string;
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

  private addLinkOrImage({ schema }: Context, commandType: CommandType): EditorCommand<Payload> {
    return payload => (state, dispatch) => {
      const [from, to] = resolveSelectionPos(state.selection);
      const { linkText, altText, linkUrl, imageUrl } = payload!;
      let text = linkText;
      let url = linkUrl;
      let syntax = '';

      if (commandType === 'image') {
        text = altText;
        url = imageUrl;
        syntax = '!';
      }

      text = replaceMarkdownText(decodeURIGraceful(text), false);
      url = replaceMarkdownText(url, true);
      syntax += `[${text}](${url})`;

      const tr = state.tr.replaceWith(from, to, schema.text(syntax));

      dispatch!(tr);

      return true;
    };
  }

  commands(context: Context) {
    return {
      addImage: this.addLinkOrImage(context, 'image'),
      addLink: this.addLinkOrImage(context, 'link')
    };
  }
}
