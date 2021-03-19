import Prism from 'prismjs';
import type { Emitter, PluginInfoResult } from '@toast-ui/editor';
import { codeSyntaxHighlightPlugin } from '@/plugin';
import { PluginOptions } from '@t/index';

import '@/prismjs-langs';
import '@/css/plugin.css';

// Prevent to highlight all code elements automatically.
// @link https://prismjs.com/docs/Prism.html#.manual
// eslint-disable-next-line no-undefined
if (typeof window !== undefined) {
  window.Prism = window.Prism || {};
  window.Prism.manual = true;
}

export default function (eventEmitter: Emitter, options: PluginOptions): PluginInfoResult {
  return codeSyntaxHighlightPlugin(eventEmitter, {
    ...options,
    ...{ highlighter: Prism },
  } as PluginOptions);
}
