import type { Emitter, PluginInfo, PluginDefaultOptions } from '@toast-ui/editor';
import Prism from 'prismjs';

type PrismJs = typeof Prism & {
  manual: boolean;
};

declare global {
  interface Window {
    Prism: PrismJs;
  }
}

export type PluginOptions = {
  highlighter: PrismJs;
} & PluginDefaultOptions;

export default function codeSyntaxHighlightPlugin(
  emitter: Emitter,
  options: PluginOptions
): PluginInfo;
