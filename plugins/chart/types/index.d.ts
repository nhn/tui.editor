import type { Emitter, PluginInfo } from '@toast-ui/editor';

export interface PluginOptions {
  usageStatistics?: boolean;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  width: number | 'auto';
  height: number | 'auto';
}

export default function chartPlugin(emitter: Emitter, options: PluginOptions): PluginInfo;
