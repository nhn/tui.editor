import { Plugin } from 'prosemirror-state';

import { CustomHTMLRendererMap } from '@t/markdown';
import { Emitter } from '@t/event';
import { ToDOMAdaptor } from '@t/convertor';

export type ExtraMdPlugin = (eventEmitter: Emitter) => Plugin;

export type ExtraWwPlugin = (eventEmitter: Emitter, toDOMAdaptor: ToDOMAdaptor) => Plugin;

export interface PluginInfoResult {
  toHTMLRenderers: CustomHTMLRendererMap;
  mdPlugins: ExtraMdPlugin[];
  wwPlugins: ExtraWwPlugin[];
}

export interface ExtraPluginInfoResult {
  mdPlugins: ExtraMdPlugin[];
  wwPlugins: ExtraWwPlugin[];
}
