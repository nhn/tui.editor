import type { Emitter, PluginInfo, I18n } from '@toast-ui/editor';

export interface PluginOptions {
  preset?: string[];
  usageStatistics?: boolean;
  i18n: I18n;
}

export default function colorPlugin(emitter: Emitter, options: PluginOptions): PluginInfo;
