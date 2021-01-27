import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import { Emitter } from '@t/event';
import { ExecCommand, HidePopup } from '@t/ui';
import i18n from '@/i18n/i18n';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';

interface Props {
  eventEmitter: Emitter;
  execCommand: ExecCommand;
  hidePopup: HidePopup;
  show: boolean;
}

export class LinkPopupBody extends Component<Props> {
  private initialize() {
    const linkUrl = this.refs.url as HTMLInputElement;
    const linkText = this.refs.text as HTMLInputElement;

    removeClass(linkUrl, 'wrong');
    removeClass(linkText, 'wrong');

    linkUrl.value = '';
    linkText.value = '';
  }

  private execCommand = () => {
    const linkUrl = this.refs.url as HTMLInputElement;
    const linkText = this.refs.text as HTMLInputElement;

    removeClass(linkUrl, 'wrong');
    removeClass(linkText, 'wrong');

    if (linkUrl.value.length < 1) {
      addClass(linkUrl, 'wrong');
      return;
    }
    if (linkText.value.length < 1) {
      addClass(linkText, 'wrong');
      return;
    }

    this.props.execCommand('addLink', {
      linkUrl: linkUrl.value,
      linkText: linkText.value,
    });
  };

  updated() {
    if (!this.props.show) {
      this.initialize();
    }
  }

  render() {
    return html`
      <div>
        <label for="te-link-url-input">${i18n.get('URL')}</label>
        <input
          id="te-link-url-input"
          type="text"
          class="te-url-input"
          ref=${(el: HTMLInputElement) => (this.refs.url = el)}
        />
        <label for="te-link-text-input">${i18n.get('Link text')}</label>
        <input
          id="te-link-text-input"
          type="text"
          class="te-link-text-input"
          ref=${(el: HTMLInputElement) => (this.refs.text = el)}
        />
        <div class="te-button-section">
          <button type="button" class="te-ok-button" onClick=${this.execCommand}>
            ${i18n.get('OK')}
          </button>
          <button type="button" class="te-close-button" onClick=${this.props.hidePopup}>
            ${i18n.get('Cancel')}
          </button>
        </div>
      </div>
    `;
  }
}
