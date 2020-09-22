import { Schema } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
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
export type CommandMap = Record<string, (...args: any[]) => boolean>;
