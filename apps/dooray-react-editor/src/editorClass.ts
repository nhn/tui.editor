import { Editor, EditorOptions } from '@toast-ui/editor';
import { isPositionInBox, toggleClass } from './util/dom';
import on from 'tui-code-snippet/domEvent/on';

interface EditorClassOptions extends EditorOptions {
  viewerOnlyMode?: boolean;
}

const TASK_ATTR_NAME = 'data-task';
const DISABLED_TASK_ATTR_NAME = 'data-task-disabled';
const TASK_CHECKED_CLASS_NAME = 'checked';

export default class EditorClass extends Editor {
  private previewContent: HTMLElement | null = null;

  private container!: HTMLElement;

  constructor(options: EditorClassOptions) {
    super(options);

    this.container = options.el;
    this.useViewerOnlyMode(!!options.viewerOnlyMode);
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
      this.eventEmitter.emit('change', {
        source: 'viewer',
        date: ev,
      });
    }
  }

  useViewerOnlyMode(useMode: boolean) {
    if (useMode) {
      if (!this.previewContent) {
        this.hide();

        // @ts-ignore
        this.preview.removeHighlight();
        // @ts-ignore
        this.previewContent = this.preview.previewContent.cloneNode(true) as HTMLElement;

        on(this.previewContent, 'mousedown', this.toggleTask.bind(this));
        this.container.appendChild(this.previewContent);
      }
    } else {
      this.show();

      if (this.previewContent) {
        this.container.removeChild(this.previewContent);
      }
      this.previewContent = null;
    }
  }
}
