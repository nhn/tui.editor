import { Component } from 'react';
import ToastuiEditor, { EditorOptions } from '@toast-ui/editor';
import ToastuiEditorViewer, { ViewerOptions } from '@toast-ui/editor/dist/toastui-editor-viewer';

export type EventNameMapping = {
  load: 'onLoad';
  change: 'onChange';
  caretChange: 'onCaretChange';
  focus: 'onFocus';
  blur: 'onBlur';
  keydown: 'onKeydown';
  keyup: 'onKeyup';
  beforePreviewRender: 'onBeforePreviewRender';
  beforeConvertWysiwygToMarkdown: 'onBeforeConvertWysiwygToMarkdown';
};

export type EventMaps = {
  // @TODO apply editor handler
  [K in keyof EventNameMapping]?: (...args: any[]) => void;
};

type EditorProps = Omit<EditorOptions, 'el'> & EventMaps;
type ViewerProps = Omit<ViewerOptions, 'el'> & EventMaps;

export class Editor extends Component<EditorProps> {
  getInstance(): ToastuiEditor;

  getRootElement(): HTMLElement;
}

export class Viewer extends Component<ViewerProps> {
  getInstance(): ToastuiEditorViewer;

  getRootElement(): HTMLElement;
}
