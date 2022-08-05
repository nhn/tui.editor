import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import { escapeTextForLink } from '@/utils/common';
import Mark from '@/spec/mark';
import { createTextNode } from '@/helper/manipulation';
import { resolveSelectionPos } from '../helper/pos';

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
        desc: { default: false },
      },
      toDOM({ attrs }: ProsemirrorMark): DOMOutputSpec {
        const { url, desc } = attrs;
        let classNames = 'link';

        if (url) {
          classNames += '|link-url|marked-text';
        }
        if (desc) {
          classNames += '|link-desc|marked-text';
        }

        return ['span', { class: clsWithMdPrefix(...classNames.split('|')) }, 0];
      },
    };
  }

  private addLinkOrImage(commandType: CommandType): EditorCommand<Payload> {
    return (payload) => ({ selection, tr, schema }, dispatch) => {
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

      text = escapeTextForLink(text);
      syntax += `[${text}](${url})`;

      dispatch!(tr.replaceWith(from, to, createTextNode(schema, syntax)));

      return true;
    };
  }

  commands() {
    return {
      addImage: this.addLinkOrImage('image'),
      addLink: this.addLinkOrImage('link'),
    };
  }
}
