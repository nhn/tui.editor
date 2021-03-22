import { codeSyntaxHighlightPlugin } from '@/plugin';

import '@/css/plugin.css';

// Prevent to highlight all code elements automatically.
// @link https://prismjs.com/docs/Prism.html#.manual
// eslint-disable-next-line no-undefined
if (typeof window !== undefined) {
  window.Prism = window.Prism || {};
  window.Prism.manual = true;
}

export default codeSyntaxHighlightPlugin;
