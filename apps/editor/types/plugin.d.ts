import { Plugin, EditorState } from 'prosemirror-state';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';

import { CustomParserMap } from './toastmark';
import { CustomHTMLRenderer } from './editor';
import { Emitter } from './event';
import { ToMdConvertorMap } from './convertor';
import { Dispatch, Payload, DefaultPayload } from './spec';
import { ToolbarItemOptions } from './ui';

export type PluginProp = (eventEmitter?: Emitter) => Plugin;

export type PluginNodeViews = (
  node: Node,
  view: EditorView,
  getPos: () => number,
  eventEmitter: Emitter
) => NodeView;

type NodeViewPropMap = Record<string, PluginNodeViews>;

export type CommandFn<T = DefaultPayload> = (
  payload: Payload<T>,
  state: EditorState,
  dispatch: Dispatch,
  view: EditorView
) => boolean;
export type PluginCommandMap = Record<string, CommandFn>;

interface PluginToolbarItem {
  groupIndex: number;
  itemIndex: number;
  item: string | ToolbarItemOptions;
}

export interface PluginInfo {
  toHTMLRenderers?: CustomHTMLRenderer;
  toMarkdownRenderers?: ToMdConvertorMap;
  markdownPlugins?: PluginProp[];
  wysiwygPlugins?: PluginProp[];
  wysiwygNodeViews?: NodeViewPropMap;
  markdownCommands?: PluginCommandMap;
  wysiwygCommands?: PluginCommandMap;
  toolbarItems?: PluginToolbarItem[];
  markdownParsers?: CustomParserMap;
}

export interface PluginInfoResult {
  toHTMLRenderers: CustomHTMLRenderer;
  toMarkdownRenderers: ToMdConvertorMap;
  mdPlugins: PluginProp[];
  wwPlugins: PluginProp[];
  wwNodeViews: NodeViewPropMap;
  mdCommands: PluginCommandMap;
  wwCommands: PluginCommandMap;
  toolbarItems: PluginToolbarItem[];
  markdownParsers: CustomParserMap;
}
