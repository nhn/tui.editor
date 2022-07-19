import Editor from '@toast-ui/editor';
import { isPositionInBox, toggleClass } from './util/dom';
import on from 'tui-code-snippet/domEvent/on';
import { EditorClassOptions } from '../index';
import type { ToastMark } from '@toast-ui/editor/types/toastmark';
import type MarkdownEditor from '@toast-ui/editor/src/markdown/mdEditor';
import type MarkdownPreview from '@toast-ui/editor/src/markdown/mdPreview';

const TASK_ATTR_NAME = 'data-task';
const DISABLED_TASK_ATTR_NAME = 'data-task-disabled';
const TASK_CHECKED_CLASS_NAME = 'checked';

export default class EditorClass extends Editor {
  private previewContent: HTMLElement | null = null;

  private toastMark!: ToastMark;

  private mdEditor!: MarkdownEditor;

  private preview!: MarkdownPreview;

  private isModified = false;

  private isAllowedToggleTask: boolean;

  public container!: HTMLElement;

  constructor(options: EditorClassOptions) {
    super(options);

    this.container = options.el;
    this.isAllowedToggleTask = !!options.isAllowedToggleTask;
    this.useViewerOnlyMode(!!options.viewerOnlyMode);
  }

  public setMarkdown(markdown: string, cursorToEnd?: boolean) {
    super.setMarkdown(markdown, cursorToEnd);

    if (this.previewContent) {
      this.container.removeChild(this.previewContent);
      this.setViewerContent();
    }
  }

  private toggleTask(ev: MouseEvent) {
    const element = ev.target as HTMLElement;
    const style = getComputedStyle(element, ':before');

    if (
      !element.hasAttribute(DISABLED_TASK_ATTR_NAME) &&
      element.hasAttribute(TASK_ATTR_NAME) &&
      isPositionInBox(style, ev.offsetX, ev.offsetY)
    ) {
      toggleClass(element, TASK_CHECKED_CLASS_NAME);

      const [start, end] = this.toastMark.findNodeById(
        parseInt(element.dataset.nodeid ?? '0', 10)
      )!.sourcepos!;
      const originText: string = this.mdEditor.getSelectedText(start, end);

      let resultText: string;

      if (element.className.includes(TASK_CHECKED_CLASS_NAME)) {
        resultText = originText.replace('[ ]', '[x]');
      } else {
        resultText = originText.replace('[x]', '[ ]');
      }

      const editResult = this.toastMark.editMarkdown(start, end, resultText);

      this.isModified = true;

      this.eventEmitter.emit('updatePreview', editResult);
      this.eventEmitter.emit('change', {
        source: 'viewer',
        date: ev,
      });
    }
  }

  private setViewerContent() {
    // @ts-ignore
    this.preview.removeHighlight();

    this.previewContent = this.preview.previewContent.cloneNode(true) as HTMLElement;

    if (this.isAllowedToggleTask) {
      on(this.previewContent, 'mousedown', this.toggleTask.bind(this));
    }

    this.container.appendChild(this.previewContent);
  }

  useViewerOnlyMode(useMode: boolean) {
    if (useMode) {
      if (!this.previewContent) {
        this.hide();
        this.setViewerContent();
      }
    } else {
      if (this.isModified) {
        this.setMarkdown(this.toastMark.lineTexts.join('\n'));
      }

      this.show();

      if (this.previewContent) {
        this.container.removeChild(this.previewContent);
      }
      this.previewContent = null;
    }
  }
}
