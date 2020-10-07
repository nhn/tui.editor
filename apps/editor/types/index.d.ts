// Type definitions for TOAST UI Editor v3.0.0
// TypeScript Version: 4.0.2

import {
  Editor as ToastUIEditor,
  Viewer as ToastUIViewer,
  EditorOptions,
  ViewerOptions,
  ExtendedAutolinks,
  LinkAttribute,
  CustomHTMLSanitizer,
  EditorType,
  PreviewStyle
} from './editor';

declare namespace toastui {
  export const Editor: ToastUIEditor;
  export const Viewer: ToastUIViewer;
}

declare module '@toast-ui/editor' {
  export default toastui.Editor;
}

declare module '@toast-ui/editor/dist/toastui-editor-viewer' {
  export default toastui.Viewer;
}

export {
  EditorOptions,
  ViewerOptions,
  ExtendedAutolinks,
  LinkAttribute,
  CustomHTMLSanitizer,
  EditorType,
  PreviewStyle
};
export * from './markdown';
export * from './event';
export * from './convertor';
