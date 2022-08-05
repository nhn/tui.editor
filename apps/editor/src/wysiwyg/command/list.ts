import { ProsemirrorNode, NodeType, NodeRange, Fragment, Slice } from 'prosemirror-model';
import { ReplaceAroundStep, canSplit, liftTarget } from 'prosemirror-transform';
import { Transaction, Selection, EditorState } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';

import { findListItem, isInListNode } from '@/wysiwyg/helper/node';

interface Attrs {
  [key: string]: any;
}

interface WrapperInfo {
  type: NodeType;
  attrs?: Attrs;
}

function findWrappingOutside(range: NodeRange, type: NodeType) {
  const { parent, startIndex, endIndex } = range;
  const around = parent.contentMatchAt(startIndex).findWrapping(type);

  if (around) {
    const outer = around.length ? around[0] : type;

    return parent.canReplaceWith(startIndex, endIndex, outer) ? around : null;
  }

  return null;
}

function findWrappingInside(range: NodeRange, type: NodeType) {
  const { parent, startIndex, endIndex } = range;
  const inner = parent.child(startIndex);
  const inside = type.contentMatch.findWrapping(inner.type);

  if (inside) {
    const lastType = inside.length ? inside[inside.length - 1] : type;
    let innerMatch = lastType.contentMatch;

    for (let i = startIndex; innerMatch && i < endIndex; i += 1) {
      innerMatch = innerMatch.matchType(parent.child(i).type)!;
    }

    if (innerMatch && innerMatch.validEnd) {
      return inside;
    }
  }

  return null;
}

function findWrappers(range: NodeRange, innerRange: NodeRange, nodeType: NodeType, attrs?: Attrs) {
  const around = findWrappingOutside(range, nodeType);
  const inner = findWrappingInside(innerRange, nodeType);

  if (around && inner) {
    const aroundNodes = around.map((type) => {
      return { type };
    });

    const innerNodes = inner.map((type) => {
      return { type, attrs };
    });

    return aroundNodes.concat({ type: nodeType }).concat(innerNodes);
  }

  return null;
}

function wrapInList(
  tr: Transaction,
  { start, end, startIndex, endIndex, parent }: NodeRange,
  wrappers: WrapperInfo[],
  joinBefore: boolean,
  list: NodeType
) {
  let content = Fragment.empty;

  for (let i = wrappers.length - 1; i >= 0; i -= 1) {
    content = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content));
  }

  tr.step(
    new ReplaceAroundStep(
      start - (joinBefore ? 2 : 0),
      end,
      start,
      end,
      new Slice(content, 0, 0),
      wrappers.length,
      true
    )
  );

  let foundListIndex = 0;

  for (let i = 0; i < wrappers.length; i += 1) {
    if (wrappers[i].type === list) {
      foundListIndex = i + 1;
      break;
    }
  }

  const splitDepth = wrappers.length - foundListIndex;

  let splitPos = start + wrappers.length - (joinBefore ? 2 : 0);

  for (let i = startIndex, len = endIndex; i < len; i += 1) {
    const first = i === startIndex;

    if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
      tr.split(splitPos, splitDepth);
      splitPos += splitDepth * 2;
    }

    splitPos += parent.child(i).nodeSize;
  }

  return tr;
}

function changeToList(tr: Transaction, range: NodeRange, list: NodeType, attrs?: Attrs) {
  const { $from, $to, depth } = range;

  let outerRange = range;
  let joinBefore = false;

  if (
    depth >= 2 &&
    $from.node(depth - 1).type.compatibleContent(list) &&
    range.startIndex === 0 &&
    $from.index(depth - 1)
  ) {
    const start = tr.doc.resolve(range.start - 2);

    outerRange = new NodeRange(start, start, depth);

    if (range.endIndex < range.parent.childCount) {
      range = new NodeRange($from, tr.doc.resolve($to.end(depth)), depth);
    }

    joinBefore = true;
  }

  const wrappers = findWrappers(outerRange, range, list, attrs);

  if (wrappers) {
    return wrapInList(tr, range, wrappers, joinBefore, list);
  }

  return tr;
}

