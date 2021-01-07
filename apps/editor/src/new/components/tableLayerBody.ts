import i18n from '@/i18n/i18n';
import { Emitter } from '@t/event';
import { Component } from '@t/ui';
import { closest } from '@/utils/dom';
import html from '../vdom/template';

interface Props {
  eventEmitter: Emitter;
}

const CLASS_TABLE_SELECTION = 'te-table-selection';
const CLASS_TABLE_HEADER = 'te-table-header';
const CLASS_TABLE_BODY = 'te-table-body';
const CLASS_SELECTION_AREA = 'te-selection-area';
const CLASS_DESCRIPTION = 'te-description';

export class TableLayerBody implements Component {
  props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  execCommand(ev: MouseEvent) {
    const { eventEmitter, hideLayer } = this.props;
    const el = closest<HTMLElement>(ev.target as HTMLElement, 'li')!;

    eventEmitter.emit(
      'command',
      { type: 'markdown', command: 'heading' },
      {
        level: Number(el.getAttribute('data-value'))
      }
    );
    hideLayer();
  }

  render() {
    return html`
      <div>
        <div class="${CLASS_TABLE_SELECTION}">
          <div class="${CLASS_TABLE_HEADER}"></div>
          <div class="${CLASS_TABLE_BODY}"></div>
          <div class="${CLASS_SELECTION_AREA}"></div>
        </div>
        <p class="${CLASS_DESCRIPTION}"></p>
      </div>
    `;
  }
}
