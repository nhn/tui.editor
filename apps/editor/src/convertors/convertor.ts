import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { HTMLConvertorMap, MdNode } from '@toast-ui/toastmark';

import { ToWwConvertorMap, ToMdConvertors, ToMdConvertorMap } from '@t/convertor';
import { Emitter } from '@t/event';

import { createWwConvertors } from './toWysiwyg/toWwConvertors';
import ToWwConvertorState from './toWysiwyg/toWwConvertorState';

import { createMdConvertors } from './toMarkdown/toMdConvertors';
import ToMdConvertorState from './toMarkdown/toMdConvertorState';

export default class Convertor {
  private readonly schema: Schema;

  private readonly toWwConvertors: ToWwConvertorMap;

  private readonly toMdConvertors: ToMdConvertors;

  private readonly eventEmitter: Emitter;

  constructor(
    schema: Schema,
    toMdConvertors: ToMdConvertorMap,
    toHTMLConvertors: HTMLConvertorMap,
    eventEmitter: Emitter
  ) {
    this.schema = schema;
    this.eventEmitter = eventEmitter;
    this.toWwConvertors = createWwConvertors(toHTMLConvertors);
    this.toMdConvertors = createMdConvertors(toMdConvertors || {});
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
