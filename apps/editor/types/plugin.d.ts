import { Plugin } from 'prosemirror-state';
import { EditorView, NodeView } from 'prosemirror-view';

import { HTMLConvertorMap } from '@toast-ui/toastmark';
import { Emitter } from '@t/event';
import { ToDOMAdaptor } from '@t/convertor';

export type PluginProp = (eventEmitter: Emitter) => Plugin;

export type ExtraNodeViews = (
  node: Node,
  view: EditorView,
  getPos: () => number,
  evnetEmitter: Emitter,
  toDOMAdaptor: ToDOMAdaptor
) => NodeView;

interface NodeViewPropMap {
  [k: string]: ExtraNodeViews;
}

export interface PluginInfoResult {
  toHTMLRenderers: HTMLConvertorMap;
  mdPlugins: PluginProp[];
  wwPlugins: PluginProp[];
  wwNodeViews: NodeViewPropMap;
}
