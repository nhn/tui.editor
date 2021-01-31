import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';

import { MdNode } from '@t/markdown';
import { ToWwConvertorMap, ToMdConvertors, ToMdConvertorMap } from '@t/convertor';

import { toWwConvertors } from './toWysiwyg/toWwConvertors';
import ToWwConvertorState from './toWysiwyg/toWwConvertorState';

import { createConvertors } from './toMarkdown/toMdConvertors';
import ToMdConvertorState from './toMarkdown/toMdConvertorState';

export default class Convertor {
  private readonly schema: Schema;

  private readonly toWwConvertors: ToWwConvertorMap;

  private readonly toMdConvertors: ToMdConvertors;

  constructor(schema: Schema, toMdCustomConvertors: ToMdConvertorMap) {
    this.schema = schema;
    this.toWwConvertors = toWwConvertors;
    this.toMdConvertors = createConvertors(toMdCustomConvertors || {});
  }

  toWysiwygModel(mdNode: MdNode) {
    const state = new ToWwConvertorState(this.schema, this.toWwConvertors);

    return state.convertNode(mdNode);
  }

  toMarkdownText(wwNode: ProsemirrorNode) {
    const state = new ToMdConvertorState(this.toMdConvertors);

    return state.convertNode(wwNode);
  }
}
