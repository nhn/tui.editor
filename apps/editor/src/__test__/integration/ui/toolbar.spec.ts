import isString from 'tui-code-snippet/type/isString';
import { VNode } from '@t/ui';
import EventEmitter from '@/event/eventEmitter';
import html from '@/new/vdom/template';
import { render } from '@/new/renderer';
import { Toolbar } from '@/new/components/toolbar/toolbar';
import { groupingToolbarItems } from '@/new/toolbarItemFactory';
import '@/i18n/en-us';

function getElement(selector: string) {
  return document.querySelector<HTMLElement>(selector)!;
}

function assertToContainElement(el: HTMLElement | string) {
  if (isString(el)) {
    el = getElement(el)!;
  }
  expect(document.body).toContainElement(el);
}

function dispatchClick(selector: string) {
  const el = getElement(selector)!;

  el.click();
}

function dispatchMouseover(selector: string) {
  const event = new MouseEvent('mouseover', {
    bubbles: true,
    cancelable: true
  });
  const el = getElement(selector)!;

  el.dispatchEvent(event);
}

function dispatchMousemove(selector: string, x: number, y: number) {
  const event = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true
  });

  // @ts-ignore
  event.pageX = x;
  // @ts-ignore
  event.pageY = y;

  const el = getElement(selector)!;

  el.dispatchEvent(event);
}

