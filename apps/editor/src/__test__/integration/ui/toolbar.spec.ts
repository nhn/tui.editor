import { cls } from '@/utils/dom';
import { fireEvent, getByLabelText, getByText, screen } from '@testing-library/dom';
import { Editor } from '@/index';
import '@/i18n/en-us';

function getElement(selector: string) {
  return document.querySelector<HTMLElement>(selector)!;
}

function getPopUpElement() {
  return getElement(`.${cls('popup')}`);
}

function fireMousemoveEvent(el: HTMLElement, x: number, y: number) {
  const event = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
  });

  // @ts-ignore
  event.pageX = x;
  // @ts-ignore
  event.pageY = y;

  fireEvent(el, event);
}

function fireMouseoverEvent(el: HTMLElement) {
  const mouseover = new MouseEvent('mouseover', {
    bubbles: true,
    cancelable: true,
  });

  fireEvent(el, mouseover);
}

describe('Default toolbar', () => {
  let el: HTMLDivElement, editor: Editor;

  beforeEach(() => {
    el = document.createElement('div');

    editor = new Editor({
      el,
      previewStyle: 'vertical',
      height: '400px',
      initialEditType: 'markdown',
    });

    document.body.appendChild(el);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(el);
  });

  it('should be rendered properly', () => {
    [
      'Headings',
      'Bold',
      'Italic',
      'Italic',
      'Line',
      'Blockquote',
      'Unordered list',
      'Ordered list',
      'Task',
      'Indent',
      'Outdent',
      'Insert table',
      'Insert image',
      'Insert link',
      'Inline code',
      'Insert codeBlock',
    ].forEach((label) => {
      expect(screen.queryByLabelText(label)).not.toBeNull();
    });

    expect(document.body).toContainElement(getElement('.scroll-sync'));
  });

  it('should trigger command event when clicking toolbar button', () => {
    const spy = jest.fn();

    editor.eventEmitter.listen('command', spy);
    screen.getByLabelText('Bold').click();

    // eslint-disable-next-line no-undefined
    expect(spy).toHaveBeenCalledWith('bold', undefined);
  });

  it('should show tooltip when mouseover on toolbar button', () => {
    fireMouseoverEvent(screen.getByLabelText('Headings'));

    const tooltip = screen.getByText('Headings').parentElement;

    expect(tooltip).toHaveStyle({ display: 'block' });
    expect(tooltip).toHaveClass(cls('tooltip'));
  });

  describe('scroll sync button', () => {
    it('should toggle active state when clicking scroll sync button', () => {
      const scrollSyncSwitch = getElement('.scroll-sync');

      expect(scrollSyncSwitch).toHaveClass('active');

      scrollSyncSwitch.click();

      expect(scrollSyncSwitch).not.toHaveClass('active');
    });

    it('should trigger command event with state', () => {
      const spy = jest.fn();

      editor.eventEmitter.listen('command', spy);

      getElement('.scroll-sync').click();

      expect(spy).toHaveBeenCalledWith('toggleScrollSync', { active: false });

      getElement('.scroll-sync').click();

      expect(spy).toHaveBeenCalledWith('toggleScrollSync', { active: true });
    });
  });

  describe('Headings button', () => {
    let headingPopup: HTMLElement;
    let hedingButton: HTMLElement;

    beforeEach(() => {
      headingPopup = getPopUpElement();
      hedingButton = screen.getByLabelText('Headings');

      hedingButton.click();
    });

    it('should show the popup when clicking Headings button', () => {
      expect(headingPopup).toHaveClass(cls('popup-add-heading'));
      expect(headingPopup).toHaveStyle({ display: 'block' });
    });

    ['1', '2', '3', '4', '5', '6'].forEach((level) => {
      const mdHeadingOfLevel = '#'.repeat(parseInt(level, 10));

      it(`should active heading button when click heading level ${level}`, () => {
        getByText(headingPopup, `Heading ${level}`).click();

        expect(hedingButton).toHaveClass('active');
      });

      it(`should add heading to document when click heading level ${level}`, () => {
        getByText(headingPopup, `Heading ${level}`).click();

        expect(editor.getMarkdown()).toBe(`${mdHeadingOfLevel} `);
      });
    });
  });

  describe('link button', () => {
    let linkPopup: HTMLElement;
    let linkButton: HTMLElement;

    beforeEach(() => {
      linkPopup = getPopUpElement();
      linkButton = screen.getByLabelText('Insert link');

      linkButton.click();
    });

    it('should show the popup when clicking link button', () => {
      expect(linkPopup).toHaveClass(cls('popup-add-link'));
      expect(linkPopup).toHaveStyle({ display: 'block' });
    });

    it('should hide popup when clicking Cancel button', () => {
      const closeBtn = getByText(linkPopup, 'Cancel');

      closeBtn.click();

      expect(linkPopup).toHaveStyle({ display: 'none' });
    });

    it('should add link to document when clicking OK button', () => {
      const urlText = getByText(linkPopup, 'URL').nextElementSibling as HTMLInputElement;
      const linkText = getByText(linkPopup, 'Link text').nextElementSibling as HTMLInputElement;
      const OkBtn = getByText(linkPopup, 'OK');

      urlText.value = 'https://ui.toast.com';
      linkText.value = 'toastui';

      OkBtn.click();

      expect(editor.getMarkdown()).toBe('[toastui](https://ui.toast.com)');
    });

    it('should add wrong class when url or text are not filled out', () => {
      const urlText = getByText(linkPopup, 'URL').nextElementSibling as HTMLInputElement;
      const linkText = getByText(linkPopup, 'Link text').nextElementSibling as HTMLInputElement;
      const OkBtn = getByText(linkPopup, 'OK');

      OkBtn.click();

      expect(urlText).toHaveClass('wrong');

      urlText.value = 'https://ui.toast.com';
      OkBtn.click();

      expect(linkText).toHaveClass('wrong');
    });
  });

  describe('image button', () => {
    let imagePopup: HTMLElement;
    let imageButton: HTMLElement;

    beforeEach(() => {
      imagePopup = getPopUpElement();
      imageButton = screen.getByLabelText('Insert image');

      imageButton.click();
    });

    it('should show the popup when clicking image button', () => {
      expect(imagePopup).toHaveClass(cls('popup-add-image'));
      expect(imagePopup).toHaveStyle({ display: 'block' });
    });

    it('should hide popup when clicking Cancel button', () => {
      const closeBtn = getByText(imagePopup, 'Cancel');

      closeBtn.click();

      expect(imagePopup).toHaveStyle({ display: 'none' });
    });

    it('should toggle tab when clicking the file or url tab', () => {
      const fileTabBtn = getByLabelText(imagePopup, 'File');
      const urlTabBtn = getByLabelText(imagePopup, 'URL');

      urlTabBtn.click();

      expect(fileTabBtn).not.toHaveClass('active');
      expect(urlTabBtn).toHaveClass('active');

      fileTabBtn.click();

      expect(fileTabBtn).toHaveClass('active');
      expect(urlTabBtn).not.toHaveClass('active');
    });

    it('should add image to document when clicking OK button', () => {
      getByLabelText(imagePopup, 'URL').click();

      const urlText = getByText(imagePopup, 'Image URL').nextElementSibling as HTMLInputElement;
      const descriptionText = getByText(imagePopup, 'Description')
        .nextElementSibling as HTMLInputElement;
      const OkBtn = getByText(imagePopup, 'OK');

      urlText.value = 'myImageUrl';
      descriptionText.value = 'image';

      OkBtn.click();

      expect(editor.getMarkdown()).toBe('![image](myImageUrl)');
    });

    it('should add wrong class when url or text are not filled out', () => {
      const fileText = getByText(imagePopup, 'Select image file')
        .nextElementSibling as HTMLInputElement;
      const urlText = getByText(imagePopup, 'Image URL').nextElementSibling as HTMLInputElement;
      const OkBtn = getByText(imagePopup, 'OK');

      OkBtn.click();

      expect(fileText).toHaveClass('wrong');

      getByLabelText(imagePopup, 'URL').click();

      OkBtn.click();

      expect(urlText).toHaveClass('wrong');
    });
  });

  describe('table button', () => {
    let tablePopup: HTMLElement;
    let tableButton: HTMLElement;

    beforeEach(() => {
      tablePopup = getPopUpElement();
      tableButton = screen.getByLabelText('Insert table');

      tableButton.click();
    });

    it('should show the popup when clicking table button', () => {
      expect(tablePopup).toHaveClass(cls('popup-add-table'));
      expect(tablePopup).toHaveStyle({ display: 'block' });
    });

    it('should add table to document when selecting the area and clicking it', () => {
      const tableSelection = tablePopup.querySelector(`.${cls('table-selection')}`)! as HTMLElement;

      fireMousemoveEvent(tableSelection, 100, 60);
      tableSelection.click();

      expect(editor.getMarkdown()).toBe(
        '\n|  |  |  |  |  |  |\n| --- | --- | --- | --- | --- | --- |\n|  |  |  |  |  |  |\n|  |  |  |  |  |  |\n|  |  |  |  |  |  |'
      );
    });
  });

  it('should active indent/outdent button when only ordered or bullet list actived', () => {
    const bulletListBtn = screen.getByLabelText('Unordered list');
    const orderedListBtn = screen.getByLabelText('Ordered list');
    const indentBtn = screen.getByLabelText('Indent');
    const outdentBtn = screen.getByLabelText('Outdent');

    bulletListBtn.click();

    expect(indentBtn).not.toBeDisabled();
    expect(outdentBtn).not.toBeDisabled();

    orderedListBtn.click();

    expect(indentBtn).not.toBeDisabled();
    expect(outdentBtn).not.toBeDisabled();

    editor.reset();
    expect(indentBtn).toBeDisabled();
    expect(outdentBtn).toBeDisabled();
  });

  it('should change tab mode when changing markdown tab mode', () => {
    editor.changePreviewStyle('tab');
    const writeTab = screen.getByLabelText('Write');
    const previewTab = screen.getByLabelText('Preview');

    previewTab.click();

    expect(writeTab).not.toHaveClass('active');
    expect(previewTab).toHaveClass('active');

    writeTab.click();

    expect(writeTab).toHaveClass('active');
    expect(previewTab).not.toHaveClass('active');
  });
});