function getBeforeLineListItem(doc: ProsemirrorNode, offset: number) {
  let endListItemPos = doc.resolve(offset);

  while (endListItemPos.node().type.name !== 'paragraph') {
    offset -= 2; // The position value of </li></ul>
    endListItemPos = doc.resolve(offset);
  }

  return findListItem(endListItemPos);
}

function toggleTaskListItems(tr: Transaction, { $from, $to }: NodeRange) {
  const startListItem = findListItem($from);
  let endListItem = findListItem($to);

  if (startListItem && endListItem) {
    while (endListItem) {
      const { offset, node } = endListItem;

      const attrs = { task: !node.attrs.task, checked: false };

      tr.setNodeMarkup(offset, null, attrs);

      if (offset === startListItem.offset) {
        break;
      }

      endListItem = getBeforeLineListItem(tr.doc, offset);
    }
  }

  return tr;
}

function changeListType(tr: Transaction, { $from, $to }: NodeRange, list: NodeType) {
  const startListItem = findListItem($from);
  let endListItem = findListItem($to);

  if (startListItem && endListItem) {
    while (endListItem) {
      const { offset, node, depth } = endListItem;

      if (node.attrs.task) {
        tr.setNodeMarkup(offset, null, { task: false, checked: false });
      }

      const resolvedPos = tr.doc.resolve(offset);

      if (resolvedPos.parent!.type !== list) {
        const parentOffset = resolvedPos.before(depth - 1);

        tr.setNodeMarkup(parentOffset, list);
      }

      if (offset === startListItem.offset) {
        break;
      }

      endListItem = getBeforeLineListItem(tr.doc, offset);
    }
  }

  return tr;
}

export function changeList(list: NodeType): Command {
  return ({ selection, tr }, dispatch) => {
    const { $from, $to } = selection;
    const range = $from.blockRange($to);

    if (range) {
      const newTr = isInListNode($from)
        ? changeListType(tr, range, list)
        : changeToList(tr, range, list);

      dispatch!(newTr);

      return true;
    }

    return false;
  };
}

export function toggleTask(): Command {
  return ({ selection, tr, schema }, dispatch) => {
    const { $from, $to } = selection;
    const range = $from.blockRange($to);

    if (range) {
      const newTr = isInListNode($from)
        ? toggleTaskListItems(tr, range)
        : changeToList(tr, range, schema.nodes.bulletList, { task: true });

      dispatch!(newTr);

      return true;
    }

    return false;
  };
}

export function sinkListItem(listItem: NodeType): Command {
  return ({ tr, selection }: EditorState, dispatch) => {
    const { $from, $to } = selection;
    const range = $from.blockRange(
      $to,
      ({ childCount, firstChild }) => !!childCount && firstChild!.type === listItem
    );

    if (range && range.startIndex > 0) {
      const { parent } = range;
      const nodeBefore = parent.child(range.startIndex - 1);

      if (nodeBefore.type !== listItem) {
        return false;
      }

      const nestedBefore = nodeBefore.lastChild && nodeBefore.lastChild.type === parent.type;
      const inner = nestedBefore ? Fragment.from(listItem.create()) : null;
      const slice = new Slice(
        Fragment.from(listItem.create(null, Fragment.from(parent.type.create(null, inner!)))),
        nestedBefore ? 3 : 1,
        0
      );

      const before = range.start;
      const after = range.end;

      tr.step(
        new ReplaceAroundStep(before - (nestedBefore ? 3 : 1), after, before, after, slice, 1, true)
      );

      dispatch!(tr);

      return true;
    }

    return false;
  };
}

function liftToOuterList(tr: Transaction, range: NodeRange, listItem: NodeType) {
  const { $from, $to, end, depth, parent } = range;
  const endOfList = $to.end(depth);

  if (end < endOfList) {
    // There are siblings after the lifted items, which must become
    // children of the last item
    tr.step(
      new ReplaceAroundStep(
        end - 1,
        endOfList,
        end,
        endOfList,
        new Slice(Fragment.from(listItem.create(null, parent.copy())), 1, 0),
        1,
        true
      )
    );

    range = new NodeRange(tr.doc.resolve($from.pos), tr.doc.resolve(endOfList), depth);
  }

  tr.lift(range, liftTarget(range)!);

  return tr;
}

