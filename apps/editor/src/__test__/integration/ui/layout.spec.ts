import { Layout } from '@/ui/components/layout';
import { render } from '@/ui/vdom/renderer';
import { VNode } from '@/ui/vdom/vnode';
import html from '@/ui/vdom/template';
import EventEmitter from '@/event/eventEmitter';
import '@/i18n/en-us';

function getElement(selector: string) {
  return document.querySelector<HTMLElement>(selector)!;
}

function getEditor() {
  return getElement('.tui-editor')!;
}

function getMdEditor() {
  return getElement('.te-md-container .te-editor')!;
}

function getMdPreview() {
  return getElement('.te-md-container .te-preview')!;
}

function getWwEditor() {
  return getElement('.te-ww-container .te-editor')!;
}

function getMdSwitch() {
  return getElement('.te-mode-switch-section .markdown')!;
}

function getWwSwitch() {
  return getElement('.te-mode-switch-section .wysiwyg')!;
}

function clickMdSwitch() {
  return getMdSwitch().click();
}

function clickWwSwitch() {
  return getWwSwitch().click();
}

function getMdWriteTab() {
  return getElement('.te-markdown-tab-section button')!;
}

function getMdPreviewTab() {
  return document.querySelectorAll<HTMLElement>('.te-markdown-tab-section button')[1];
}

function getScrollSyncBtn() {
  return getElement('.tui-scroll-sync')!;
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

    mdEditor.className = 'te-editor';
    mdPreview.className = 'te-preview';
    wwEditor.className = 'te-editor';

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
    assertToContainElement(getEditor());
    assertToContainElement(getMdEditor());
    assertToContainElement(getMdPreview());
    assertToContainElement(getWwEditor());
    assertToContainElement(getMdSwitch());
    assertToContainElement(getWwSwitch());
  });

  it('show/hide editor', () => {
    const layout = getElement('.tui-editor-defaultUI');

    em.emit('hide');

    expect(layout).toHaveClass('te-hide');

    em.emit('show');

    expect(layout).not.toHaveClass('te-hide');
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
      const editorArea = getEditor();
      const mdSwitch = getMdSwitch();
      const wwSwitch = getWwSwitch();

      em.emit('changeMode', 'wysiwyg');

      expect(editorArea).toHaveClass('te-ww-mode');
      expect(wwSwitch).toHaveClass('active');
      expect(mdSwitch).not.toHaveClass('active');

      em.emit('changeMode', 'markdown');

      expect(editorArea).toHaveClass('te-md-mode');
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
      const tabSection = getElement('.te-markdown-tab-section')!;

      expect(tabSection).toHaveStyle({ display: 'block' });

      em.emit('changePreviewStyle', 'vertical');

      expect(tabSection).toHaveStyle({ display: 'none' });
    });

    it('should hide markdown tab when changeMode is triggered', () => {
      const tabSection = getElement('.te-markdown-tab-section')!;

      expect(tabSection).toHaveStyle({ display: 'block' });

      em.emit('changeMode', 'wysiwyg');

      expect(tabSection).toHaveStyle({ display: 'none' });
    });

    it('should display the markdown editor or preview by clicking markdown tab', () => {
      expect(getMdWriteTab()).toHaveClass('te-tab-active');
      expect(getMdPreviewTab()).not.toHaveClass('te-tab-active');

      clickMdPreviewTab();

      expect(getMdWriteTab()).not.toHaveClass('te-tab-active');
      expect(getMdPreviewTab()).toHaveClass('te-tab-active');
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
      expect(getElement('.tui-toolbar-icons')).toBeDisabled();

      clickMdWriteTab();

      expect(getScrollSyncBtn()).not.toBeDisabled();
      expect(getElement('.tui-toolbar-icons')).not.toBeDisabled();
    });

    it('should enable the toolbar items when changeMode is triggered', () => {
      clickMdPreviewTab();

      em.emit('changeMode', 'wysiwyg');

      expect(getElement('.tui-toolbar-icons')).not.toBeDisabled();

      em.emit('changeMode', 'markdown');

      expect(getElement('.tui-toolbar-icons')).not.toBeDisabled();
      expect(getMdWriteTab()).toHaveClass('te-tab-active');
    });

    it('should enable the toolbar items when changePreviewStyle is triggered', () => {
      clickMdPreviewTab();

      em.emit('changePreviewStyle', 'vertical');

      expect(getElement('.tui-toolbar-icons')).not.toBeDisabled();
    });
  });

  describe('context menu', () => {
    it('should be displayed when contextmenu event is triggered', () => {
      const contextMenu = getElement('.te-context-menu');

      expect(contextMenu).toHaveStyle({ display: 'none' });

      em.emit('contextmenu', { pos: { left: 10, top: 10 }, menuGroups: [[{ label: 'test' }]] });

      expect(contextMenu).toHaveStyle({ display: 'block' });
    });
  });
});
