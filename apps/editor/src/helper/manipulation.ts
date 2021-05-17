import { TextSelection, Transaction } from 'prosemirror-state';
import { ProsemirrorNode, Schema, Mark, ResolvedPos } from 'prosemirror-model';

import isString from 'tui-code-snippet/type/isString';

export function createParagraph(schema: Schema, content?: string | ProsemirrorNode[]) {
  const { paragraph } = schema.nodes;

  if (!content) {
    return paragraph.createAndFill()!;
  }
  return paragraph.create(null, isString(content) ? schema.text(content) : content);
}

export function createText(schema: Schema, text: string, marks?: Mark[]) {
  return schema.text(text, marks);
}

export function createTextSelection(tr: Transaction, from: number, to = from) {
  const contentSize = tr.doc.content.size;
  const size = contentSize > 0 ? contentSize - 1 : 1;

  return TextSelection.create(tr.doc, Math.min(from, size), Math.min(to, size));
}

export function addParagraph(tr: Transaction, { pos }: ResolvedPos, schema: Schema) {
  tr.replaceWith(pos, pos, createParagraph(schema));

  return tr.setSelection(createTextSelection(tr, pos + 1));
}
