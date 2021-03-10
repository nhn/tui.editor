import { codeSyntaxHighlightPlugin } from '@/plugin';

import '@/css/plugin.css';

import low from 'lowlight/lib/core';

// @TODO change import editor's type
// import { Emitter } from '@t/event';
type Emitter = any;

export default (eventEmitter: Emitter, options = {}) =>
  codeSyntaxHighlightPlugin(eventEmitter, low, options);
