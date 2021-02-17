import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import isUndefined from 'tui-code-snippet/type/isUndefined';

import { Emitter } from '@t/event';
import { ExecCommand, HidePopup, PopupInitialValues } from '@t/ui';
import i18n from '@/i18n/i18n';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';

interface Props {
  eventEmitter: Emitter;
  execCommand: ExecCommand;
  hidePopup: HidePopup;
  show: boolean;
  initialValues: PopupInitialValues;
}

export class LinkPopupBody extends Component<Props> {
  private initialize() {
    const { linkUrl, linkText } = this.props.initialValues;

    const linkUrlEl = this.refs.url as HTMLInputElement;
    const linkTextEl = this.refs.text as HTMLInputElement;

    removeClass(linkUrlEl, 'wrong');
    removeClass(linkTextEl, 'wrong', 'disabled');
    linkTextEl.removeAttribute('disabled');

    if (linkUrl) {
      addClass(linkTextEl, 'disabled');
      linkTextEl.setAttribute('disabled', 'disabled');
    }

    linkUrlEl.value = linkUrl || '';
    linkTextEl.value = linkText || '';
  }

  private execCommand = () => {
    const linkUrlEl = this.refs.url as HTMLInputElement;
    const linkTextEl = this.refs.text as HTMLInputElement;

    removeClass(linkTextEl, 'wrong');
    removeClass(linkTextEl, 'wrong');

    if (linkUrlEl.value.length < 1) {
      addClass(linkUrlEl, 'wrong');
      return;
    }

    const checkLinkText = isUndefined(this.props.initialValues.linkUrl);

    if (checkLinkText && linkTextEl.value.length < 1) {
      addClass(linkTextEl, 'wrong');
      return;
    }

    this.props.execCommand('addLink', {
      linkUrl: linkUrlEl.value,
      linkText: linkTextEl.value,
    });
  };

  mounted() {
    this.initialize();
  }

  updated(prevProps: Props) {
    if (!prevProps.show && this.props.show) {
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
