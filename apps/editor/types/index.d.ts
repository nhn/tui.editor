// Type definitions for TOAST UI Editor v3.0.0
// TypeScript Version: 4.0.2
import {
  EditorCore,
  Editor,
  Viewer,
  EditorOptions,
  ViewerOptions,
  ExtendedAutolinks,
  LinkAttributes,
  Sanitizer,
  EditorType,
  PreviewStyle,
  EventMap,
  HookMap,
  WidgetStyle,
  WidgetRuleMap,
  WidgetRule,
} from './editor';

export {
  MdNode,
  MdNodeType,
  ListMdNode,
  ListItemMdNode,
  TableMdNode,
  TableCellMdNode,
  CodeBlockMdNode,
  LinkMdNode,
  ListData,
  HeadingMdNode,
  CodeMdNode,
  HTMLConvertorMap as ToHTMLConvertorMap,
} from '@toast-ui/toastmark';
export { ToMdConvertorMap, ToDOMAdaptor } from './convertor';
export { Emitter, Handler } from './event';
export {
  EditorOptions,
  ViewerOptions,
  ExtendedAutolinks,
  LinkAttributes,
  Sanitizer,
  EditorType,
  PreviewStyle,
  EventMap,
  HookMap,
  WidgetStyle,
  WidgetRuleMap,
  WidgetRule,
};
export { Editor, EditorCore };
export default Editor;

declare namespace toastui {
  export { EditorCore, Editor, Viewer };
}

declare module '@toast-ui/editor/dist/toastui-editor-viewer' {
  export default Viewer;
}
