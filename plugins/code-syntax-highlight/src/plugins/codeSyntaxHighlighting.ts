import { Plugin, PluginKey } from 'prosemirror-state';

export function codeSyntaxHighlighting(evtEmitter: any, toDOMAdaptor: any, hljs: any) {
  return new Plugin({
    key: new PluginKey('test'),
  });
}