describe('Custom toobar button', () => {
  let el: HTMLDivElement, editor: Editor;

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
      editor.eventEmitter.emit('command', 'heading', {
        level: Number((ev.target as HTMLSelectElement).value),
      });
      editor.eventEmitter.emit('closePopup');
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
    el = document.createElement('div');

    editor = new Editor({
      el,
      previewStyle: 'vertical',
      height: '400px',
      initialEditType: 'markdown',
      toolbarItems: [[customButton, customButtonWithPopup]],
    });

    document.body.appendChild(el);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(el);
  });

  it('should be rendered properly', () => {
    const customToolbar1 = screen.getByLabelText('B!');
    const customToolbar2 = screen.getByLabelText('L!');

    expect(customToolbar1).toHaveTextContent('B!');
    expect(customToolbar1).toHaveStyle({ color: '#222', width: '40px' });

    expect(customToolbar2).toHaveTextContent('L!');
    expect(customToolbar2).toHaveStyle({ color: '#fff', width: '30px' });
  });

  it('should show tooltip when mouseover on toolbar button', () => {
    fireMouseoverEvent(screen.getByLabelText('B!'));

    const tooltip = getElement(`.${cls('tooltip')}`);

    expect(tooltip).toHaveStyle({ display: 'block' });
    expect(tooltip).toHaveTextContent('B!');
  });

  it('should add text that matched command to document event when clicking button', () => {
    screen.getByLabelText('B!').click();

    expect(editor.getMarkdown()).toBe('****');
  });

  it('should show the popup when clicking button with popup option', () => {
    screen.getByLabelText('L!').click();

    const customPopup = getElement('.my-popup');

    expect(customPopup).toHaveStyle({ display: 'block', width: 'auto' });
    expect(customPopup).toHaveClass('my-popup');
  });

  it('should operate properly when event is triggered in popup', () => {
    screen.getByLabelText('L!').click();

    const customPopup = getElement('.my-popup');
    const select = customPopup.querySelector('select')!;

    select.value = '3';
    fireEvent(select, new Event('change'));

    expect(editor.getMarkdown()).toBe('### ');
  });
});