function liftOutOfList(tr: Transaction, range: NodeRange) {
  const list = range.parent;

  let pos = range.end;

  // Merge the list items into a single big item
  for (let i = range.endIndex - 1, len = range.startIndex; i > len; i -= 1) {
    pos -= list.child(i).nodeSize;
    tr.delete(pos - 1, pos + 1);
  }

  const startPos = tr.doc.resolve(range.start);
  const listItem = startPos.nodeAfter;

  const atStart = range.startIndex === 0;
  const atEnd = range.endIndex === list.childCount;

  const parent = startPos.node(-1);
  const indexBefore = startPos.index(-1);
  const canReplaceParent = parent.canReplace(
    indexBefore + (atStart ? 0 : 1),
    indexBefore + 1,
    listItem?.content.append(atEnd ? Fragment.empty : Fragment.from(list))
  );

  if (listItem && canReplaceParent) {
    const start = startPos.pos;
    const end = start + listItem.nodeSize;

    // Strip off the surrounding list. At the sides where we're not at
    // the end of the list, the existing list is closed. At sides where
    // this is the end, it is overwritten to its end.
    tr.step(
      new ReplaceAroundStep(
        start - (atStart ? 1 : 0),
        end + (atEnd ? 1 : 0),
        start + 1,
        end - 1,
        new Slice(
          (atStart ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))).append(
            atEnd ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))
          ),
          atStart ? 0 : 1,
          atEnd ? 0 : 1
        ),
        atStart ? 0 : 1
      )
    );
  }

  return tr;
}

export function liftListItem(listItem: NodeType): Command {
  return ({ tr, selection }: EditorState, dispatch) => {
    const { $from, $to } = selection;
    const range = $from.blockRange(
      $to,
      ({ childCount, firstChild }) => !!childCount && firstChild!.type === listItem
    );

    if (range) {
      const topListItem = $from.node(range.depth - 1).type === listItem;
      const newTr = topListItem ? liftToOuterList(tr, range, listItem) : liftOutOfList(tr, range);

      dispatch!(newTr);

      return true;
    }

    return false;
  };
}

export function splitListItem(listItem: NodeType): Command {
  return ({ tr, selection }, dispatch) => {
    const { $from, $to } = selection;

    if ($from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }

    const grandParent = $from.node(-1);

    if (grandParent.type !== listItem) {
      return false;
    }

    if ($from.parent.content.size === 0 && $from.node(-1).childCount === $from.indexAfter(-1)) {
      // In an empty block. If this is a nested list, the wrapping
      // list item should be split. Otherwise, bail out and let next
      // command handle lifting.
      if (
        $from.depth === 2 ||
        $from.node(-3).type !== listItem ||
        $from.index(-2) !== $from.node(-2).childCount - 1
      ) {
        return false;
      }

      const keepItem = $from.index(-1) > 0;

      let wrapper = Fragment.empty;

      // Build a fragment containing empty versions of the structure
      // from the outer list item to the parent node of the cursor
      for (let depth = $from.depth - (keepItem ? 1 : 2); depth >= $from.depth - 3; depth -= 1) {
        wrapper = Fragment.from($from.node(depth).copy(wrapper));
      }

      // Add a second list item with an empty default start node
      wrapper = wrapper.append(Fragment.from(listItem.createAndFill()!));

      tr.replace(
        keepItem ? $from.before() : $from.before(-1),
        $from.after(-3),
        new Slice(wrapper, keepItem ? 3 : 2, 2)
      );

      tr.setSelection(Selection.near(tr.doc.resolve($from.pos + (keepItem ? 3 : 2))));

      dispatch!(tr);

      return true;
    }

    const nextType = $to.pos === $from.end() ? grandParent.contentMatchAt(0).defaultType : null;
    const types = nextType && [null, { type: nextType }];

    tr.delete($from.pos, $to.pos);

    if (canSplit(tr.doc, $from.pos, 2, types!)) {
      tr.split($from.pos, 2, types!);

      dispatch!(tr);

      return true;
    }

    return false;
  };
}
