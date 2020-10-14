import { EditorView } from 'prosemirror-view';
import { EditorCommand } from '@t/spec';

export function execCommand(
  view: EditorView,
  command: EditorCommand,
  payload?: Record<string, any>
) {
  view.focus();
  return command(payload)(view.state, view.dispatch, view);
}
