import { Slice } from 'prosemirror-model';
import 'prosemirror-transform';

declare module 'prosemirror-transform' {
  export interface Step {
    slice: Slice;
    from: number;
    to: number;
  }
}
