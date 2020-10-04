import * as Model from 'prosemirror-model';

declare module 'prosemirror-model' {
  export interface Fragment {
    textBetween(from: number, to: number, blockSeparator?: string, leafText?: string): string;
    findIndex(pos: number, round?: number): { index: number; offset: number };
  }

  export interface ProsemirrorNode extends Model.Node {
    descendants(
      f: (
        node: Model.Node,
        pos: number,
        parent: Model.Node,
        index?: number
      ) => boolean | void | null | undefined
    ): void;
  }
}
