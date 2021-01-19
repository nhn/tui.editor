import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';

import { MdNode } from '@t/markdown';
import { ToWwConvertorMap, ToMdConvertorMap, ToMdCustomConvertorMap } from '@t/convertor';

import { toWwConvertors } from './toWysiwyg/toWwConvertors';
import ToWwConvertorState from './toWysiwyg/toWwConvertorState';

import { toMdConvertors } from './toMarkdown/toMdConvertors';
import ToMdConvertorState from './toMarkdown/toMdConvertorState';

export default class Convertor {
  private readonly schema: Schema;

  private readonly toWwConvertors: ToWwConvertorMap;

  private readonly toMdConvertors: ToMdConvertorMap;

  private readonly linkAttribute: Record<string, any>;

  private readonly toMdCustomConvertors: ToMdCustomConvertorMap;

  constructor(
    schema: Schema,
    toMdCustomConvertors: ToMdCustomConvertorMap,
    linkAttribute: Record<string, any>
  ) {
    this.schema = schema;
    this.toWwConvertors = toWwConvertors;
    this.toMdConvertors = toMdConvertors;
    this.toMdCustomConvertors = toMdCustomConvertors;
    this.linkAttribute = linkAttribute;
  }

  toWysiwygModel(mdNode: MdNode) {
    const state = new ToWwConvertorState(this.schema, this.toWwConvertors, this.linkAttribute);

    return state.convertNode(mdNode);
  }

  toMarkdownText(wwNode: ProsemirrorNode) {
    const state = new ToMdConvertorState(this.toMdConvertors, this.toMdCustomConvertors);

    return state.convertNode(wwNode);
  }
}
