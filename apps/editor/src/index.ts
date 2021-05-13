import EditorCore from './editorCore';
import Editor from './editor';

import 'prosemirror-view/style/prosemirror.css';
import '@/css/editor.css';
import '@/css/contents.css';
import '@/css/preview-highlighting.css';
import '@/css/md-syntax-highlighting.css';

import './i18n/en-us';

export default Editor;
export { Editor, EditorCore };
