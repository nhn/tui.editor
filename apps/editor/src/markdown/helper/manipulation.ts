import { Transaction } from 'prosemirror-state';
import { ProsemirrorNode, Schema } from 'prosemirror-model';

export function replaceBlockNodes(
  tr: Transaction,
  from: number,
  to: number,
  nodes: ProsemirrorNode | ProsemirrorNode[],
  diff: { from: number; to: number } = { from: 1, to: 1 }
) {
  return (
    tr
      .replaceWith(from - diff.from, to + diff.to, nodes)
      // To prevent incorrect calculation of the position for markdown parser
      .setMeta('resolvedPos', [from, to])
  );
}

export function insertBlockNodes(
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

export function createParagraph(schema: Schema, text?: string) {
  return schema.nodes.paragraph.create(null, text ? schema.text(spaceToNbsp(text)) : []);
}