describe('API', () => {
  function getToolbarItems() {
    return getElement(`.${cls('defaultUI-toolbar')}`).querySelectorAll('button:not(.more)');
  }

  let el: HTMLDivElement, editor: Editor;

  beforeEach(() => {
    const toolbarItems = [['heading', 'bold', 'italic', 'strike']];

    el = document.createElement('div');

    editor = new Editor({
      el,
      previewStyle: 'vertical',
      height: '400px',
      initialEditType: 'markdown',
      toolbarItems,
    });

    document.body.appendChild(el);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(el);
  });

  it('should insert item on calling insertToolbarItem', () => {
    editor.insertToolbarItem({ groupIndex: 0, itemIndex: 1 }, 'ol');

    const toolbarItems = getToolbarItems();

    expect(toolbarItems[0]).toHaveClass('heading');
    expect(toolbarItems[1]).toHaveClass('ordered-list');
    expect(toolbarItems[2]).toHaveClass('bold');
    expect(toolbarItems[3]).toHaveClass('italic');
    expect(toolbarItems[4]).toHaveClass('strike');
    // should have same parent because the toolbar is added to same group
    expect(toolbarItems[1].parentElement).toEqual(toolbarItems[2].parentElement);
  });

  it('should add item on calling insertToolbarItem', () => {
    editor.insertToolbarItem({ groupIndex: 1, itemIndex: 1 }, 'ol');

    const toolbarItems = getToolbarItems();

    expect(toolbarItems[0]).toHaveClass('heading');
    expect(toolbarItems[1]).toHaveClass('bold');
    expect(toolbarItems[2]).toHaveClass('italic');
    expect(toolbarItems[3]).toHaveClass('strike');
    expect(toolbarItems[4]).toHaveClass('ordered-list');
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

    editor.insertToolbarItem({ groupIndex: 0, itemIndex: 1 }, customButton);

    const toolbarItems = getToolbarItems();

    expect(toolbarItems[0]).toHaveClass('heading');

    expect(toolbarItems[1]).toHaveClass('my-toolbar');
    expect(toolbarItems[1]).toHaveTextContent('B!');
    expect(toolbarItems[1]).toHaveStyle({ color: '#222', width: '40px' });

    expect(toolbarItems[2]).toHaveClass('bold');
    expect(toolbarItems[3]).toHaveClass('italic');
    expect(toolbarItems[4]).toHaveClass('strike');
  });

  it('should remove item on calling removeToolbarItem', () => {
    editor.removeToolbarItem('bold');

    expect(screen.queryByLabelText('Bold')).toBeNull();
  });
});

