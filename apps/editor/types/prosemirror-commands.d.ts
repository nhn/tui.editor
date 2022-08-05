import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';

import 'prosemirror-commands';

declare module 'prosemirror-commands' {
  export interface Command<S extends Schema = any> {
    (state: EditorState<S>, dispatch?: (tr: Transaction<S>) => void, view?: EditorView<S>): boolean;
  }

  export interface Keymap<S extends Schema = any> {
    [key: string]: Command<S>;
  }
}
