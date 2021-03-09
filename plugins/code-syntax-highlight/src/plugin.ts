import { EditorView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';

import { getHTMLRenderers } from '@/renderers/toHTMLRenderers';
import { codeSyntaxHighlighting } from '@/plugins/codeSyntaxHighlighting';
import CodeSyntaxHighlightView from '@/nodeViews/codeSyntaxHighlightView';

import { PluginOptions } from '@t/plugin';

// @TODO change import editor's type
// import { ToDOMAdaptor } from '@t/convertor';
type ToDOMAdaptor = any;

// @TODO change import editor's type
// import { Emitter } from '@t/event';
type Emitter = any;

type GetPos = (() => number) | boolean;

function registerLanguages(hljs: any, low: any, languages: any[]) {
  languages.forEach((lang) => {
    const { rawDefinition } = hljs.getLanguage(lang);

    low.registerLanguage(lang, rawDefinition);
  });
}

export function codeSyntaxHighlightPlugin(eventEmitter: Emitter, low: any, options = {}) {
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
      codeBlock: (
        node: ProsemirrorNode,
        view: EditorView,
        getPos: GetPos,
        evtEmitter: Emitter,
        toDOMAdaptor: ToDOMAdaptor
      ) => new CodeSyntaxHighlightView(node, view, getPos, evtEmitter, toDOMAdaptor, languages),
    },
  };
}
