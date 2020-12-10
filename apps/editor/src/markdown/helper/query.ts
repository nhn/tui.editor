import { ProsemirrorNode } from 'prosemirror-model';
import { nbspToSpace } from '@/helper/manipulation';

export function getTextByMdLine(doc: ProsemirrorNode, mdLine: number) {
  return nbspToSpace(doc.content.child(mdLine - 1).textContent);
}
