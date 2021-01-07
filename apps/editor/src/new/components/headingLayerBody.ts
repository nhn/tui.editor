import i18n from '@/i18n/i18n';
import { Emitter } from '@t/event';
import { Component } from '@t/ui';
import { closest } from '@/utils/dom';
import html from '../vdom/template';

interface Props {
  eventEmitter: Emitter;
}

export class HeadingLayerBody implements Component {
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
      <ul onClick=${(ev: MouseEvent) => this.execCommand(ev)}>
        <li data-value="1" data-type="Heading"><h1>${i18n.get('Heading')} 1</h1></li>
        <li data-value="2" data-type="Heading"><h2>${i18n.get('Heading')} 2</h2></li>
        <li data-value="3" data-type="Heading"><h3>${i18n.get('Heading')} 3</h3></li>
        <li data-value="4" data-type="Heading"><h4>${i18n.get('Heading')} 4</h4></li>
        <li data-value="5" data-type="Heading"><h5>${i18n.get('Heading')} 5</h5></li>
        <li data-value="6" data-type="Heading"><h6>${i18n.get('Heading')} 6</h6></li>
        <li data-type="Paragraph"><div>${i18n.get('Paragraph')}</div></li>
      </ul>
    `;
  }
}
