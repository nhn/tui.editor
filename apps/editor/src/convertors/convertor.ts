import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';

import { MdNode } from '@t/markdown';
import {
  ToWwConvertorMap,
  ToMdConvertorMap,
  ToMdCustomConvertorMap,
  ToMdParamConvertorMap
} from '@t/convertor';

import { toWwConvertors } from './toWysiwyg/toWwConvertors';
import ToWwConvertorState from './toWysiwyg/toWwConvertorState';

import { createConvertors } from './toMarkdown/toMdConvertors';
import ToMdConvertorState from './toMarkdown/toMdConvertorState';

export default class Convertor {
  private readonly schema: Schema;

  private readonly toWwConvertors: ToWwConvertorMap;

  private readonly toMdConvertors: ToMdConvertorMap;

  private readonly linkAttribute: Record<string, any>;

  constructor(
    schema: Schema,
    toMdCustomConvertors: ToMdCustomConvertorMap,
    linkAttribute: Record<string, any>
  ) {
    const customConvertor: ToMdParamConvertorMap = {
      heading() {
        // return origin();
        return {
          delim: '#'
        };
      }
    };

    this.schema = schema;
    this.toWwConvertors = toWwConvertors;
    // @TODO change toMdCustomConvertors
    this.toMdConvertors = createConvertors(customConvertor);
    this.linkAttribute = linkAttribute;
  }

  toWysiwygModel(mdNode: MdNode) {
    const state = new ToWwConvertorState(this.schema, this.toWwConvertors, this.linkAttribute);

    return state.convertNode(mdNode);
  }

  toMarkdownText(wwNode: ProsemirrorNode) {
    const state = new ToMdConvertorState(this.toMdConvertors);

    return state.convertNode(wwNode);
  }
}
