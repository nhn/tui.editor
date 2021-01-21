import closest from 'tui-code-snippet/domUtil/closest';
import { Emitter } from '@t/event';
import { ExecCommand } from '@t/ui';
import i18n from '@/i18n/i18n';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';

interface Props {
  eventEmitter: Emitter;
  execCommand: ExecCommand;
}

export class HeadingLayerBody extends Component<Props> {
  execCommand(ev: MouseEvent) {
    const el = closest(ev.target as HTMLElement, 'li')!;

    this.props.execCommand('heading', {
      level: Number(el.getAttribute('data-level'))
    });
  }

  render() {
    return html`
      <ul onClick=${(ev: MouseEvent) => this.execCommand(ev)}>
        ${[1, 2, 3, 4, 5, 6].map(
          level =>
            html`
              <li data-level="${level}" data-type="Heading">
                <${`h${level}`}>${i18n.get('Heading')} ${level}</$>
              </li>
            `
        )}
        <li data-type="Paragraph"><div>${i18n.get('Paragraph')}</div></li>
      </ul>
    `;
  }
}
