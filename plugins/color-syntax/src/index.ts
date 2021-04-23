import ColorPicker from 'tui-color-picker';

import type { Context } from '@toast-ui/toastmark';
import type { PluginContext, PluginInfo, MdLikeNode } from '@toast-ui/editor';
import { PluginOptions } from './types/index';

import './css/plugin.css';

const PREFIX = 'toastui-editor-';

function createApplyButton(text: string) {
  const button = document.createElement('button');

  button.setAttribute('type', 'button');
  button.textContent = text;

  return button;
}

function createToolbarItemOption(colorPickerContainer: HTMLDivElement) {
  return {
    name: 'color',
    tooltip: 'Text color',
    className: `${PREFIX}toolbar-icons color`,
    popup: {
      className: `${PREFIX}popup-color`,
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
 * @param {Object} context - plugin context for communicating with editor
 * @param {Object} options - options for plugin
 * @param {Array.<string>} [options.preset] - preset for color palette (ex: ['#181818', '#292929'])
 * @param {boolean} [options.useCustomSyntax=false] - whether use custom syntax or not
 */
export default function colorSyntaxPlugin(
  context: PluginContext,
  options: PluginOptions = {}
): PluginInfo {
  const { eventEmitter, i18n, usageStatistics = true } = context;
  const { preset } = options;
  const container = document.createElement('div');
  const colorPickerOption: ColorPickerOption = { container, usageStatistics };

  if (preset) {
    colorPickerOption.preset = preset;
  }

  const colorPicker = ColorPicker.create(colorPickerOption);
  const button = createApplyButton(i18n.get('OK'));

  button.addEventListener('click', () => {
    const selectedColor = colorPicker.getColor();

    eventEmitter.emit('command', 'color', { selectedColor });
    eventEmitter.emit('closePopup');
  });

  colorPicker.slider.toggle(true);
  container.appendChild(button);

  const toolbarItem = createToolbarItemOption(container);

  return {
    markdownCommands: {
      color: ({ selectedColor }, { tr, selection, schema }, dispatch) => {
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
      color: ({ selectedColor }, { tr, selection, schema }, dispatch) => {
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
