import type { EditorCore as Editor } from '@t/editor';

type QueryFn = (editor: Editor, payload?: Record<string, any>) => any;

const queryMap: Record<string, QueryFn> = {
  getPopupInitialValues(editor, payload) {
    const { popupName } = payload!;

    return popupName === 'link' ? { linkText: editor.getSelectedText() } : {};
  },
};

export function buildQuery(editor: Editor) {
  editor.eventEmitter.listen('query', (query: string, payload?: Record<string, any>) =>
    queryMap[query](editor, payload)
  );
}
