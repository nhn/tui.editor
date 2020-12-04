import { Slice, Node, Mark } from 'prosemirror-model';
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
  }
}
