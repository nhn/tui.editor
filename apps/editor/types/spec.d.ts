import { Schema } from 'prosemirror-model';
import { Transaction, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Command } from 'prosemirror-commands';
import { ToastMark } from './toastmark';
import { Emitter } from './event';

export interface Context {
  schema: Schema;
  eventEmitter: Emitter;
}

export interface MdContext extends Context {
  toastMark: ToastMark;
}

export interface SpecContext extends Context {
  view: EditorView;
}

export interface MdSpecContext extends SpecContext {
  toastMark: ToastMark;
}

export type DefaultPayload = Record<string, any>;
export type Payload<T> = T extends infer P ? P : any;

export type Dispatch = (tr: Transaction) => void;
export type EditorCommand<T = DefaultPayload> = (payload?: Payload<T>) => Command;
export type EditorCommandMap<T = DefaultPayload> = Record<string, EditorCommand<T>>;
export type EditorCommandFn<T = DefaultPayload> = (payload?: Payload<T>) => boolean | void;
export type EditorAllCommandMap<T = DefaultPayload> = Record<string, EditorCommandFn<T>>;

export interface SpecManager {
  commands(
    view: EditorView,
    addedCommands?: Record<string, EditorCommand>
  ): EditorAllCommandMap<DefaultPayload>;

  keymaps(useCommandShortcut: boolean): Plugin<any, any>[];

  setContext(context: SpecContext): void;
}
