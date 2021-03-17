import { Plugin } from 'prosemirror-state';
import { EditorView, NodeView } from 'prosemirror-view';

import { HTMLConvertorMap } from '@toast-ui/toastmark';
import { Emitter } from '@t/event';
import { ToDOMAdaptor, ToMdConvertorMap } from '@t/convertor';
import { EditorCommand } from '@t/spec';

export type PluginProp = (eventEmitter: Emitter) => Plugin;

export type ExtraNodeViews = (
  node: Node,
  view: EditorView,
  getPos: () => number,
  evnetEmitter: Emitter,
  toDOMAdaptor: ToDOMAdaptor
) => NodeView;

type NodeViewPropMap = Record<string, ExtraNodeViews>;

export type PluginCommandMap = Record<string, EditorCommand>;

export interface PluginInfoResult {
  toHTMLRenderers: HTMLConvertorMap;
  toMarkdownRenderers: ToMdConvertorMap;
  mdPlugins: PluginProp[];
  wwPlugins: PluginProp[];
  wwNodeViews: NodeViewPropMap;
  mdCommands: PluginCommandMap;
  wwCommands: PluginCommandMap;
}
