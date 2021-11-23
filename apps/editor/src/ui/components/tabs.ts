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
      <div class="${cls('tabs')}" aria-role="tabpanel">
        ${this.props.tabs.map(({ name, text }) => {
          const isActive = this.props.activeTab === name;

          return html`
            <div
              class="tab-item${isActive ? ' active' : ''}"
              onClick=${(ev: MouseEvent) => this.toggleTab(ev, name)}
              aria-role="tab"
              aria-label="${i18n.get(text)}"
              aria-selected="${isActive ? 'true' : 'false'}"
              tabindex="${isActive ? '0' : '-1'}"
            >
              ${i18n.get(text)}
            </div>
          `;
        })}
      </div>
    `;
  }
}
