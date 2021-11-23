import { ExecCommand, HidePopup } from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/ui/vdom/template';
import { Component } from '@/ui/vdom/component';

interface Props {
  body: HTMLElement;
  show: boolean;
  eventEmitter: Emitter;
  execCommand: ExecCommand;
  hidePopup: HidePopup;
}

export class CustomPopupBody extends Component<Props> {
  mounted() {
    // append the custom popup body element
    this.refs.el.appendChild(this.props.body);
  }

  render() {
    return html`<div ref=${(el: HTMLElement) => (this.refs.el = el)}></div>`;
  }
}
