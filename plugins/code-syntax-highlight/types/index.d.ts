import type { PluginContext, PluginInfo } from '@toast-ui/editor';
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
  highlighter?: PrismJs;
};

export default function codeSyntaxHighlightPlugin(
  context: PluginContext,
  options: PluginOptions
): PluginInfo;
