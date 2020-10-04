import { Transaction } from 'prosemirror-state';
import { ProsemirrorNode, Schema } from 'prosemirror-model';

export function replaceBlockNodes(
  tr: Transaction,
  from: number,
  to: number,
  nodes: ProsemirrorNode[]
) {
  return (
    tr
      .replaceWith(from - 1, to + 1, nodes)
      // To prevent incorrect calculation of the position for markdown parser
      .setMeta('resolvedPos', [from, to])
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
