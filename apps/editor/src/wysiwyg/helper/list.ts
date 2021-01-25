import { NodeRange, Fragment, Slice } from 'prosemirror-model';
import { ReplaceAroundStep, canSplit } from 'prosemirror-transform';

import { findListItem } from '@/wysiwyg/helper/node';

function doWrapInList(tr: any, range: any, wrappers: any, joinBefore: any, listType: any) {
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
    if (wrappers[i].type === listType) found = i + 1;
  }

  const splitDepth = wrappers.length - found;

  let splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0);
  const { parent } = range;

  for (let i = range.startIndex, e = range.endIndex, first = true; i < e; i += 1, first = false) {
    if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
      tr.split(splitPos, splitDepth);
      splitPos += 2 * splitDepth;
    }
    splitPos += parent.child(i).nodeSize;
  }

  return tr;
}

function findWrappingInside(range: any, type: any) {
  const { parent, startIndex, endIndex } = range;
  const inner = parent.child(startIndex);
  const inside = type.contentMatch.findWrapping(inner.type);

  if (!inside) {
    return null;
  }

  const lastType = inside.length ? inside[inside.length - 1] : type;
  let innerMatch = lastType.contentMatch;

  for (let i = startIndex; innerMatch && i < endIndex; i += 1) {
    innerMatch = innerMatch.matchType(parent.child(i).type);
  }

  if (!innerMatch || !innerMatch.validEnd) {
    return null;
  }

  return inside;
}

function findWrappingOutside(range: any, type: any) {
  const { parent, startIndex, endIndex } = range;
  const around = parent.contentMatchAt(startIndex).findWrapping(type);

  if (!around) {
    return null;
  }

  const outer = around.length ? around[0] : type;

  return parent.canReplaceWith(startIndex, endIndex, outer) ? around : null;
}

function withAttrs(type: any) {
  return { type, attrs: null };
}

function findWrapping(range: any, nodeType: any, attrs: any, innerRange: any, task = false) {
  if (!innerRange) {
    innerRange = range;
  }

  const around = findWrappingOutside(range, nodeType);
  const inner = around && findWrappingInside(innerRange, nodeType);

  if (!inner) {
    return null;
  }

  return around
    .map(withAttrs)
    .concat({ type: nodeType, attrs })
    .concat(
      inner.map((type: any) => {
        return { type, attrs: task ? { task: true } : null };
      })
    );
}

export function wrapInList(type: 'bulletList' | 'orderedList' | 'task', attrs?: any) {
  return (state: any, dispatch: any) => {
    const { $from, $to } = state.selection;
    let range = $from.blockRange($to);
    let doJoin = false;
    let outerRange = range;

    if (!range) {
      return false;
    }

    const { bulletList, orderedList } = state.schema.nodes;
    let listType;

    if (type === 'bulletList' || type === 'task') {
      listType = bulletList;
    } else if (type === 'orderedList') {
      listType = orderedList;
    }

    // This is at the top of an existing list item
    if (
      range.depth >= 2 &&
      $from.node(range.depth - 1).type.compatibleContent(listType) &&
      range.startIndex === 0
    ) {
      // Don't do anything if this is the top of the list
      if ($from.index(range.depth - 1) === 0) {
        return false;
      }

      const $insert = state.doc.resolve(range.start - 2);

      outerRange = new NodeRange($insert, $insert, range.depth);

      if (range.endIndex < range.parent.childCount) {
        range = new NodeRange($from, state.doc.resolve($to.end(range.depth)), range.depth);
      }

      doJoin = true;
    }

    const wrap = findWrapping(outerRange, listType, attrs, range, type === 'task');

    if (wrap) {
      const newTr = doWrapInList(state.tr, range, wrap, doJoin, listType);

      dispatch!(newTr.scrollIntoView());

      return true;
    }

    return false;
  };
}

function getBeforeLineListItem(doc: any, pos: number) {
  let last = doc.resolve(pos);

  while (last.node().type.name !== 'paragraph') {
    pos -= 2;
    last = doc.resolve(pos);
  }

  return findListItem(doc.resolve(pos));
}

export function changeTaskListItems(tr: any, doc: any, from: any, to: any) {
  const startListItem = findListItem(from);
  let endListItem = findListItem(to);

  if (startListItem && endListItem) {
    while (endListItem) {
      const { pos, node } = endListItem;
      const attrs = node.attrs.task ? { task: false, checked: false } : { task: true };

      tr.setNodeMarkup(pos, null, attrs);

      if (pos === startListItem.pos) {
        break;
      }

      endListItem = getBeforeLineListItem(doc, pos);
    }
  }

  return tr;
}

export function changeListType(tr: any, doc: any, from: any, to: any, list: any) {
  const startListItem = findListItem(from);
  let endListItem = findListItem(to);

  if (startListItem && endListItem) {
    while (endListItem) {
      const { pos, node, depth } = endListItem;

      if (node.attrs.task) {
        tr.setNodeMarkup(pos, null, { task: false, checked: false });
      }

      const resolvedPos = doc.resolve(pos);

      if (resolvedPos.parent!.type !== list) {
        const parentOffset = resolvedPos.before(depth - 1);

        tr.setNodeMarkup(parentOffset, list);
      }

      if (pos === startListItem.pos) {
        break;
      }

      endListItem = getBeforeLineListItem(doc, pos);
    }
  }

  return tr;
}
