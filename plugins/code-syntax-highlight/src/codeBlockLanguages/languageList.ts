import inArray from 'tui-code-snippet/array/inArray';
import toArray from 'tui-code-snippet/collection/toArray';
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import { Emitter } from '@t/event';

interface Callbacks {
  selected: () => void;
  dismissed: () => void;
}

const WRAPPER_CLASS_NAME = 'tui-editor-code-block-language-list';
const BUTTONS_CONTAINER_CLASS_NAME = 'buttons';

function getButtonsHTML(languages: string[]) {
  return languages
    .map((language) => `<button type="button" data-language="${language}">${language}</button>`)
    .join('');
}

export default class LanguageList {
  private eventEmitter: Emitter;

  private languages: string[];

  private wrapper: HTMLElement | null = null;

  private buttons: HTMLButtonElement[] = [];

  private currentButton: HTMLButtonElement | null = null;

  private onSelected: { (language: string): void } | null = null;

  private onDismissed: { (): void } | null = null;

  constructor(eventEmitter: Emitter, languages: string[]) {
    this.eventEmitter = eventEmitter;
    this.languages = languages;

    this.createElement();
    this.bindDOMEvent();
    this.bindEvent();
  }

  private createElement() {
    const wrapper = document.createElement('div');
    const buttonsContainer = document.createElement('div');

    buttonsContainer.innerHTML = getButtonsHTML(this.languages);
    buttonsContainer.className = BUTTONS_CONTAINER_CLASS_NAME;

    wrapper.className = WRAPPER_CLASS_NAME;
    wrapper.appendChild(buttonsContainer);

    this.wrapper = wrapper;

    this.createButtons();
  }

  private createButtons() {
    this.buttons = toArray(this.wrapper!.firstElementChild!.children) as HTMLButtonElement[];

    this.activateButtonByIndex(0);
  }

  private bindDOMEvent() {
    this.wrapper!.addEventListener('mousedown', this.handleMousedown);
  }

  private bindEvent() {
    this.eventEmitter.listen('openPopupCodeBlockLanguages', ({ callbacks, offset, language }) => {
      this.show(callbacks);

      css(this.wrapper!, {
        top: `${offset.top}px`,
        left: `${offset.left}px`,
      });

      this.setCurrentLanguage(language);

      return this;
    });

    this.eventEmitter.listen('closePopupCodeBlockLanguages', () => {
      this.hide();
    });
  }

  private handleMousedown = (ev: MouseEvent) => {
    const language = (ev.target as HTMLElement).getAttribute('data-language');

    if (this.onSelected) {
      this.onSelected(language!);
    }

    this.hide();
  };

  private activateButtonByIndex(index: number) {
    if (this.currentButton) {
      removeClass(this.currentButton, 'active');
    }

    if (this.buttons.length) {
      this.currentButton = this.buttons[index];
      addClass(this.currentButton, 'active');
      this.currentButton.scrollIntoView();
    }
  }

  getElement() {
    return this.wrapper;
  }

  prev() {
    let index = inArray(this.currentButton, this.buttons) - 1;

    if (index < 0) {
      index = this.buttons.length - 1;
    }

    this.activateButtonByIndex(index);
  }

  next() {
    let index = inArray(this.currentButton, this.buttons) + 1;

    if (index >= this.buttons.length) {
      index = 0;
    }

    this.activateButtonByIndex(index);
  }

  show({ selected, dismissed }: Callbacks) {
    this.onSelected = selected;
    this.onDismissed = dismissed;
    css(this.wrapper!, { display: 'inline-block' });
  }

  hide() {
    if (this.onDismissed) {
      this.onDismissed();
    }
    this.onSelected = null;
    this.onDismissed = null;
    css(this.wrapper!, { display: 'none' });
  }

  changeLanguageButtons(languages: string[]) {
    this.languages = languages;

    if (languages && this.languages.length) {
      this.wrapper!.innerHTML = getButtonsHTML(this.languages);
    }
  }

  setCurrentLanguage(language: string) {
    const item = this.buttons.filter((button) => button.getAttribute('data-language') === language);

    if (item.length > 0) {
      const index = inArray(item[0], this.buttons);

      this.activateButtonByIndex(index);
    }
  }

  getCurrentLanguage() {
    const language = this.currentButton!.getAttribute('data-language');

    return language;
  }
}
