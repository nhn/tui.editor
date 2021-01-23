import { Editor } from '@t/editor';
import { DefaultUI, VNode } from '@t/ui';
import html from './vdom/template';
import { render } from './vdom/renderer';
import { Layout } from './components/layout';

export function renderDefaultUI(editor: Editor) {
  let defaultUI!: DefaultUI;
  const destroy = render(
    editor.options.el,
    html`
      <${Layout}
        ref=${(layout: DefaultUI) => (defaultUI = layout)}
        eventEmitter=${editor.eventEmitter}
        slots=${editor.getEditorElements()}
        hideModeSwitch=${editor.options.hideModeSwitch}
        toolbarItems=${editor.options.toolbarItems}
        previewStyle=${editor.options.previewStyle}
        editorType=${editor.options.initialEditType}
      />
    ` as VNode
  );

  const module = {
    insertToolbarItem: defaultUI.insertToolbarItem.bind(defaultUI),
    removeToolbarItem: defaultUI.removeToolbarItem.bind(defaultUI),
    destroy,
  };

  editor.setDefaultUI(module);
}
