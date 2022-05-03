import { Component } from 'react';
import ToastuiEditor, { EditorOptions, ViewerOptions, EventMap } from '@toast-ui/editor';
import ToastuiEditorViewer from '@toast-ui/editor/dist/toastui-editor-viewer';

export interface EventMapping {
  onLoad: EventMap['load'];
  onChange: EventMap['change'];
  onCaretChange: EventMap['caretChange'];
  onFocus: EventMap['focus'];
  onBlur: EventMap['blur'];
  onKeydown: EventMap['keydown'];
  onKeyup: EventMap['keyup'];
  onBeforePreviewRender: EventMap['beforePreviewRender'];
  onBeforeConvertWysiwygToMarkdown: EventMap['beforeConvertWysiwygToMarkdown'];
}

export type EventNames = keyof EventMapping;

export type EditorProps = Omit<EditorOptions, 'el'> & Partial<EventMapping>;
export type ViewerProps = Omit<ViewerOptions, 'el'> & Partial<EventMapping>;

export class Editor extends Component<EditorProps> {
  getInstance(): ToastuiEditor;

  getRootElement(): HTMLElement;
}

export class Viewer extends Component<ViewerProps> {
  getInstance(): ToastuiEditorViewer;

  getRootElement(): HTMLElement;
}

declare module 'tui-code-snippet/type/isUndefined' {
  export default function isUndefined(value: unknown): value is undefined;
}

declare module 'tui-code-snippet/domEvent/on' {
  export default function on(
    element: Element,
    types: string,
    handler: (...args: any[]) => any
  ): void;
}

declare module 'tui-code-snippet/domUtil/addClass' {
  export default function addClass(element: Element, ...classNames: string[]): void;
}

declare module 'tui-code-snippet/domUtil/removeClass' {
  export default function removeClass(element: Element, ...classNames: string[]): void;
}

declare module 'tui-code-snippet/domUtil/hasClass' {
  export default function hasClass(element: Element, ...classNames: string[]): boolean;
}
