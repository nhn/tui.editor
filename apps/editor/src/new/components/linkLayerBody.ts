import i18n from '@/i18n/i18n';
import { Emitter } from '@t/event';
import { Component } from '@t/ui';
import { closest } from '@/utils/dom';
import html from '../vdom/template';

interface Props {
  eventEmitter: Emitter;
}

export class LinkLayerBody implements Component {
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
        <label for="url">${i18n.get('URL')}</label>
        <input type="text" class="te-url-input" />
        <label for="linkText">${i18n.get('Link text')}</label>
        <input type="text" class="te-link-text-input" />
        <div class="te-button-section">
          <button type="button" class="te-ok-button">${i18n.get('OK')}</button>
          <button type="button" class="te-close-button">${i18n.get('Cancel')}</button>
        </div>
      </div>
    `;
  }
}