describe('Event', () => {
  let el: HTMLDivElement, editor: Editor;

  beforeEach(() => {
    el = document.createElement('div');

    editor = new Editor({
      el,
      previewStyle: 'vertical',
      height: '400px',
      initialEditType: 'markdown',
    });

    document.body.appendChild(el);
  });

  afterEach(() => {
    editor.destroy();
    document.body.removeChild(el);
  });

  describe('openPopup, closePopup', () => {
    it('should open and close popup corresponding to name', () => {
      editor.eventEmitter.emit('openPopup', 'image');

      const imagePopup = getElement(`.${cls('popup-add-image')}`);

      expect(imagePopup).toHaveStyle({ display: 'block' });

      editor.eventEmitter.emit('closePopup');

      expect(imagePopup).toHaveStyle({ display: 'none' });
    });

    it('should render popup with initial values', () => {
      const initialValues = { linkUrl: 'http://test.com', linkText: 'foo' };

      editor.eventEmitter.emit('openPopup', 'link', initialValues);

      const urlText = screen.getByText('URL').nextElementSibling as HTMLInputElement;
      const linkText = screen.getByText('Link text').nextElementSibling as HTMLInputElement;

      expect(urlText).toHaveValue('http://test.com');
      expect(linkText).toHaveValue('foo');
    });
  });
});
