import { TextSelection, Transaction } from 'prosemirror-state';
import { ProsemirrorNode, Schema, Mark } from 'prosemirror-model';

import isString from 'tui-code-snippet/type/isString';

export function replaceNodes(
  tr: Transaction,
  from: number,
  to: number,
  nodes: ProsemirrorNode | ProsemirrorNode[],
  diff: { from: number; to: number } = { from: 1, to: 1 }
) {
  const resolvedFrom = Math.max(from - diff.from, 0);
  const resolvedTo = Math.min(to + diff.to, tr.doc.content.size);

  return (
    tr
      .replaceWith(resolvedFrom, resolvedTo, nodes)
      // To prevent incorrect calculation of the position for markdown parser
      .setMeta('resolvedPos', [from, to])
  );
}

export function insertNodes(
  tr: Transaction,
  pos: number,
  nodes: ProsemirrorNode | ProsemirrorNode[]
) {
  return (
    tr
      .insert(pos, nodes)
      // To prevent incorrect calculation of the position for markdown parser
      .setMeta('resolvedPos', [pos, pos])
  );
}

export function nbspToSpace(text: string) {
  return text.replace(/\u00a0/g, ' ');
}

export function spaceToNbsp(text: string) {
  return text.replace(/ /g, '\u00a0');
}

export function createParagraph(
  schema: Schema,
  content?: string | ProsemirrorNode[],
  spaceChange = true
) {
  const { paragraph } = schema.nodes;

  if (!content) {
    return paragraph.createAndFill()!;
  }

  if (isString(content)) {
    return paragraph.create(null, schema.text(spaceChange ? spaceToNbsp(content) : content));
  }

  return paragraph.create(null, content);
}

export function createText(schema: Schema, text: string, marks?: Mark[], spaceChange = true) {
  return schema.text(spaceChange ? spaceToNbsp(text) : text, marks);
}

export function createTextSelection(tr: Transaction, from: number, to = from) {
  const { size } = tr.doc.content;

  return TextSelection.create(tr.doc, Math.min(from, size), Math.min(to, size));
}
