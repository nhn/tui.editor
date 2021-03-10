import { getHTMLRenderers } from '@/renderers/toHTMLRenderers';
import { codeSyntaxHighlighting } from '@/plugins/codeSyntaxHighlighting';
import { createCodeSyntaxHighlightView } from '@/nodeViews/codeSyntaxHighlightView';

import { PluginOptions } from '@t/plugin';

import Hljs from 'highlight.js';
import Low from 'lowlight/lib/core';

// @TODO change import editor's type
// import { Emitter } from '@t/event';
type Emitter = any;

function registerLanguages(hljs: typeof Hljs, low: typeof Low, languages: string[]) {
  languages.forEach((lang) => {
    const { rawDefinition } = hljs.getLanguage(lang);

    low.registerLanguage(lang, rawDefinition);
  });
}

export function codeSyntaxHighlightPlugin(eventEmitter: Emitter, low: typeof Low, options = {}) {
  const { hljs } = options as PluginOptions;
  const languages = hljs.listLanguages();

  eventEmitter.addEventType('showCodeBlockLanguages');
  eventEmitter.addEventType('selectLanguage');
  eventEmitter.addEventType('finishLanguageEditing');

  registerLanguages(hljs, low, languages);

  return {
    toHTMLRenderers: getHTMLRenderers(hljs),
    wysiwygPlugins: [() => codeSyntaxHighlighting(hljs, low)],
    wysiwygNodeViews: {
      codeBlock: createCodeSyntaxHighlightView(languages),
    },
  };
}
