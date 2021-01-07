import { Layout } from '@/new/components/layout';
import { render } from '@/new/renderer';
import { VNode } from '@/new/vdom/vnode';
import html from '@/new/vdom/template';
import EventEmitter from '@/event/eventEmitter';
import '@/i18n/en-us';

function getMdSwitch() {
  return document.querySelector<HTMLElement>('.te-mode-switch-section .markdown')!;
}

function getWwSwitch() {
  return document.querySelector<HTMLElement>('.te-mode-switch-section .wysiwyg')!;
}

function clickMdSwitch() {
  return getMdSwitch().click();
}

function clickWwSwitch() {
  return getWwSwitch().click();
}

function assertToContainElement(el: HTMLElement) {
  expect(document.body).toContainElement(el);
}

describe('layout component', () => {
  let em: EventEmitter, container: HTMLElement;

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
      wwEditor
    };

    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventEmitter();

    render(
      container,
      html`
        <${Layout} eventEmitter=${em} slots=${dummySlot} hideModeSwitch=${false} />
      ` as VNode
    );
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('render default ui properly', () => {
    assertToContainElement(document.querySelector<HTMLElement>('.tui-editor')!);
    assertToContainElement(document.querySelector<HTMLElement>('.te-md-container')!);
    assertToContainElement(document.querySelector<HTMLElement>('.te-md-container .te-editor')!);
    assertToContainElement(document.querySelector<HTMLElement>('.te-md-container .te-preview')!);
    assertToContainElement(document.querySelector<HTMLElement>('.te-ww-container')!);
    assertToContainElement(document.querySelector<HTMLElement>('.te-ww-container .te-editor')!);
    assertToContainElement(document.querySelector<HTMLElement>('.te-mode-switch-section')!);
  });

  it('show/hide editor', () => {
    const layout = document.querySelector('.tui-editor-defaultUI');

    em.emit('hide');

    expect(layout).toHaveClass('te-hide');

    em.emit('show');

    expect(layout).not.toHaveClass('te-hide');
  });

  it('should trigger changeModeByEvent when clicking the switch button', () => {
    const spy = jest.fn();

    em.listen('changeModeByEvent', spy);

    clickWwSwitch();

    expect(spy).toHaveBeenCalledWith('wysiwyg');

    clickMdSwitch();

    expect(spy).toHaveBeenCalledWith('markdown');
  });

  it('should switch the editor in layout when changeMode is triggered', () => {
    const editorArea = document.querySelector<HTMLElement>('.tui-editor')!;
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
  // @TODO: add toolbar ui test
});
