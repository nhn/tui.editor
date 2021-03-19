import type { Emitter, PluginInfo } from '@toast-ui/editor';

export interface PluginOptions {
  rendererURL?: string;
}

export default function umlPlugin(emitter: Emitter, options: PluginOptions): PluginInfo;
