import { TabInfo } from '@t/ui';
import i18n from '@/i18n/i18n';
import { cls } from '@/utils/dom';
import html from '../vdom/template';
import { Component } from '../vdom/component';

interface Props {
  tabs: TabInfo[];
  activeTab: string;
  onClick: (ev: MouseEvent, activeTab: string) => void;
}

export class Tabs extends Component<Props> {
  private toggleTab(ev: MouseEvent, activeTab: string) {
    this.props.onClick(ev, activeTab);
  }

  render() {
    return html`
      <div class="${cls('tabs')}">
        ${this.props.tabs.map(
          ({ name, text }) => html`
            <div
              class="tab-item${this.props.activeTab === name ? ' active' : ''}"
              onClick=${(ev: MouseEvent) => this.toggleTab(ev, name)}
            >
              ${i18n.get(text)}
            </div>
          `
        )}
      </div>
    `;
  }
}
