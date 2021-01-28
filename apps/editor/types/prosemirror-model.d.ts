import * as Model from 'prosemirror-model';

declare module 'prosemirror-model' {
  export interface Fragment {
    textBetween(from: number, to: number, blockSeparator?: string, leafText?: string): string;
    findIndex(pos: number, round?: number): { index: number; offset: number };
    findDiffEnd(other: ProsemirrorNode | Fragment): { a: number; b: number } | null | undefined;
  }

  export interface ProsemirrorNode extends Model.Node {
    descendants(
      fn: (
        node: Model.Node,
        pos: number,
        parent: Model.Node,
        index?: number
      ) => boolean | void | null | undefined
    ): void;
  }

  export interface NodeType {
    compatibleContent(node: NodeType): boolean;
  }
}
