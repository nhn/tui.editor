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
    const state = new ToMdConvertorState(this.toMdConvertors);

    return state.convertNode(wwNode);
  }
}
