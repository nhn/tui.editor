import { Emitter } from '@t/event';
import { ExecCommand } from '@t/ui';
import i18n from '@/i18n/i18n';
import { closest } from '@/utils/dom';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';

interface Props {
  eventEmitter: Emitter;
  execCommand: ExecCommand;
}

export class HeadingLayerBody extends Component<Props> {
  execCommand(ev: MouseEvent) {
    const el = closest<HTMLElement>(ev.target as HTMLElement, 'li')!;

    this.props.execCommand('heading', {
      level: Number(el.getAttribute('data-value'))
    });
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
