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
  | 'previewBeforeHook'
  | 'previewRenderAfter'
  | 'previewNeedsRefresh'
  | 'addImageBlobHook'
  | 'setMarkdownAfter'
  | 'contentChangedFromWysiwyg'
  | 'changeFromWysiwyg'
  | 'contentChangedFromMarkdown'
  | 'changeFromMarkdown'
  | 'change'
  | 'changeModeToWysiwyg'
  | 'changeModeToMarkdown'
  | 'changeModeBefore'
  | 'changeMode'
  | 'changePreviewStyle'
  | 'changePreviewTabPreview'
  | 'changePreviewTabWrite'
  | 'openPopupAddLink'
  | 'openPopupAddImage'
  | 'openPopupAddTable'
  | 'openPopupTableUtils'
  | 'openHeadingSelect'
  | 'openPopupCodeBlockLanguages'
  | 'openPopupCodeBlockEditor'
  | 'openDropdownToolbar'
  | 'closePopupCodeBlockLanguages'
  | 'closePopupCodeBlockEditor'
  | 'closeAllPopup'
  | 'command'
  | 'addCommandBefore'
  | 'htmlUpdate'
  | 'markdownUpdate'
  | 'renderedHtmlUpdated'
  | 'removeEditor'
  | 'convertorAfterMarkdownToHtmlConverted'
  | 'convertorBeforeHtmlToMarkdownConverted'
  | 'convertorAfterHtmlToMarkdownConverted'
  | 'stateChange'
  | 'wysiwygSetValueAfter'
  | 'wysiwygSetValueBefore'
  | 'wysiwygGetValueBefore'
  | 'wysiwygProcessHTMLText'
  | 'wysiwygRangeChangeAfter'
  | 'wysiwygKeyEvent'
  | 'scroll'
  | 'click'
  | 'mousedown'
  | 'mouseover'
  | 'mouseout'
  | 'mouseup'
  | 'contextmenu'
  | 'keydown'
  | 'keyup'
  | 'keyMap'
  | 'load'
  | 'focus'
  | 'blur'
  | 'paste'
  | 'pasteBefore'
  | 'willPaste'
  | 'copy'
  | 'copyBefore'
  | 'copyAfter'
  | 'cut'
  | 'cutAfter'
  | 'drop'
  | 'show'
  | 'hide'
  | 'changeLanguage'
  | 'cursorActivity'
  | 'requireScrollSync'
  | 'requireScrollIntoView'
  | 'setCodeBlockLanguages';
