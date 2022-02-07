import { Mapable } from './map';

export interface Handler {
  (...args: any[]): any;
  namespace?: string;
}

export interface Emitter {
  listen(type: string, handler: Handler): void;
  emit(type: string, ...args: any[]): any[];
  emitReduce(type: string, source: any, ...args: any[]): any;
  addEventType(type: string): void;
  removeEventHandler(type: string, handler?: Handler): void;
  getEvents(): Mapable<string, Handler[] | undefined>;
  holdEventInvoke(fn: Function): void;
}

export interface EmitterConstructor {
  new (): Emitter;
}

export type EventTypes =
  | 'afterPreviewRender'
  | 'updatePreview'
  | 'changeMode'
  | 'needChangeMode'
  | 'command'
  | 'changePreviewStyle'
  | 'changePreviewTabPreview'
  | 'changePreviewTabWrite'
  | 'scroll'
  | 'contextmenu'
  | 'show'
  | 'hide'
  | 'changeLanguage'
  | 'changeToolbarState'
  | 'toggleScrollSync'
  | 'mixinTableOffsetMapPrototype'
  | 'setFocusedNode'
  | 'removePopupWidget'
  | 'query'
  // provide event for user
  | 'openPopup'
  | 'closePopup'
  | 'addImageBlobHook'
  | 'beforePreviewRender'
  | 'beforeConvertWysiwygToMarkdown'
  | 'load'
  | 'loadUI'
  | 'change'
  | 'caretChange'
  | 'destroy'
  | 'focus'
  | 'blur'
  | 'keydown'
  | 'keyup';
