// Type definitions for TOAST UI Editor v3.0.0
// TypeScript Version: 4.2.3
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
  PluginContext,
  I18n,
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
} from './toastmark';
export { ToMdConvertorMap } from './convertor';
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
  PluginContext,
  I18n,
};
export { Dispatch } from './spec';
export { PluginInfo, PluginNodeViews, CommandFn, PluginCommandMap } from './plugin';
export { MdLikeNode } from './markdown';
export { Editor, EditorCore };
export default Editor;

export declare namespace toastui {
  export { EditorCore, Editor, Viewer };
}