describe('toolbar', () => {
  let em: EventEmitter, container: HTMLElement, destroy: () => void;

  beforeEach(() => {
    const toolbarItems = groupingToolbarItems([
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task', 'indent', 'outdent'],
      ['table', 'image', 'link'],
      ['code', 'codeblock'],
      'scrollSync'
    ]);

    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventEmitter();

    destroy = render(
      container,
      html`
        <${Toolbar}
          eventEmitter=${em}
          previewStyle="vertical"
          toolbarItems=${toolbarItems}
          editorType="markdown"
        />
      ` as VNode
    );
  });

  afterEach(() => {
    destroy();
  });

  it('should be rendered properly', () => {
    const toolbarButtonSelectors = [
      '.tui-heading',
      '.tui-bold',
      '.tui-italic',
      '.tui-strike',
      '.tui-hrline',
      '.tui-quote',
      '.tui-ul',
      '.tui-ol',
      '.tui-task',
      '.tui-indent',
      '.tui-outdent',
      '.tui-table',
      '.tui-image',
      '.tui-link',
      '.tui-code',
      '.tui-codeblock',
      '.tui-scrollsync'
    ];

    toolbarButtonSelectors.forEach(selector => {
      assertToContainElement(selector);
    });
  });

  it('should show tooltip when mouseover on toolbar button', () => {
    dispatchMouseover('.tui-bold');

    const tooltip = getElement('.tui-tooltip');

    expect(tooltip).toHaveStyle({ display: 'block' });
  });

  it('should trigger command event when clicking toolbar button', () => {
    const spy = jest.fn();

    em.listen('command', spy);

    dispatchClick('.tui-bold');

    // eslint-disable-next-line no-undefined
    expect(spy).toHaveBeenCalledWith({ type: 'markdown', command: 'bold' }, undefined);
  });

  it('should hide the layer when clicking X button on layer', () => {
    dispatchClick('.tui-link');

    const linkLayer = getElement('.te-popup-add-link');
    const closeBtn = getElement('.te-popup-add-link .tui-popup-close-button');

    closeBtn.click();

    expect(linkLayer).toHaveStyle({ display: 'none' });
  });

  describe('scroll sync button', () => {
    it('should toggle state when clicking scroll sync button', () => {
      const scrollSyncBtn = getElement('.tui-scrollsync');

      expect(scrollSyncBtn).toHaveClass('active');

      dispatchClick('.tui-scrollsync');

      expect(scrollSyncBtn).not.toHaveClass('active');
    });

    it('should trigger command event with state', () => {
      const spy = jest.fn();

      em.listen('command', spy);

      dispatchClick('.tui-scrollsync');

      expect(spy).toHaveBeenCalledWith(
        { type: 'markdown', command: 'toggleScrollSync' },
        { active: false }
      );

      dispatchClick('.tui-scrollsync');

      expect(spy).toHaveBeenCalledWith(
        { type: 'markdown', command: 'toggleScrollSync' },
        { active: true }
      );
    });
  });

  describe('heading button', () => {
    it('should show the layer when clicking heading button', () => {
      dispatchClick('.tui-heading');

      const headingLayer = getElement('.te-heading-add');

      expect(headingLayer).toHaveStyle({ display: 'block' });
    });

    it('should trigger command event when clicking heading layer button', () => {
      const spy = jest.fn();

      em.listen('command', spy);

      dispatchClick('.tui-heading');
      dispatchClick('.te-heading-add [data-value="2"]');

      expect(spy).toHaveBeenCalledWith({ type: 'markdown', command: 'heading' }, { level: 2 });
    });
  });

  describe('link button', () => {
    it('should show the layer when clicking link button', () => {
      dispatchClick('.tui-link');

      const linkLayer = getElement('.te-popup-add-link');

      expect(linkLayer).toHaveStyle({ display: 'block' });
    });

    it('should hide layer when clicking Cancel button', () => {
      dispatchClick('.tui-link');
      dispatchClick('.te-popup-add-link .te-close-button');

      const linkLayer = getElement('.te-popup-add-link');

      expect(linkLayer).toHaveStyle({ display: 'none' });
    });

    it('should trigger command event when clicking OK button', () => {
      const spy = jest.fn();

      em.listen('command', spy);

      dispatchClick('.tui-link');

      const urlText = getElement('.te-popup-add-link .te-url-input') as HTMLInputElement;
      const linkText = getElement('.te-popup-add-link .te-link-text-input') as HTMLInputElement;

      urlText.value = 'https://ui.toast.com';
      linkText.value = 'toastui';

      dispatchClick('.te-popup-add-link .te-ok-button');

      expect(spy).toHaveBeenCalledWith(
        { type: 'markdown', command: 'addLink' },
        { linkText: 'toastui', linkUrl: 'https://ui.toast.com' }
      );
    });

    it('should add wrong class when url or text are not filled out', () => {
      dispatchClick('.tui-link');

      const urlText = getElement('.te-popup-add-link .te-url-input') as HTMLInputElement;
      const linkText = getElement('.te-popup-add-link .te-link-text-input') as HTMLInputElement;

      dispatchClick('.te-popup-add-link .te-ok-button');

      expect(urlText).toHaveClass('wrong');

      urlText.value = 'https://ui.toast.com';
      dispatchClick('.te-popup-add-link .te-ok-button');

      expect(linkText).toHaveClass('wrong');
    });
  });

  describe('image button', () => {
    it('should show the layer when clicking image button', () => {
      dispatchClick('.tui-image');

      const imageLayer = getElement('.te-popup-add-image');

      expect(imageLayer).toHaveStyle({ display: 'block' });
    });

    it('should hide layer when clicking Cancel button', () => {
      dispatchClick('.tui-image');
      dispatchClick('.te-popup-add-image .te-close-button');

      const imageLayer = getElement('.te-popup-add-image');

      expect(imageLayer).toHaveStyle({ display: 'none' });
    });

    it('should toggle tab when clicking the file or url tab', () => {
      dispatchClick('.tui-image');

      const fileTabBtn = getElement('.te-popup-add-image .te-tab-active');
      const urlTabBtn = fileTabBtn.nextSibling as HTMLButtonElement;

      urlTabBtn.click();

      expect(fileTabBtn).not.toHaveClass('te-tab-active');
      expect(urlTabBtn).toHaveClass('te-tab-active');

      fileTabBtn.click();

      expect(fileTabBtn).toHaveClass('te-tab-active');
      expect(urlTabBtn).not.toHaveClass('te-tab-active');
    });

    it('should trigger command event when clicking OK button', () => {
      const spy = jest.fn();

      em.listen('command', spy);

      dispatchClick('.tui-image');

      const fileTabBtn = getElement('.te-popup-add-image .te-tab-active');
      const urlTabBtn = fileTabBtn.nextSibling as HTMLButtonElement;
      const urlText = getElement('.te-popup-add-image .te-image-url-input') as HTMLInputElement;
      const descriptionText = getElement(
        '.te-popup-add-image .te-alt-text-input'
      ) as HTMLInputElement;

      urlTabBtn.click();

      urlText.value = 'myImageUrl';
      descriptionText.value = 'image';

      dispatchClick('.te-popup-add-image .te-ok-button');

      expect(spy).toHaveBeenCalledWith(
        { type: 'markdown', command: 'addImage' },
        { altText: 'image', imageUrl: 'myImageUrl' }
      );
    });
  });

  describe('table button', () => {
    it('should show the layer when clicking table button', () => {
      dispatchClick('.tui-table');

      const tableLayer = getElement('.te-popup-add-table');

      expect(tableLayer).toHaveStyle({ display: 'block' });
    });

    it('should trigger command event when selecting the area and clicking it', () => {
      const spy = jest.fn();

      em.listen('command', spy);

      dispatchClick('.tui-table');

      dispatchMousemove('.te-table-selection', 100, 60);
      dispatchClick('.te-table-selection');

      expect(spy).toHaveBeenCalledWith(
        { type: 'markdown', command: 'addTable' },
        { colLen: 5, rowLen: 4 }
      );
    });
  });
});
