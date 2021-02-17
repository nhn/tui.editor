import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';

import { MdNode } from '@t/markdown';
import { ToWwConvertorMap, ToMdConvertors, ToMdConvertorMap } from '@t/convertor';
import { Emitter } from '@t/event';

import { toWwConvertors } from './toWysiwyg/toWwConvertors';
import ToWwConvertorState from './toWysiwyg/toWwConvertorState';

import { createConvertors } from './toMarkdown/toMdConvertors';
import ToMdConvertorState from './toMarkdown/toMdConvertorState';

export default class Convertor {
  private readonly schema: Schema;

  private readonly toWwConvertors: ToWwConvertorMap;

  private readonly toMdConvertors: ToMdConvertors;

  private readonly eventEmitter: Emitter;

  constructor(schema: Schema, toMdCustomConvertors: ToMdConvertorMap, eventEmitter: Emitter) {
    this.schema = schema;
    this.toWwConvertors = toWwConvertors;
    this.eventEmitter = eventEmitter;
    this.toMdConvertors = createConvertors(toMdCustomConvertors || {});
  }

  toWysiwygModel(mdNode: MdNode) {
    const state = new ToWwConvertorState(this.schema, this.toWwConvertors);

    return state.convertNode(mdNode);
  }

  toMarkdownText(wwNode: ProsemirrorNode) {
    const state = new ToMdConvertorState(this.toMdConvertors);
    let markdownText = state.convertNode(wwNode);

    markdownText = this.eventEmitter.emitReduce('beforeConvertWysiwygToMarkdown', markdownText);

    return markdownText;
  }
}
