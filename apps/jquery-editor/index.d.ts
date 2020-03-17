import * as $ from 'jquery';
import { EditorOptions } from '@toast-ui/editor';
import { ViewerOptions } from '@toast-ui/editor/dist/toastui-editor-viewer';
declare global {
  interface JQuery {
    toastuiEditor(options?: EditorOptions | ViewerOptions): JQuery;
  }
}