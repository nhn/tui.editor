import { ProsemirrorNode } from 'prosemirror-model';

export function getTextByMdLine(doc: ProsemirrorNode, mdLine: number) {
  return doc.content.child(mdLine - 1).textContent;
}
