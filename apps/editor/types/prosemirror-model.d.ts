import * as Model from 'prosemirror-model';

declare module 'prosemirror-model' {
  export interface Fragment {
    textBetween(from: number, to: number, blockSeparator?: string, leafText?: string): string;
    findIndex(pos: number, round?: number): { index: number; offset: number };
    findDiffEnd(other: ProsemirrorNode | Fragment): { a: number; b: number } | null | undefined;
  }

  export type ProsemirrorNode = Model.Node;

  export interface NodeType {
    compatibleContent(node: NodeType): boolean;
  }
}
