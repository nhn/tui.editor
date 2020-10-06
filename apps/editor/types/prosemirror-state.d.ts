import { ProsemirrorNode } from 'prosemirror-model';

declare module 'prosemirror-state' {
  export interface StateOptions {
    doc?: ProsemirrorNode | null;
  }
}
