import { Emitter } from '@t/event';
import { ExecCommand } from '@t/ui';
import { closest } from '@/utils/dom';
import i18n from '@/i18n/i18n';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';

interface Props {
  eventEmitter: Emitter;
  execCommand: ExecCommand;
}

export class HeadingPopupBody extends Component<Props> {
  execCommand(ev: MouseEvent) {
    const el = closest(ev.target as HTMLElement, 'li')! as HTMLElement;

    this.props.execCommand('heading', {
      level: Number(el.getAttribute('data-level')),
    });
  }

  render() {
    return html`
      <ul
        onClick=${(ev: MouseEvent) => this.execCommand(ev)}
        aria-role="menu"
        aria-label="${i18n.get('Headings')}"
      >
        ${[1, 2, 3, 4, 5, 6].map(
          (level) =>
            html`
              <li data-level="${level}" data-type="Heading" aria-role="menuitem">
                <${`h${level}`}>${i18n.get('Heading')} ${level}</$>
              </li>
            `
        )}
        <li data-type="Paragraph" aria-role="menuitem">
          <div>${i18n.get('Paragraph')}</div>
        </li>
      </ul>
    `;
  }
}
