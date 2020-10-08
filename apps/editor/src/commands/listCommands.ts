import { NodeRange, Fragment, Slice, NodeType } from 'prosemirror-model';
import { findWrapping, ReplaceAroundStep, canSplit } from 'prosemirror-transform';
import { EditorState, Transaction } from 'prosemirror-state';

type WrapType = {
  type: NodeType<any>;
  attrs?:
    | {
        [key: string]: any;
      }
    | null
    | undefined;
}[];

type ToListReturnType = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;

function doWrapInList(
  tr: Transaction,
  range: NodeRange,
  wrappers: WrapType,
  joinBefore: boolean,
  listType: NodeType
) {
  let content = Fragment.empty;

  for (let i = wrappers.length - 1; i >= 0; i -= 1) {
    content = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content));
  }

  tr.step(
    new ReplaceAroundStep(
      range.start - (joinBefore ? 2 : 0),
      range.end,
      range.start,
      range.end,
      new Slice(content, 0, 0),
      wrappers.length,
      true
    )
  );

  let found = 0;

  for (let i = 0; i < wrappers.length; i += 1) {
    if (wrappers[i].type === listType) {
      found = i + 1;
    }
  }

  const splitDepth = wrappers.length - found;
  const { parent } = range;

  let splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0);
  let first = true;

  for (let i = range.startIndex, len = range.endIndex; i < len; i += 1) {
    if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
      tr.split(splitPos, splitDepth);
      splitPos += 2 * splitDepth;
    }

    splitPos += parent.child(i).nodeSize;
    first = false;
  }

  return tr;
}

export function toList(listType: NodeType, attrs?: { [key: string]: any }) {
  return (state: EditorState, dispatch: (tr: Transaction) => void): ToListReturnType | boolean => {
    const { $from, $to } = state.selection;

    let range = $from.blockRange($to);
    let joined = false;
    let outerRange = range;

    if (!range) {
      return false;
    }

    const ancestorType = range.depth >= 2 && $from.node(range.depth - 1).type;
    // @ts-ignore
    const content = ancestorType ?? ancestorType.compatibleContent(listType);

    if (content && range.startIndex === 0 && $from.index(range.depth - 1) !== 0) {
      const insert = state.doc.resolve(range.start - 2);

      outerRange = new NodeRange(insert, insert, range.depth);

      if (range.endIndex < range.parent.childCount) {
        range = new NodeRange($from, state.doc.resolve($to.end(range.depth)), range.depth);
      }

      joined = true;
    }

    const wrap = outerRange && findWrapping(outerRange, listType, attrs, range);

    if (!wrap) {
      return false;
    }

    if (dispatch) {
      const node = doWrapInList(state.tr, range, wrap, joined, listType);

      dispatch(node.scrollIntoView());
    }

    return true;
  };
}
