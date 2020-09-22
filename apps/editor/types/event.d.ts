import { Mapable } from './map';

export interface Handler {
  (...args: any[]): any;
  namespace?: string;
}

export interface Emitter {
  listen(type: EventTypes, handler: Handler): void;
  emit(type: EventTypes, ...args: any[]): any[];
  emitReduce(type: EventTypes, sourceText: string, ...args: any[]): any;
  addEventType(type: EventTypes): void;
  removeEventHandler(type: EventTypes, handler?: Handler): void;
  getEvents(): Mapable<EventTypes, Handler[] | undefined>;
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
