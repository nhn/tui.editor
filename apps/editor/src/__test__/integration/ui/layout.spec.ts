import { Layout } from '@/ui/components/layout';
import { render } from '@/ui/vdom/renderer';
import { VNode } from '@/ui/vdom/vnode';
import html from '@/ui/vdom/template';
import EventEmitter from '@/event/eventEmitter';
import '@/i18n/en-us';

function getElement(selector: string) {
  return document.querySelector<HTMLElement>(selector)!;
}

function getElements(selector: string) {
  return document.querySelectorAll<HTMLElement>(selector)!;
}

function getEditorMain() {
  return getElement('.toastui-editor-main')!;
}

function getMdEditor() {
  return getElement('.toastui-editor-md-container .toastui-editor')!;
}

function getMdPreview() {
  return getElement('.toastui-editor-md-container .toastui-editor-md-preview')!;
}

function getWwEditor() {
  return getElement('.toastui-editor-ww-container .toastui-editor')!;
}

function getMdSwitch() {
  return getElements('.toastui-editor-mode-switch button')![0];
}

function getWwSwitch() {
  return getElements('.toastui-editor-mode-switch button')![1];
}

function clickMdSwitch() {
  return getMdSwitch().click();
}

function clickWwSwitch() {
  return getWwSwitch().click();
}

function getMdWriteTab() {
  return getElement('.toastui-editor-md-tab-container button')!;
}

function getMdPreviewTab() {
  return document.querySelectorAll<HTMLElement>('.toastui-editor-md-tab-container button')[1];
}

function getScrollSyncBtn() {
  return getElement('.scroll-sync')!;
}

function clickMdWriteTab() {
  return getMdWriteTab().click();
}

function clickMdPreviewTab() {
  return getMdPreviewTab().click();
}

function assertToContainElement(el: HTMLElement) {
  expect(document.body).toContainElement(el);
}

