import { Schema } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Command } from 'prosemirror-commands';
// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import { Emitter } from './event';

export interface Context {
  toastMark?: ToastMark;
  schema: Schema;
  eventEmitter: Emitter;
  view?: EditorView;
}

export type Dispatch = (tr: Transaction) => void;
export type EditorCommand<T extends Record<string, any> = any> = (payload?: T) => Command;
export type EditorCommandMap<T extends Record<string, any> = any> = Record<
  string,
  EditorCommand<T>
>;
export type EditorCommandFn<T extends Record<string, any> = any> = (payload?: T) => boolean;
export type EditorAllCommandMap<T extends Record<string, any> = any> = Record<
  string,
  EditorCommandFn<T>
>;
