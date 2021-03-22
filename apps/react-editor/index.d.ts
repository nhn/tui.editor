import { Component } from 'react';
import ToastuiEditor, { EditorOptions, ViewerOptions, EventMap } from '@toast-ui/editor';
import ToastuiEditorViewer from '@toast-ui/editor/dist/toastui-editor-viewer';

export type EventMapping = {
  onLoad: EventMap['load'];
  onChange: EventMap['change'];
  onCaretChange: EventMap['caretChange'];
  onFocus: EventMap['focus'];
  onBlur: EventMap['blur'];
  onBlur: EventMap['keydown'];
  onKeyup: EventMap['keyup'];
  onBeforePreviewRender: EventMap['beforePreviewRender'];
  onBeforeConvertWysiwygToMarkdown: EventMap['beforeConvertWysiwygToMarkdown'];
};

export type EventNames = keyof EventMapping;

export type EditorProps = Omit<EditorOptions, 'el'> & EventMapping;
export type ViewerProps = Omit<ViewerOptions, 'el'> & EventMapping;

export class Editor extends Component<EditorProps> {
  getInstance(): ToastuiEditor;

  getRootElement(): HTMLElement;
}

export class Viewer extends Component<ViewerProps> {
  getInstance(): ToastuiEditorViewer;

  getRootElement(): HTMLElement;
}
