import { ExecCommand, HideLayer } from '@t/ui';
import { Emitter } from '@t/event';
import html from '@/new/vdom/template';
import { Component } from '@/new/vdom/component';

interface Props {
  layerBody: HTMLElement;
  show: boolean;
  eventEmitter: Emitter;
  execCommand: ExecCommand;
  hideLayer: HideLayer;
}

export class CustomLayer extends Component<Props> {
  constructor(props: Props) {
    super(props);
    props.eventEmitter.listen('closeLayer', this.props.hideLayer);
  }

  mounted() {
    // append the custom layer body element
    this.refs.el.appendChild(this.props.layerBody);
  }

  render() {
    return html`<div ref=${(el: HTMLElement) => (this.refs.el = el)}></div>`;
  }
}
