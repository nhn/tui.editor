import { getHTMLRenderers } from '@/renderers/toHTMLRenderers';
import { codeSyntaxHighlighting } from '@/plugins/codeSyntaxHighlighting';

import { PluginOptions } from '@t/plugin';

function registerLanguages(hljs: any, low: any) {
  const languages: any[] = hljs.listLanguages();

  languages.forEach((lang) => {
    const { rawDefinition } = hljs.getLanguage(lang);

    low.registerLanguage(lang, rawDefinition);
  });
}

export function codeSyntaxHighlightPlugin(eventEmitter: any, low: any, options = {}) {
  const { hljs } = options as PluginOptions;

  registerLanguages(hljs, low);

  console.log(low.highlight('js', 'var foo = 123'));

  return {
    toHTMLRenderers: getHTMLRenderers(hljs),
    wwPlugins: [() => codeSyntaxHighlighting(low)],
  };
}
