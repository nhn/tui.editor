import { ProsemirrorNode } from 'prosemirror-model';

export function getTextByMdLine(doc: ProsemirrorNode, mdLine: number) {
  return getTextContent(doc, mdLine - 1);
}

export function getTextContent(doc: ProsemirrorNode, index: number) {
  return doc.child(index).textContent;
}
