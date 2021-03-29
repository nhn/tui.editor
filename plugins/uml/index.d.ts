import type { PluginContext, PluginInfo } from '@toast-ui/editor';

export interface PluginOptions {
  rendererURL?: string;
}

export default function umlPlugin(context: PluginContext, options: PluginOptions): PluginInfo;
