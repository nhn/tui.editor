import type { Emitter, PluginInfo } from '@toast-ui/editor';
import Prism from 'prismjs';

type PrismJs = typeof Prism & {
  manual: boolean;
};

declare global {
  interface Window {
    Prism: PrismJs;
  }
}

export interface PluginOptions {
  highlighter: PrismJs;
}

export default function codeSyntaxHighlightPlugin(
  emitter: Emitter,
  options: PluginOptions
): PluginInfo;
