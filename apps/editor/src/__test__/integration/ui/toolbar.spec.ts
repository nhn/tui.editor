import isString from 'tui-code-snippet/type/isString';
import { VNode } from '@t/ui';
import EventEmitter from '@/event/eventEmitter';
import html from '@/ui/vdom/template';
import { render } from '@/ui/vdom/renderer';
import { Toolbar } from '@/ui/components/toolbar/toolbar';
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

function assertToNotContainElement(el: HTMLElement | string) {
  if (isString(el)) {
    el = getElement(el)!;
  }
  expect(document.body).not.toContainElement(el);
}

function dispatchClick(selector: string) {
  const el = getElement(selector)!;

  el.click();
}

function dispatchSelectChange(selector: string, value: string) {
  const event = new Event('change', {
    bubbles: true,
    cancelable: true,
  });
  const el = getElement(selector)! as HTMLSelectElement;

  el.value = value;

  el.dispatchEvent(event);
}

function dispatchMouseover(selector: string) {
  const event = new MouseEvent('mouseover', {
    bubbles: true,
    cancelable: true,
  });
  const el = getElement(selector)!;

  el.dispatchEvent(event);
}

function dispatchMousemove(selector: string, x: number, y: number) {
  const event = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
  });

  // @ts-ignore
  event.pageX = x;
  // @ts-ignore
  event.pageY = y;

  const el = getElement(selector)!;

  el.dispatchEvent(event);
}
let em: EventEmitter, container: HTMLElement, destroy: () => void;

