import { Plugin } from 'prosemirror-state';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';

import { HTMLConvertorMap } from '@toast-ui/toastmark';
import { Emitter } from './event';
import { ToDOMAdaptor, ToMdConvertorMap } from './convertor';
import { ToolbarItemOptions } from './ui';

export type PluginProp = (eventEmitter?: Emitter) => Plugin;

export type PluginNodeViews = (
  node: Node,
  view: EditorView,
  getPos: () => number,
  eventEmitter: Emitter,
  toDOMAdaptor: ToDOMAdaptor
) => NodeView;

type NodeViewPropMap = Record<string, PluginNodeViews>;

export type CommandFn<T = DefaultPayload> = (
  payload?: Payload<T>,
  state: EditorState,
  dispatch: Dispatch
) => boolean;
export type PluginCommandMap = Record<string, CommandFn>;

interface PluginToolbarItem {
  groupIndex: number;
  itemIndex: number;
  item: string | ToolbarItemOptions;
}

export interface PluginInfo {
  toHTMLRenderers?: HTMLConvertorMap;
  toMarkdownRenderers?: ToMdConvertorMap;
  markdownPlugins?: PluginProp[];
  wysiwygPlugins?: PluginProp[];
  wysiwygNodeViews?: NodeViewPropMap;
  markdownCommands?: PluginCommandMap;
  wysiwygCommands?: PluginCommandMap;
  toolbarItems?: PluginToolbarItem[];
}

export interface PluginInfoResult {
  toHTMLRenderers: HTMLConvertorMap;
  toMarkdownRenderers: ToMdConvertorMap;
  mdPlugins: PluginProp[];
  wwPlugins: PluginProp[];
  wwNodeViews: NodeViewPropMap;
  mdCommands: PluginCommandMap;
  wwCommands: PluginCommandMap;
  toolbarItems: PluginToolbarItem[];
}
