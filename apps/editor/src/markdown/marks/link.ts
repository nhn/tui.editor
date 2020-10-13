import { DOMOutputSpecArray, Mark as ProsemirrorMark } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { decodeURIGraceful, replaceMarkdownText } from '@/utils/encoder';
import { resolveSelectionPos } from '../helper/pos';
import { createText } from '../helper/manipulation';

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

  private addLinkOrImage(commandType: CommandType): EditorCommand<Payload> {
    return payload => ({ selection, tr, schema }, dispatch) => {
      const [from, to] = resolveSelectionPos(selection);
      const { linkText, altText, linkUrl, imageUrl } = payload!;
      let text = linkText;
      let url = linkUrl;
      let syntax = '';

      if (commandType === 'image') {
        text = altText;
        url = imageUrl;
        syntax = '!';
      }

      text = replaceMarkdownText(text, false);
      url = replaceMarkdownText(decodeURIGraceful(url), true);
      syntax += `[${text}](${url})`;

      const newTr = tr.replaceWith(from, to, createText(schema, syntax));

      dispatch!(newTr);

      return true;
    };
  }

  commands() {
    return {
      addImage: this.addLinkOrImage('image'),
      addLink: this.addLinkOrImage('link')
    };
  }
}