describe('default toolbar', () => {
  beforeEach(() => {
    const toolbarItems = [
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task', 'indent', 'outdent'],
      ['table', 'image', 'link'],
      ['code', 'codeblock'],
      ['scrollSync'],
    ];

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
      '.tui-scroll-sync',
    ];

    toolbarButtonSelectors.forEach((selector) => {
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

  it('should hide the popup when clicking X button on popup', () => {
    dispatchClick('.tui-link');

    const linkPopup = getElement('.te-popup-add-link');
    const closeBtn = getElement('.te-popup-add-link .tui-popup-close-button');

    closeBtn.click();

    expect(linkPopup).toHaveStyle({ display: 'none' });
  });

  describe('scroll sync button', () => {
    it('should toggle state when clicking scroll sync button', () => {
      const scrollSyncBtn = getElement('.tui-scroll-sync');

      expect(scrollSyncBtn).toHaveClass('active');

      dispatchClick('.tui-scroll-sync');

      expect(scrollSyncBtn).not.toHaveClass('active');
    });

    it('should trigger command event with state', () => {
      const spy = jest.fn();

      em.listen('command', spy);

      dispatchClick('.tui-scroll-sync');

      expect(spy).toHaveBeenCalledWith(
        { type: 'markdown', command: 'toggleScrollSync' },
        { active: false }
      );

      dispatchClick('.tui-scroll-sync');

      expect(spy).toHaveBeenCalledWith(
        { type: 'markdown', command: 'toggleScrollSync' },
        { active: true }
      );
    });
  });

  describe('heading button', () => {
    it('should show the popup when clicking heading button', () => {
      dispatchClick('.tui-heading');

      const headingPopup = getElement('.te-heading-add');

      expect(headingPopup).toHaveStyle({ display: 'block' });
    });

    it('should trigger command event when clicking heading popup button', () => {
      const spy = jest.fn();

      em.listen('command', spy);

      dispatchClick('.tui-heading');
      dispatchClick('.te-heading-add [data-level="2"]');

      expect(spy).toHaveBeenCalledWith({ type: 'markdown', command: 'heading' }, { level: 2 });
    });
  });

  describe('link button', () => {
    it('should show the popup when clicking link button', () => {
      dispatchClick('.tui-link');

      const linkPopup = getElement('.te-popup-add-link');

      expect(linkPopup).toHaveStyle({ display: 'block' });
    });

    it('should hide popup when clicking Cancel button', () => {
      dispatchClick('.tui-link');
      dispatchClick('.te-popup-add-link .te-close-button');

      const linkPopup = getElement('.te-popup-add-link');

      expect(linkPopup).toHaveStyle({ display: 'none' });
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
    it('should show the popup when clicking image button', () => {
      dispatchClick('.tui-image');

      const imagePopup = getElement('.te-popup-add-image');

      expect(imagePopup).toHaveStyle({ display: 'block' });
    });

    it('should hide popup when clicking Cancel button', () => {
      dispatchClick('.tui-image');
      dispatchClick('.te-popup-add-image .te-close-button');

      const imagePopup = getElement('.te-popup-add-image');

      expect(imagePopup).toHaveStyle({ display: 'none' });
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
    it('should show the popup when clicking table button', () => {
      dispatchClick('.tui-table');

      const tablePopup = getElement('.te-popup-add-table');

      expect(tablePopup).toHaveStyle({ display: 'block' });
    });

    it('should trigger command event when selecting the area and clicking it', () => {
      const spy = jest.fn();

      em.listen('command', spy);

      dispatchClick('.tui-table');

      dispatchMousemove('.te-table-selection', 100, 60);
      dispatchClick('.te-table-selection');

      expect(spy).toHaveBeenCalledWith(
        { type: 'markdown', command: 'addTable' },
        { columnCount: 5, rowCount: 4 }
      );
    });
  });
});

describe('custom button toolbar', () => {
  function createCustomButtonWithPopup() {
    const body = document.createElement('select');

    body.innerHTML = `
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
    `;
    body.addEventListener('change', (ev) => {
      em.emit(
        'command',
        { type: 'markdown', command: 'heading' },
        { level: Number((ev.target as HTMLSelectElement).value) }
      );
      em.emit('closePopup');
      (ev.target as HTMLSelectElement).value = '1';
    });

    return {
      name: 'myToolbarWithPopup',
      tooltip: 'L!',
      className: 'my-toolbar-with-popup',
      text: 'L!',
      style: { color: '#fff', width: 30 },
      popup: {
        body,
        className: 'my-popup',
        style: { width: 'auto' },
      },
    };
  }

  const customButton = {
    name: 'myToolbar',
    tooltip: 'B!',
    className: 'my-toolbar',
    command: 'bold',
    text: 'B!',
    style: { color: '#222', width: 40 },
  };
  const customButtonWithPopup = createCustomButtonWithPopup();

  beforeEach(() => {
    const toolbarItems = [[customButton, customButtonWithPopup]];

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
    const customToolbar1 = getElement('.my-toolbar');
    const customToolbar2 = getElement('.my-toolbar-with-popup');

    expect(customToolbar1).toHaveTextContent('B!');
    expect(customToolbar1).toHaveStyle({ color: '#222', width: '40px' });

    expect(customToolbar2).toHaveTextContent('L!');
    expect(customToolbar2).toHaveStyle({ color: '#fff', width: '30px' });
  });

  it('should show tooltip when mouseover on toolbar button', () => {
    dispatchMouseover('.my-toolbar');

    const tooltip = getElement('.tui-tooltip');

    expect(tooltip).toHaveStyle({ display: 'block' });
  });

  it('should trigger command event when clicking button', () => {
    const spy = jest.fn();

    em.listen('command', spy);

    dispatchClick('.my-toolbar');

    // eslint-disable-next-line no-undefined
    expect(spy).toHaveBeenCalledWith({ type: 'markdown', command: 'bold' }, undefined);
  });

  it('should show the popup when clicking button with popup option', () => {
    dispatchClick('.my-toolbar-with-popup');

    const customPopup = getElement('.my-popup');

    expect(customPopup).toHaveStyle({ display: 'block', width: 'auto' });
    expect(customPopup).toHaveClass('my-popup');
  });

  it('should operate properly when event is triggered in popup', () => {
    const spy = jest.fn();

    em.listen('command', spy);

    dispatchClick('.my-toolbar-with-popup');
    dispatchClick('select');
    dispatchSelectChange('select', '3');

    expect(spy).toHaveBeenCalledWith({ type: 'markdown', command: 'heading' }, { level: 3 });
  });
});

describe('custom toolbar element', () => {
  function createCustomItem() {
    const el = document.createElement('div');

    el.className = 'my-toolbar';
    el.textContent = 'custom1';

    return {
      el,
      name: 'myToolbar',
      tooltip: 'custom1!',
    };
  }

  function createCustomItemWithPopup() {
    const el = document.createElement('div');

    el.textContent = 'custom2';

    const body = document.createElement('select');

    body.innerHTML = `
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
    `;
    body.addEventListener('change', (ev) => {
      em.emit(
        'command',
        { type: 'markdown', command: 'heading' },
        { level: Number((ev.target as HTMLSelectElement).value) }
      );
      em.emit('closePopup');
      (ev.target as HTMLSelectElement).value = '1';
    });

    el.className = 'my-toolbar-with-popup';

    return {
      el,
      name: 'myToolbarWithPopup',
      tooltip: 'custom2!',
      popup: {
        body,
        className: 'my-popup',
        style: { width: 'auto' },
      },
    };
  }

  const customItem = createCustomItem();
  const customItemWithPopup = createCustomItemWithPopup();

  beforeEach(() => {
    const toolbarItems = [[customItem, customItemWithPopup]];

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
    const customToolbar1 = getElement('.my-toolbar');
    const customToolbar2 = getElement('.my-toolbar-with-popup');

    expect(customToolbar1).toHaveTextContent('custom1');
    expect(customToolbar2).toHaveTextContent('custom2');
  });

  it('should show tooltip when mouseover on toolbar button', () => {
    dispatchMouseover('.my-toolbar');

    const tooltip = getElement('.tui-tooltip');

    expect(tooltip).toHaveStyle({ display: 'block' });
  });

  it('should show the popup when clicking custom toolbar item with popup option', () => {
    dispatchClick('.my-toolbar-with-popup');

    const customPopup = getElement('.my-popup');

    expect(customPopup).toHaveStyle({ display: 'block', width: 'auto' });
    expect(customPopup).toHaveClass('my-popup');
  });

  it('should operate properly when event is triggered in popup', () => {
    const spy = jest.fn();

    em.listen('command', spy);

    dispatchClick('.my-toolbar-with-popup');
    dispatchClick('select');
    dispatchSelectChange('select', '3');

    expect(spy).toHaveBeenCalledWith({ type: 'markdown', command: 'heading' }, { level: 3 });
  });
});

describe('API', () => {
  let ref: Toolbar | null;

  function getToolbarItems() {
    return getElement('.tui-editor-defaultUI-toolbar').querySelectorAll('button:not(.tui-more)');
  }

  beforeEach(() => {
    const toolbarItems = [['heading', 'bold', 'italic', 'strike']];

    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventEmitter();

    destroy = render(
      container,
      html`
        <${Toolbar}
          ref=${(toolbar: Toolbar) => (ref = toolbar)}
          eventEmitter=${em}
          previewStyle="vertical"
          toolbarItems=${toolbarItems}
          editorType="markdown"
        />
      ` as VNode
    );
    jest
      .spyOn(getElement('.tui-editor-defaultUI-toolbar'), 'clientWidth', 'get')
      .mockImplementation(() => 500);
  });

  afterEach(() => {
    ref = null;
    destroy();
  });

  it('should insert item on calling insertToolbarItem', () => {
    ref!.insertToolbarItem({ groupIndex: 0, itemIndex: 1 }, 'ol');

    const toolbarItems = getToolbarItems();

    expect(toolbarItems[0]).toHaveClass('tui-heading');
    expect(toolbarItems[1]).toHaveClass('tui-ol');
    expect(toolbarItems[2]).toHaveClass('tui-bold');
    expect(toolbarItems[3]).toHaveClass('tui-italic');
    expect(toolbarItems[4]).toHaveClass('tui-strike');
    // should have same parent because the toolbar is added to same group
    expect(toolbarItems[1].parentElement).toEqual(toolbarItems[2].parentElement);
  });

  it('should add item on calling insertToolbarItem', () => {
    ref!.insertToolbarItem({ groupIndex: 1, itemIndex: 1 }, 'ol');

    const toolbarItems = getToolbarItems();

    expect(toolbarItems[0]).toHaveClass('tui-heading');
    expect(toolbarItems[1]).toHaveClass('tui-bold');
    expect(toolbarItems[2]).toHaveClass('tui-italic');
    expect(toolbarItems[3]).toHaveClass('tui-strike');
    expect(toolbarItems[4]).toHaveClass('tui-ol');
    // should have different parent because the toolbar is added to another group
    expect(toolbarItems[3].parentElement).not.toEqual(toolbarItems[4].parentElement);
  });

  it('should insert custom toolbar item on calling insertToolbarItem', () => {
    const customButton = {
      name: 'myToolbar',
      tooltip: 'B!',
      className: 'my-toolbar',
      command: 'bold',
      text: 'B!',
      style: { color: '#222', width: 40 },
    };

    ref!.insertToolbarItem({ groupIndex: 0, itemIndex: 1 }, customButton);

    const toolbarItems = getToolbarItems();

    expect(toolbarItems[0]).toHaveClass('tui-heading');

    expect(toolbarItems[1]).toHaveClass('my-toolbar');
    expect(toolbarItems[1]).toHaveTextContent('B!');
    expect(toolbarItems[1]).toHaveStyle({ color: '#222', width: '40px' });

    expect(toolbarItems[2]).toHaveClass('tui-bold');
    expect(toolbarItems[3]).toHaveClass('tui-italic');
    expect(toolbarItems[4]).toHaveClass('tui-strike');
  });

  it('should remove item on calling removeToolbarItem', () => {
    ref!.removeToolbarItem('bold');

    assertToNotContainElement('.tui-bold');
  });
});

describe('event', () => {
  beforeEach(() => {
    const toolbarItems = [['image', 'link']];

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
          editorType="wysiwyg"
        />
      ` as VNode
    );
  });

  afterEach(() => {
    destroy();
  });

  describe('openPopup', () => {
    it('should open popup corresponding to name', () => {
      em.emit('openPopup', 'image');

      const imagePopup = getElement('.te-popup-add-image');

      expect(imagePopup).toHaveStyle({ display: 'block' });
    });

    it('should render popup with initial values', () => {
      const initialValues = { linkUrl: 'http://test.com', linkText: 'foo' };

      em.emit('openPopup', 'link', initialValues);

      const urlText = getElement('.te-popup-add-link .te-url-input') as HTMLInputElement;
      const linkText = getElement('.te-popup-add-link .te-link-text-input') as HTMLInputElement;

      expect(urlText).toHaveValue('http://test.com');
      expect(linkText).toHaveValue('foo');
    });
  });
});
