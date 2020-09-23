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
export type EditorCommand = (payload?: Record<string, any>) => Command;
export type EditorCommandMap = Record<string, EditorCommand>;
export type EditorCommandFn = (payload?: Record<string, any>) => boolean;
export type EditorAllCommandMap = Record<string, EditorCommandFn>;
