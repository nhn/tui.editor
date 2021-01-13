import { Component } from 'react';
import ToastuiEditor, { EditorOptions, SourceType, MarkdownToolbarState, WysiwygToolbarState } from '@toast-ui/editor';
import ToastuiEditorViewer, { ViewerOptions } from '@toast-ui/editor/dist/toastui-editor-viewer';


type EditorProps = Omit<EditorOptions & {
  onLoad?: (param: Editor) => void;
  onChange?: (param: { source: SourceType | 'viewer'; data: MouseEvent }) => void;
  onStateChange?: (param: MarkdownToolbarState | WysiwygToolbarState) => void;
  onFocus?: (param: { source: SourceType }) => void;
  onBlur?: (param: { source: SourceType }) => void;
}, 'el'>;
type ViewerProps = Omit<ViewerOptions, 'el'>;

export class Editor extends Component<EditorProps> {
  public getInstance(): ToastuiEditor;
  public getRootElement(): HTMLElement;
}

export class Viewer extends Component<ViewerProps> {
  public getInstance(): ToastuiEditorViewer;
  public getRootElement(): HTMLElement;
}
