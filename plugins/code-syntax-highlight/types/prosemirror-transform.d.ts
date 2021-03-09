import { Node, Mark } from 'prosemirror-model';
import 'prosemirror-transform';

declare module 'prosemirror-transform' {
  export interface Transform {
    setNodeMarkup(
      pos: number,
      type: Node | null,
      attrs?: { [key: string]: any },
      marks?: Mark[]
    ): Transform;
  }
}