describe('layout component', () => {
  let em: EventEmitter, container: HTMLElement, destroy: () => void;

  beforeEach(() => {
    const mdEditor = document.createElement('div');
    const mdPreview = document.createElement('div');
    const wwEditor = document.createElement('div');

    mdEditor.className = 'toastui-editor';
    mdPreview.className = 'toastui-editor-md-preview';
    wwEditor.className = 'toastui-editor';

    const dummySlot = {
      mdEditor,
      mdPreview,
      wwEditor,
    };

    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventEmitter();

    destroy = render(
      container,
      html`
        <${Layout}
          eventEmitter=${em}
          slots=${dummySlot}
          hideModeSwitch=${false}
          toolbarItems=${[['bold', 'italic', 'strike'], ['scrollSync']]}
          previewStyle="tab"
          editorType="markdown"
        />
      ` as VNode
    );
  });

  afterEach(() => {
    destroy();
  });

  it('render default ui properly', () => {
    assertToContainElement(getEditorMain());
    assertToContainElement(getMdEditor());
    assertToContainElement(getMdPreview());
    assertToContainElement(getWwEditor());
    assertToContainElement(getMdSwitch());
    assertToContainElement(getWwSwitch());
  });

  it('show/hide editor', () => {
    const layout = getElement('.toastui-editor-defaultUI');

    em.emit('hide');

    expect(layout).toHaveClass('hidden');

    em.emit('show');

    expect(layout).not.toHaveClass('hidden');
  });

  describe('changing editor mode', () => {
    it('should trigger needChangeMode when clicking the switch button', () => {
      const spy = jest.fn();

      em.listen('needChangeMode', spy);

      clickWwSwitch();

      expect(spy).toHaveBeenCalledWith('wysiwyg');

      clickMdSwitch();

      expect(spy).toHaveBeenCalledWith('markdown');
    });

    it('should switch the editor in layout when changeMode is triggered', () => {
      const editorArea = getEditorMain();
      const mdSwitch = getMdSwitch();
      const wwSwitch = getWwSwitch();

      em.emit('changeMode', 'wysiwyg');

      expect(editorArea).toHaveClass('toastui-editor-ww-mode');
      expect(wwSwitch).toHaveClass('active');
      expect(mdSwitch).not.toHaveClass('active');

      em.emit('changeMode', 'markdown');

      expect(editorArea).toHaveClass('toastui-editor-md-mode');
      expect(mdSwitch).toHaveClass('active');
      expect(wwSwitch).not.toHaveClass('active');
    });

    it('should hide scrollSync when previewStyle is tab regardless of changing editor mode', () => {
      const scrollSyncBtn = getScrollSyncBtn();

      expect(scrollSyncBtn).toHaveStyle({ display: 'none' });

      em.emit('changeMode', 'wysiwyg');

      expect(scrollSyncBtn).toHaveStyle({ display: 'none' });
    });

    it('should show scrollSync when previewStyle is vertical on only markdown mode', () => {
      em.emit('changePreviewStyle', 'vertical');
      const scrollSyncBtn = getScrollSyncBtn();

      expect(scrollSyncBtn).toHaveStyle({ display: 'inline-block' });

      em.emit('changeMode', 'wysiwyg');

      expect(scrollSyncBtn).toHaveStyle({ display: 'none' });
    });

    it('should show scrollSync when previewStyle is changed on only markdown mode', () => {
      em.emit('changeMode', 'wysiwyg');
      em.emit('changePreviewStyle', 'vertical');
      const scrollSyncBtn = getScrollSyncBtn();

      expect(scrollSyncBtn).toHaveStyle({ display: 'none' });

      em.emit('changeMode', 'markdown');

      expect(scrollSyncBtn).toHaveStyle({ display: 'inline-block' });
    });
  });

  describe('changing preview style', () => {
    it('should hide markdown tab when changePreviewStyle is triggered', () => {
      const tabSection = getElement('.toastui-editor-md-tab-container')!;

      expect(tabSection).toHaveStyle({ display: 'block' });

      em.emit('changePreviewStyle', 'vertical');

      expect(tabSection).toHaveStyle({ display: 'none' });
    });

    it('should hide markdown tab when changeMode is triggered', () => {
      const tabSection = getElement('.toastui-editor-md-tab-container')!;

      expect(tabSection).toHaveStyle({ display: 'block' });

      em.emit('changeMode', 'wysiwyg');

      expect(tabSection).toHaveStyle({ display: 'none' });
    });

    it('should display the markdown editor or preview by clicking markdown tab', () => {
      expect(getMdWriteTab()).toHaveClass('active');
      expect(getMdPreviewTab()).not.toHaveClass('active');

      clickMdPreviewTab();

      expect(getMdWriteTab()).not.toHaveClass('active');
      expect(getMdPreviewTab()).toHaveClass('active');
    });

    it('should emit changePreviewTabWrite, changePreviewTabPreview events by clicking markdown tab', () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      em.listen('changePreviewTabWrite', spy1);
      em.listen('changePreviewTabPreview', spy2);

      clickMdPreviewTab();

      expect(spy2).toHaveBeenCalledTimes(1);

      clickMdWriteTab();

      expect(spy1).toHaveBeenCalledTimes(1);
    });

    it('should enable/disable the toolbar items by clicking markdown tab', () => {
      clickMdPreviewTab();

      expect(getScrollSyncBtn()).toBeDisabled();
      expect(getElement('.toastui-editor-toolbar-icons')).toBeDisabled();

      clickMdWriteTab();

      expect(getScrollSyncBtn()).not.toBeDisabled();
      expect(getElement('.toastui-editor-toolbar-icons')).not.toBeDisabled();
    });

    it('should enable the toolbar items when changeMode is triggered', () => {
      clickMdPreviewTab();

      em.emit('changeMode', 'wysiwyg');

      expect(getElement('.toastui-editor-toolbar-icons')).not.toBeDisabled();

      em.emit('changeMode', 'markdown');

      expect(getElement('.toastui-editor-toolbar-icons')).not.toBeDisabled();
      expect(getMdWriteTab()).toHaveClass('active');
    });

    it('should enable the toolbar items when changePreviewStyle is triggered', () => {
      clickMdPreviewTab();

      em.emit('changePreviewStyle', 'vertical');

      expect(getElement('.toastui-editor-toolbar-icons')).not.toBeDisabled();
    });
  });

  describe('context menu', () => {
    it('should be displayed when contextmenu event is triggered', () => {
      const contextMenu = getElement('.toastui-editor-context-menu');

      expect(contextMenu).toHaveStyle({ display: 'none' });

      em.emit('contextmenu', { pos: { left: 10, top: 10 }, menuGroups: [[{ label: 'test' }]] });

      expect(contextMenu).toHaveStyle({ display: 'block' });
    });
  });
});
