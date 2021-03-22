import { Plugin } from 'prosemirror-state';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';

import { HTMLConvertorMap } from '@toast-ui/toastmark';
import { Emitter } from './event';
import { ToDOMAdaptor, ToMdConvertorMap } from './convertor';
import { EditorCommand } from './spec';

export type PluginProp = (eventEmitter?: Emitter) => Plugin;

export type PluginNodeViews = (
  node: Node,
  view: EditorView,
  getPos: () => number,
  eventEmitter: Emitter,
  toDOMAdaptor: ToDOMAdaptor
) => NodeView;

type NodeViewPropMap = Record<string, PluginNodeViews>;

export type PluginCommandMap = Record<string, EditorCommand>;

export interface PluginInfo {
  toHTMLRenderers?: HTMLConvertorMap;
  toMarkdownRenderers?: ToMdConvertorMap;
  markdownPlugins?: PluginProp[];
  wysiwygPlugins?: PluginProp[];
  wysiwygNodeViews?: NodeViewPropMap;
  markdownCommands?: PluginCommandMap;
  wysiwygCommands?: PluginCommandMap;
}

export interface PluginInfoResult {
  toHTMLRenderers: HTMLConvertorMap;
  toMarkdownRenderers: ToMdConvertorMap;
  mdPlugins: PluginProp[];
  wwPlugins: PluginProp[];
  wwNodeViews: NodeViewPropMap;
  mdCommands: PluginCommandMap;
  wwCommands: PluginCommandMap;
}
