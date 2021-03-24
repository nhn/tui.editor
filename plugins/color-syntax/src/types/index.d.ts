import type { Emitter, PluginInfo } from '@toast-ui/editor';

export interface PluginOptions {
  preset?: string[];
}

export default function colorPlugin(emitter: Emitter, options: PluginOptions): PluginInfo;
