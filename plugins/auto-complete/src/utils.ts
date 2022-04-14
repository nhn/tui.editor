import { Plugin, PluginKey, Selection } from 'prosemirror-state';
import { DecorationSet, EditorView } from 'prosemirror-view';
import { Act, AutoCompleteState, AutoCompleteTrMeta } from '@t/index';
import { TR_ACTIONS, USER_ACTIONS } from '@/constants';

export const pluginKey = new PluginKey('tui-editor-plugin-auto-complete');

export function isAutoCompleteMode(selection: Selection, decorations: DecorationSet) {
  return decorations.find(selection.from, selection.to).length > 0;
}

export function getActions(ev: KeyboardEvent): Act | null {
  switch (ev.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      return ev.key;
    case 'Enter':
      return USER_ACTIONS.ENTER;
    case 'Escape':
      return USER_ACTIONS.CLOSE;
    default:
      return null;
  }
}

export function closeAutoComplete(view: EditorView) {
  const plugin = pluginKey.get(view.state) as Plugin<AutoCompleteState>;
  const meta: AutoCompleteTrMeta = { act: TR_ACTIONS.REMOVE };
  const tr = view.state.tr.setMeta(plugin, meta);

  view.dispatch(tr);
  return true;
}
