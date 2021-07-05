import removeClass from 'tui-code-snippet/domUtil/removeClass';
import addClass from 'tui-code-snippet/domUtil/addClass';
import { HookCallback } from '@t/editor';
import { Emitter } from '@t/event';
import { ExecCommand, HidePopup, TabInfo } from '@t/ui';
import i18n from '@/i18n/i18n';
import { cls } from '@/utils/dom';
import { Component } from '@/ui/vdom/component';
import html from '@/ui/vdom/template';
import { Tabs } from '../tabs';

const TYPE_UI = 'ui';

type TabType = 'url' | 'file';

interface Props {
  show: boolean;
  eventEmitter: Emitter;
  execCommand: ExecCommand;
  hidePopup: HidePopup;
}

interface State {
  activeTab: TabType;
  file: File | null;
  fileNameElClassName: string;
}

export class ImagePopupBody extends Component<Props, State> {
  private tabs: TabInfo[];

  constructor(props: Props) {
    super(props);
    this.state = { activeTab: 'file', file: null, fileNameElClassName: '' };
    this.tabs = [
      { name: 'file', text: 'File' },
      { name: 'url', text: 'URL' },
    ];
  }

  private initialize = (activeTab: TabType = 'file') => {
    const urlEl = this.refs.url as HTMLInputElement;

    urlEl.value = '';
    (this.refs.altText as HTMLInputElement).value = '';
    (this.refs.file as HTMLInputElement).value = '';

    removeClass(urlEl, 'wrong');

    this.setState({ activeTab, file: null, fileNameElClassName: '' });
  };

  private emitAddImageBlob() {
    const { files } = this.refs.file as HTMLInputElement;
    const altTextEl = this.refs.altText as HTMLInputElement;
    let fileNameElClassName = ' wrong';

    if (files?.length) {
      fileNameElClassName = '';
      const imageFile = files.item(0)!;
      const hookCallback: HookCallback = (url, text) =>
        this.props.execCommand('addImage', { imageUrl: url, altText: text || altTextEl.value });

      this.props.eventEmitter.emit('addImageBlobHook', imageFile, hookCallback, TYPE_UI);
    }
    this.setState({ fileNameElClassName });
  }

  private emitAddImage() {
    const imageUrlEl = this.refs.url as HTMLInputElement;
    const altTextEl = this.refs.altText as HTMLInputElement;
    const imageUrl = imageUrlEl.value;
    const altText = altTextEl.value || 'image';

    removeClass(imageUrlEl, 'wrong');

    if (!imageUrl.length) {
      addClass(imageUrlEl, 'wrong');
      return;
    }

    if (imageUrl) {
      this.props.execCommand('addImage', { imageUrl, altText });
    }
  }

  private execCommand = () => {
    if (this.state.activeTab === 'file') {
      this.emitAddImageBlob();
    } else {
      this.emitAddImage();
    }
  };

  private toggleTab = (_: MouseEvent, activeTab: TabType) => {
    if (activeTab !== this.state.activeTab) {
      this.initialize(activeTab);
    }
  };

  private showFileSelectBox = () => {
    this.refs.file.click();
  };

  private changeFile = (ev: Event) => {
    const { files } = ev.target as HTMLInputElement;

    if (files?.length) {
      this.setState({ file: files[0] });
    }
  };

  private preventSelectStart(ev: Event) {
    ev.preventDefault();
  }

  updated() {
    if (!this.props.show) {
      this.initialize();
    }
  }

  render() {
    const { activeTab, file, fileNameElClassName } = this.state;

    return html`
      <div>
        <${Tabs} tabs=${this.tabs} activeTab=${activeTab} onClick=${this.toggleTab} />
        <div style="display:${activeTab === 'url' ? 'block' : 'none'}">
          <label for="toastuiImageUrlInput">${i18n.get('Image URL')}</label>
          <input
            id="toastuiImageUrlInput"
            type="text"
            ref=${(el: HTMLInputElement) => (this.refs.url = el)}
          />
        </div>
        <div style="display:${activeTab === 'file' ? 'block' : 'none'};position: relative;">
          <label for="toastuiImageFileInput">${i18n.get('Select image file')}</label>
          <span
            class="${cls('file-name')}${file ? ' has-file' : fileNameElClassName}"
            onClick=${this.showFileSelectBox}
            onSelectstart=${this.preventSelectStart}
          >
            ${file ? file.name : i18n.get('No file')}
          </span>
          <button
            type="button"
            class="${cls('file-select-button')}"
            onClick=${this.showFileSelectBox}
          >
            ${i18n.get('Choose a file')}
          </button>
          <input
            id="toastuiImageFileInput"
            type="file"
            accept="image/*"
            onChange=${this.changeFile}
            ref=${(el: HTMLInputElement) => (this.refs.file = el)}
          />
        </div>
        <label for="toastuiAltTextInput">${i18n.get('Description')}</label>
        <input
          id="toastuiAltTextInput"
          type="text"
          ref=${(el: HTMLInputElement) => (this.refs.altText = el)}
        />
        <div class="${cls('button-container')}">
          <button type="button" class="${cls('close-button')}" onClick=${this.props.hidePopup}>
            ${i18n.get('Cancel')}
          </button>
          <button type="button" class="${cls('ok-button')}" onClick=${this.execCommand}>
            ${i18n.get('OK')}
          </button>
        </div>
      </div>
    `;
  }
}
