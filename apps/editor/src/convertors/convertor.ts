import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { HTMLConvertorMap, MdNode, MdPos } from '@toast-ui/toastmark';

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

  private focusedNode: ProsemirrorNode | MdNode | null;

  private mappedPosWhenConverting: number | MdPos | null;

  constructor(
    schema: Schema,
    toMdConvertors: ToMdConvertorMap,
    toHTMLConvertors: HTMLConvertorMap,
    eventEmitter: Emitter
  ) {
    this.schema = schema;
    this.eventEmitter = eventEmitter;
    this.focusedNode = null;
    this.mappedPosWhenConverting = null;
    this.toWwConvertors = createWwConvertors(toHTMLConvertors);
    this.toMdConvertors = createMdConvertors(toMdConvertors || {});

    this.eventEmitter.listen(
      'setFocusedNode',
      (node: ProsemirrorNode | MdNode) => (this.focusedNode = node)
    );
  }

  getMappedPos() {
    return this.mappedPosWhenConverting;
  }

  setMappedPos = (pos: number | MdPos) => {
    this.mappedPosWhenConverting = pos;
  };

  private getInfoForPosSync() {
    return { node: this.focusedNode, setMappedPos: this.setMappedPos };
  }

  toWysiwygModel(mdNode: MdNode) {
    const state = new ToWwConvertorState(this.schema, this.toWwConvertors);

    return state.convertNode(mdNode, this.getInfoForPosSync());
  }

  toMarkdownText(wwNode: ProsemirrorNode) {
    const state = new ToMdConvertorState(this.toMdConvertors);
    let markdownText = state.convertNode(wwNode, this.getInfoForPosSync());

    markdownText = this.eventEmitter.emitReduce('beforeConvertWysiwygToMarkdown', markdownText);

    return markdownText;
  }
}
