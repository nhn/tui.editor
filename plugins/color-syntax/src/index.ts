/**
 * @fileoverview Implements color syntax plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import ColorPicker from 'tui-color-picker';

import type { Context } from '@toast-ui/toastmark';
import type { Emitter, PluginInfo, MdLikeNode } from '@toast-ui/editor';
import { PluginOptions } from './types/index';

import './css/plugin.css';

function createApplyButton(text: string) {
  const button = document.createElement('button');

  button.setAttribute('type', 'button');
  button.className = 'tui-editor-ok-button';
  button.textContent = text;

  return button;
}

function createToolbarItemOption(colorPickerContainer: HTMLDivElement) {
  return {
    name: 'color',
    tooltip: 'Text color',
    className: 'tui-editor-toolbar-icons color',
    popup: {
      className: 'tui-popup-color',
      body: colorPickerContainer,
      style: { width: 'auto' },
    },
  };
}

interface ColorPickerOption {
  container: HTMLDivElement;
  preset?: Array<string>;
  usageStatistics: boolean;
}

// @TODO: add custom syntax for plugin
/**
 * Color syntax plugin
 * @param {Object} emitter - event emitter for communicating with editor
 * @param {Object} options - options for plugin
 * @param {Array.<string>} [options.preset] - preset for color palette (ex: ['#181818', '#292929'])
 * @param {boolean} [options.useCustomSyntax=false] - whether use custom syntax or not
 */
export default function colorSyntaxPlugin(
  emitter: Emitter,
  options = {} as PluginOptions
): PluginInfo {
  const { preset, i18n, usageStatistics = true } = options;
  const container = document.createElement('div');
  const colorPickerOption: ColorPickerOption = { container, usageStatistics };

  if (preset) {
    colorPickerOption.preset = preset;
  }

  const colorPicker = ColorPicker.create(colorPickerOption);
  const button = createApplyButton(i18n.get('OK'));

  button.addEventListener('click', () => {
    const selectedColor = colorPicker.getColor();

    emitter.emit('command', { command: 'color' }, { selectedColor });
    emitter.emit('closePopup');
  });

  colorPicker.slider.toggle(true);
  container.appendChild(button);

  const toolbarItem = createToolbarItemOption(container);

  return {
    markdownCommands: {
      color: ({ selectedColor } = {}) => ({ tr, selection, schema }, dispatch) => {
        if (selectedColor) {
          const slice = selection.content();
          const textContent = slice.content.textBetween(0, slice.content.size, '\n');
          const colored = `<span style="color: ${selectedColor}">${textContent}</span>`;

          tr.replaceSelectionWith(schema.text(colored));

          dispatch!(tr);

          return true;
        }
        return false;
      },
    },
    wysiwygCommands: {
      color: ({ selectedColor } = {}) => ({ tr, selection, schema }, dispatch) => {
        if (selectedColor) {
          const slice = selection.content();
          const textContent = slice.content.textBetween(0, slice.content.size, '\n');
          const attrs = { htmlAttrs: { style: `color: ${selectedColor}` } };
          const node = schema.nodes.span.create(attrs, schema.text(textContent));

          tr.replaceSelectionWith(node);

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
        // @ts-expect-error
        span(node: MdLikeNode, { entering }: Context) {
          return entering
            ? { type: 'openTag', tagName: 'span', attributes: node.attrs }
            : { type: 'closeTag', tagName: 'span' };
        },
      },
    },
  };
}
