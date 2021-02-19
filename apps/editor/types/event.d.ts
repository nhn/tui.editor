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
}

export interface EmitterConstructor {
  new (): Emitter;
}

export type EventTypes =
  | 'afterPreviewRendered'
  | 'updatePreview'
  | 'changeMode'
  | 'changeModeByEvent'
  | 'command'
  | 'changePreviewStyle'
  | 'changePreviewTabPreview'
  | 'changePreviewTabWrite'
  | 'openPopupCodeBlockLanguages'
  | 'openPopupCodeBlockEditor'
  | 'closePopupCodeBlockLanguages'
  | 'closePopupCodeBlockEditor'
  | 'scroll'
  | 'contextmenu'
  | 'show'
  | 'hide'
  | 'changeLanguage'
  | 'changeToolbarState'
  | 'setCodeBlockLanguages'
  | 'toggleScrollSync'
  // provide event for user
  | 'openPopup'
  | 'closePopup'
  | 'addImageBlobHook'
  | 'beforePreviewRendered'
  | 'beforeConvertWysiwygToMarkdown'
  | 'load'
  | 'change'
  | 'caretChange'
  | 'destroy'
  | 'focus'
  | 'blur'
  | 'keydown'
  | 'keyup';
