import Prism, { PrismJs } from 'prismjs';
import { codeSyntaxHighlightPlugin } from '@/plugin';

import { Emitter } from '@toast-ui/editor';

import '@/prismjs-langs';
import '@/css/plugin.css';

declare global {
  interface Window {
    Prism: PrismJs;
  }
}

// Prevent to highlight all code elements automatically.
// @link https://prismjs.com/docs/Prism.html#.manual
// eslint-disable-next-line no-undefined
if (typeof window !== undefined) {
  window.Prism = window.Prism || {};
  window.Prism.manual = true;
}

export default (eventEmitter: Emitter, options = {}) =>
  codeSyntaxHighlightPlugin(eventEmitter, { ...options, ...{ highlighter: Prism } });
