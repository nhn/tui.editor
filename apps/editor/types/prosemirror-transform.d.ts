import { Slice, Node, Mark, NodeType } from 'prosemirror-model';
import 'prosemirror-transform';

declare module 'prosemirror-transform' {
  export interface Step {
    slice: Slice;
    from: number;
    to: number;
  }

  export interface Transform {
    setNodeMarkup(
      pos: number,
      type: Node | null,
      attrs?: { [key: string]: any },
      marks?: Mark[]
    ): Transform;

    split(
      pos: number,
      depth?: number | undefined,
      typesAfter?:
        | ({
            type: NodeType;
            attrs?:
              | {
                  [key: string]: any;
                }
              | null
              | undefined;
          } | null)[]
        | undefined
    ): Transform;
  }
}
