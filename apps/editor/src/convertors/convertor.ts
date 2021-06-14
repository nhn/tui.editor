import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { HTMLConvertorMap, MdNode, MdPos } from '@toast-ui/toastmark';

import { ToWwConvertorMap, ToMdConvertors, ToMdConvertorMap } from '@t/convertor';
import { Emitter } from '@t/event';

import { createWwConvertors } from './toWysiwyg/toWwConvertors';
import ToWwConvertorState from './toWysiwyg/toWwConvertorState';

import { createMdConvertors } from './toMarkdown/toMdConvertors';
import ToMdConvertorState from './toMarkdown/toMdConvertorState';

interface FocusedNodeInfo {
  node: ProsemirrorNode | MdNode;
  pos: number | MdPos;
}

export default class Convertor {
  private readonly schema: Schema;

  private readonly toWwConvertors: ToWwConvertorMap;

  private readonly toMdConvertors: ToMdConvertors;

  private readonly eventEmitter: Emitter;

  private focusedNodeInfo: FocusedNodeInfo;

  constructor(
    schema: Schema,
    toMdConvertors: ToMdConvertorMap,
    toHTMLConvertors: HTMLConvertorMap,
    eventEmitter: Emitter
  ) {
    this.schema = schema;
    this.eventEmitter = eventEmitter;
    this.focusedNodeInfo = {} as FocusedNodeInfo;
    this.toWwConvertors = createWwConvertors(toHTMLConvertors);
    this.toMdConvertors = createMdConvertors(toMdConvertors || {});

    this.eventEmitter.listen(
      'setFocusedNode',
      (node: ProsemirrorNode | MdNode) => (this.focusedNodeInfo.node = node)
    );
  }

  resetFocusedNodeInfo() {
    this.focusedNodeInfo = {} as FocusedNodeInfo;
  }

  getFocusedPos() {
    return this.focusedNodeInfo.pos;
  }

  setFocusedPos = (pos: number | MdPos) => {
    this.focusedNodeInfo.pos = pos;
  };

  private getFocusedInfo() {
    return { node: this.focusedNodeInfo.node, setFocusedPos: this.setFocusedPos };
  }

  toWysiwygModel(mdNode: MdNode) {
    const state = new ToWwConvertorState(this.schema, this.toWwConvertors);

    return state.convertNode(mdNode, this.getFocusedInfo());
  }

  toMarkdownText(wwNode: ProsemirrorNode) {
    const state = new ToMdConvertorState(this.toMdConvertors);
    let markdownText = state.convertNode(wwNode, this.getFocusedInfo());

    markdownText = this.eventEmitter.emitReduce('beforeConvertWysiwygToMarkdown', markdownText);

    return markdownText;
  }
}
