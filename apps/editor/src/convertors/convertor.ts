import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';

import { MdNode } from '@t/markdown';
import { ToWwConvertorMap, ToMdConvertorMap } from '@t/convertor';

import { toWwConvertors } from './toWwConvertors';
import ToWwConvertorState from './toWwConvertorState';

import { toMdConvertors } from './toMdConvertors';
import ToMdConvertorState from './toMdConvertorState';

export default class Convertor {
  private readonly schema: Schema;

  private readonly toWwConvertors: ToWwConvertorMap;

  private readonly toMdConvertors: ToMdConvertorMap;

  private readonly linkAttribute: Record<string, any>;

  constructor(schema: Schema, linkAttribute: Record<string, any>) {
    this.schema = schema;

    // @TODO to be extended with public option
    this.toWwConvertors = toWwConvertors;

    // @TODO to be extended with public option
    this.toMdConvertors = toMdConvertors;

    this.linkAttribute = linkAttribute;
  }

  toWysiwygModel(mdNode: MdNode) {
    const state = new ToWwConvertorState(this.schema, this.toWwConvertors, this.linkAttribute);

    return state.convertNode(mdNode);
  }

  toMarkdownText(wwNode: ProsemirrorNode) {
    // @TODO move to external option
    const customConvertors: any = {
      paragraph(_: any, { origin }: any) {
        return origin();
      },

      heading(state: any, { node }: any) {
        const { level, headingType } = node.attrs;
        let delim = '#';

        if (headingType === 'setext') {
          delim = level === 1 ? '#' : '##';
        } else {
          switch (level) {
            case 1:
              delim = '#';
              break;
            case 2:
              delim = '##';
              break;
            case 3:
              delim = '###';
              break;
            case 4:
              delim = '####';
              break;
            case 5:
              delim = '#####';
              break;
            default:
              delim = '######';
          }
        }

        return {
          delim,
          rawHTML: true
        };
      },

      codeBlock(state: any, { origin }: any) {
        return origin();
      },

      bulletList(state: any, { origin }: any) {
        return origin();
      },

      orderedList(state: any, { origin }: any) {
        return origin();
      },

      listItem(state: any, { origin }: any) {
        return origin();
      },

      image(state: any, { origin }: any) {
        return origin();
      },

      thematicBreak(state: any, { origin }: any) {
        return origin();
      },

      customBlock(state: any, { origin }: any) {
        return origin();
      }
    };

    const state = new ToMdConvertorState(this.toMdConvertors, customConvertors);

    return state.convertNode(wwNode);
  }
}
