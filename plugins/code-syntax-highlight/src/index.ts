import { codeSyntaxHighlightPlugin } from '@/plugin';

import { Emitter } from '@toast-ui/editor';

import '@/css/plugin.css';

import * as Prism from 'prismjs';

declare global {
  interface Window {
    Prism: typeof Prism;
  }
}

// Prevent to highlight all code elements automatically.
// @link https://prismjs.com/docs/Prism.html#.manual
// eslint-disable-next-line no-undefined
if (typeof window !== undefined) {
  window.Prism = window.Prism || {};

  // @ts-ignore
  // Prism.manual = true;
}

export default (eventEmitter: Emitter, options = {}) =>
  codeSyntaxHighlightPlugin(eventEmitter, options);
