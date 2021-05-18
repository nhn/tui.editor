import { TextSelection, Transaction, EditorState } from 'prosemirror-state';
import { ProsemirrorNode, Schema, Mark, ResolvedPos, Fragment } from 'prosemirror-model';

import isString from 'tui-code-snippet/type/isString';

interface ReplacePayload {
  state: EditorState;
  from: number;
  startIndex: number;
  endIndex: number;
  createText: (textContent: string) => string;
}

export function createParagraph(schema: Schema, content?: string | ProsemirrorNode[]) {
  const { paragraph } = schema.nodes;

  if (!content) {
    return paragraph.createAndFill()!;
  }
  return paragraph.create(null, isString(content) ? schema.text(content) : content);
}

export function createTextNode(schema: Schema, text: string, marks?: Mark[]) {
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

export function replaceTextNode({ state, from, startIndex, endIndex, createText }: ReplacePayload) {
  const { tr, doc, schema } = state;

  for (let i = startIndex; i <= endIndex; i += 1) {
    const { nodeSize, textContent, content } = doc.child(i);
    const text = createText(textContent);
    const node = text ? createTextNode(schema, text) : Fragment.empty;
    const mappedFrom = tr.mapping.map(from);
    const mappedTo = mappedFrom + content.size;

    tr.replaceWith(mappedFrom, mappedTo, node);
    from += nodeSize;
  }
  return tr;
}

export function splitAndExtendBlock(
  tr: Transaction,
  pos: number,
  text: string,
  node: ProsemirrorNode
) {
  const textLen = text.length;

  (tr.split(pos) as Transaction)
    .delete(pos - textLen, pos)
    .insert(tr.mapping.map(pos), node)
    .setSelection(createTextSelection(tr, tr.mapping.map(pos) - textLen));
}
