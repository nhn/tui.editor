import { Node as WwNode, Schema } from 'prosemirror-model';

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

  constructor(schema: Schema) {
    this.schema = schema;

    // @TODO to be extended with public option
    this.toWwConvertors = toWwConvertors;

    // @TODO to be extended with public option
    this.toMdConvertors = toMdConvertors;
  }

  toWysiwygModel(mdNode: MdNode) {
    const state = new ToWwConvertorState(this.schema, this.toWwConvertors);

    return state.convertNode(mdNode);
  }

  toMarkdownText(wwNode: WwNode) {
    const { nodes, marks } = this.toMdConvertors;
    const state = new ToMdConvertorState(nodes, marks);

    return state.convertNode(wwNode);
  }
}
