import { Plugin } from 'prosemirror-state';
import { EditorView, NodeView } from 'prosemirror-view';

import { CustomHTMLRendererMap } from '@t/markdown';
import { Emitter } from '@t/event';
import { ToDOMAdaptor } from '@t/convertor';

export type ExtraPlugin = (eventEmitter: Emitter) => Plugin;

export type ExtraNodeViews = (
  node: Node,
  view: EditorView,
  getPos: () => number,
  evnetEmitter: Emitter,
  toDOMAdaptor: ToDOMAdaptor
) => NodeView;

interface ExtraNodeViewMap {
  [k: string]: ExtraNodeViews;
}

export interface PluginInfoResult {
  toHTMLRenderers: CustomHTMLRendererMap;
  mdPlugins: ExtraPlugin[];
  wwPlugins: ExtraPlugin[];
  wwNodeViews: ExtraNodeViewMap;
}
