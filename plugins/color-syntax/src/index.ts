import ColorPicker from 'tui-color-picker';
import type { Context } from '@toast-ui/toastmark';
import type { PluginContext, PluginInfo, HTMLMdNode, I18n } from '@toast-ui/editor';
import type { Transaction, Selection, TextSelection } from 'prosemirror-state';
import { PluginOptions } from '@t/index';
import { addLangs } from './i18n/langs';

import './css/plugin.css';
import { findParentByClassName } from './utils/dom';

const PREFIX = 'toastui-editor-';

function createApplyButton(text: string) {
  const button = document.createElement('button');

  button.setAttribute('type', 'button');
  button.textContent = text;

  return button;
}

function createToolbarItemOption(colorPickerContainer: HTMLDivElement, i18n: I18n) {
  return {
    name: 'color',
    tooltip: i18n.get('Text color'),
    className: `${PREFIX}toolbar-icons color`,
    popup: {
      className: `${PREFIX}popup-color`,
      body: colorPickerContainer,
      style: { width: 'auto' },
    },
  };
}

function createSelection(
  tr: Transaction,
  selection: Selection,
  SelectionClass: typeof TextSelection,
  openTag: string,
  closeTag: string
) {
  const { mapping, doc } = tr;
  const { from, to, empty } = selection;
  const mappedFrom = mapping.map(from) + openTag.length;
  const mappedTo = mapping.map(to) - closeTag.length;

  return empty
    ? SelectionClass.create(doc, mappedTo, mappedTo)
    : SelectionClass.create(doc, mappedFrom, mappedTo);
}

function getCurrentEditorEl(colorPickerEl: HTMLElement, containerClassName: string) {
  const editorDefaultEl = findParentByClassName(colorPickerEl, `${PREFIX}defaultUI`)!;

  return editorDefaultEl.querySelector<HTMLElement>(`.${containerClassName} .ProseMirror`)!;
}

interface ColorPickerOption {
  container: HTMLDivElement;
  preset?: Array<string>;
  usageStatistics: boolean;
}

let containerClassName: string;
let currentEditorEl: HTMLElement;

// @TODO: add custom syntax for plugin
/**
 * Color syntax plugin
 * @param {Object} context - plugin context for communicating with editor
 * @param {Object} options - options for plugin
 * @param {Array.<string>} [options.preset] - preset for color palette (ex: ['#181818', '#292929'])
 * @param {boolean} [options.useCustomSyntax=false] - whether use custom syntax or not
 */
export default function colorSyntaxPlugin(
  context: PluginContext,
  options: PluginOptions = {}
): PluginInfo {
  const { eventEmitter, i18n, usageStatistics = true, pmState } = context;
  const { preset } = options;
  const container = document.createElement('div');
  const colorPickerOption: ColorPickerOption = { container, usageStatistics };

  addLangs(i18n);

  if (preset) {
    colorPickerOption.preset = preset;
  }

  const colorPicker = ColorPicker.create(colorPickerOption);
  const button = createApplyButton(i18n.get('OK'));

  eventEmitter.listen('focus', (editType) => {
    containerClassName = `${PREFIX}${editType === 'markdown' ? 'md' : 'ww'}-container`;
  });

  container.addEventListener('click', (ev) => {
    if ((ev.target as HTMLElement).getAttribute('type') === 'button') {
      const selectedColor = colorPicker.getColor();

      currentEditorEl = getCurrentEditorEl(container, containerClassName);

      eventEmitter.emit('command', 'color', { selectedColor });
      eventEmitter.emit('closePopup');
      // force the current editor to focus for preventing to lose focus
      currentEditorEl.focus();
    }
  });

  colorPicker.slider.toggle(true);
  container.appendChild(button);

  const toolbarItem = createToolbarItemOption(container, i18n);

  return {
    markdownCommands: {
      color: ({ selectedColor }, { tr, selection, schema }, dispatch) => {
        if (selectedColor) {
          const slice = selection.content();
          const textContent = slice.content.textBetween(0, slice.content.size, '\n');
          const openTag = `<span style="color: ${selectedColor}">`;
          const closeTag = `</span>`;
          const colored = `${openTag}${textContent}${closeTag}`;

          tr.replaceSelectionWith(schema.text(colored)).setSelection(
            createSelection(tr, selection, pmState.TextSelection, openTag, closeTag)
          );

          dispatch!(tr);

          return true;
        }
        return false;
      },
    },
    wysiwygCommands: {
      color: ({ selectedColor }, { tr, selection, schema }, dispatch) => {
        if (selectedColor) {
          const { from, to } = selection;
          const attrs = { htmlAttrs: { style: `color: ${selectedColor}` } };
          const mark = schema.marks.span.create(attrs);

          tr.addMark(from, to, mark);
          dispatch!(tr);

          return true;
        }
        return false;
      },
    },
    toolbarItems: [
      {
        groupIndex: 0,
        itemIndex: 3,
        item: toolbarItem,
      },
    ],
    toHTMLRenderers: {
      htmlInline: {
        span(node: HTMLMdNode, { entering }: Context) {
          return entering
            ? { type: 'openTag', tagName: 'span', attributes: node.attrs! }
            : { type: 'closeTag', tagName: 'span' };
        },
      },
    },
  };
}
