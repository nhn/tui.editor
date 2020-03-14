import Vue from 'vue';
import Editor from '@toast-ui/editor';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';

type FunctionKeys<T extends object> = {[K in keyof T]: T[K] extends Function ? K : never}[keyof T];

type EditorFnKeys = FunctionKeys<Editor>;
type ViewerFnKeys = FunctionKeys<Viewer>;

export declare class Editor extends Vue {
  invoke<T extends EditorFnKeys>(fname: T, ...args: Parameters<Editor[T]>): ReturnType<Editor[T]>;
  getRootElement(): HTMLElement;
}

export declare class Viewer extends Vue {
  invoke<T extends ViewerFnKeys>(fname: T, ...args: Parameters<Viewer[T]>): ReturnType<Viewer[T]>;
  getRootElement(): HTMLElement;
}
