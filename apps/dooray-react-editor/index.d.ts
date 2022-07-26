import { Component } from 'react';
import ToastuiEditor, { EditorOptions, ViewerOptions, EventMap } from '@toast-ui/editor';
import ToastuiEditorViewer from '@toast-ui/editor/dist/toastui-editor-viewer';

export interface EventMapping {
  onLoad: EventMap['load'];
  onChange: EventMap['change'];
  onCaretChange: EventMap['caretChange'];
  onFocus: EventMap['focus'];
  onBlur: EventMap['blur'];
  onKeydown: EventMap['keydown'];
  onKeyup: EventMap['keyup'];
  onBeforePreviewRender: EventMap['beforePreviewRender'];
  onBeforeConvertWysiwygToMarkdown: EventMap['beforeConvertWysiwygToMarkdown'];
}

export type EventNames = keyof EventMapping;

interface EditorClassOptions extends EditorOptions {
  viewerOnlyMode?: boolean;
  isAllowedToggleTask?: boolean;
}

export type EditorProps = Omit<EditorClassOptions, 'el'> & Partial<EventMapping>;
export type ViewerProps = Omit<ViewerOptions, 'el'> & Partial<EventMapping>;

export class EditorClass extends ToastuiEditor {
  container: HTMLElement;

  useViewerOnlyMode(useMode: boolean): void;
}

export class Editor extends Component<EditorProps> {
  getInstance(): EditorClass;

  getRootElement(): HTMLElement;
}

export class Viewer extends Component<ViewerProps> {
  getInstance(): ToastuiEditorViewer;

  getRootElement(): HTMLElement;
}
