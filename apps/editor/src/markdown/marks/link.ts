import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { Context, EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { resolveSelectionPos } from '../helper/pos';

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

type CommandType = 'image' | 'link';

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

  private addLinkOrImage({ schema }: Context, commandType: CommandType): EditorCommand {
    return payload => (state, dispatch) => {
      const [from, to] = resolveSelectionPos(state.selection);
      const { linkText, altText, url: linkUrl, imageUrl } = payload!;
      let text = linkText;
      let url = linkUrl;
      let syntax = '';

      if (commandType === 'image') {
        text = altText;
        url = imageUrl;
        syntax = '!';
      }

      text = escapeMarkdownText(decodeURIGraceful(text));
      url = encodeMarkdownText(url);
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
