import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import { Emitter } from '@t/event';
import { ExecCommand, HideLayer } from '@t/ui';
import i18n from '@/i18n/i18n';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';

interface Props {
  eventEmitter: Emitter;
  execCommand: ExecCommand;
  hideLayer: HideLayer;
  show: boolean;
}

export class LinkLayerBody extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.execCommand = this.execCommand.bind(this);
  }

  private initialize() {
    const linkUrl = this.refs.url;
    const linkText = this.refs.text;

    removeClass(linkUrl, 'wrong');
    removeClass(linkText, 'wrong');

    linkUrl.value = '';
    linkText.value = '';
  }

  private execCommand() {
    const linkUrl = this.refs.url;
    const linkText = this.refs.text;

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
      linkText: linkText.value
    });
  }

  updated() {
    if (!this.props.show) {
      this.initialize();
    }
  }

  render() {
    return html`
      <div>
        <label for="url">${i18n.get('URL')}</label>
        <input
          type="text"
          class="te-url-input"
          ref=${(el: HTMLInputElement) => (this.refs.url = el)}
        />
        <label for="linkText">${i18n.get('Link text')}</label>
        <input
          type="text"
          class="te-link-text-input"
          ref=${(el: HTMLInputElement) => (this.refs.text = el)}
        />
        <div class="te-button-section">
          <button type="button" class="te-ok-button" onClick=${this.execCommand}>
            ${i18n.get('OK')}
          </button>
          <button type="button" class="te-close-button" onClick=${this.props.hideLayer}>
            ${i18n.get('Cancel')}
          </button>
        </div>
      </div>
    `;
  }
}
