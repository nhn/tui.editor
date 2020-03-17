import { HTMLAttributes, Component } from 'react';
import ToastuiEditor, { EditorOptions } from '@toast-ui/editor';
import ToastuiEditorViewer, { ViewerOptions } from '@toast-ui/editor/dist/toastui-editor-viewer';

type EditorProps = EditorOptions & HTMLAttributes<HTMLElement>;
type ViewerProps = ViewerOptions & HTMLAttributes<HTMLElement>;

export class Editor extends Component<EditorProps> {
  public getInstance(): ToastuiEditor;
  public getRootElement(): HTMLElement;
}

export class Viewer extends Component<ViewerProps> {
  public getInstance(): ToastuiEditorViewer;
  public getRootElement(): HTMLElement;
}