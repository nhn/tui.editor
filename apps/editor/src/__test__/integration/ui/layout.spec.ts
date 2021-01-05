import { Layout } from '@/new/components/layout';
import { render } from '@/new/renderer';
import { VNode } from '@/new/vdom/vnode';
import html from '@/new/vdom/template';
import EventEmitter from '@/event/eventEmitter';
import '@/i18n/en-us';

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
    expect(document.body).toContainElement(document.querySelector('.tui-editor'));
    expect(document.body).toContainElement(document.querySelector('.te-md-container'));
    expect(document.body).toContainElement(document.querySelector('.te-md-container .te-editor'));
    expect(document.body).toContainElement(document.querySelector('.te-md-container .te-preview'));
    expect(document.body).toContainElement(document.querySelector('.te-ww-container'));
    expect(document.body).toContainElement(document.querySelector('.te-ww-container .te-editor'));
    expect(document.body).toContainElement(document.querySelector('.te-mode-switch-section'));
  });

  it('show/hide editor', () => {
    const layout = document.querySelector('.tui-editor-defaultUI');

    em.emit('hide');

    expect(layout).toHaveClass('te-hide');

    em.emit('show');

    expect(layout).not.toHaveClass('te-hide');
  });

  it('changeModeByEvent is triggered when clicking the switch button', () => {
    const spy = jest.fn();

    em.listen('changeModeByEvent', spy);

    const mdSwitch = document.querySelector<HTMLElement>('.te-mode-switch-section .markdown')!;
    const wwSwitch = document.querySelector<HTMLElement>('.te-mode-switch-section .wysiwyg')!;

    wwSwitch.click();

    expect(spy).toHaveBeenCalledWith('wysiwyg');

    mdSwitch.click();

    expect(spy).toHaveBeenCalledWith('markdown');
  });

  it('switch the editor in layout when changeMode is triggered', () => {
    const editorArea = document.querySelector<HTMLElement>('.tui-editor')!;
    const mdSwitch = document.querySelector<HTMLElement>('.te-mode-switch-section .markdown')!;
    const wwSwitch = document.querySelector<HTMLElement>('.te-mode-switch-section .wysiwyg')!;

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
