import {
  LanguageSelectBox,
  WRAPPER_CLASS_NAME,
  INPUT_CLASS_NANE,
  LIST_CLASS_NAME,
} from '@/nodeViews/languageSelectBox';
import { cls } from '@/utils/dom';
import type { Emitter } from '@toast-ui/editor';

Element.prototype.scrollIntoView = jest.fn();

describe('languageSelectBox', () => {
  let selectBox: LanguageSelectBox,
    eventEmitter: Emitter,
    wrapper: HTMLElement,
    input: HTMLInputElement,
    list: HTMLElement,
    wwContainer: HTMLElement;

  beforeEach(() => {
    eventEmitter = {
      emit: jest.fn(),
      emitReduce: jest.fn(),
      listen: jest.fn(),
      removeEventHandler: jest.fn(),
      addEventType: jest.fn(),
      getEvents: jest.fn(),
      holdEventInvoke: jest.fn(),
    };

    wwContainer = document.createElement('div');
    wwContainer.className = 'toastui-editor ww-mode';
    document.body.appendChild(wwContainer);

    selectBox = new LanguageSelectBox(document.body, eventEmitter, ['js', 'css', 'ts']);

    wrapper = document.body.querySelector(`.${cls(WRAPPER_CLASS_NAME)}`)!;
    input = document.body.querySelector(`.${cls(INPUT_CLASS_NANE)} > input`)!;
    list = document.body.querySelector(`.${cls(LIST_CLASS_NAME)}`)!;
  });

  afterEach(() => {
    selectBox.destroy();
    document.body.removeChild(wwContainer);
  });

  it('should create language select box element', () => {
    expect(wrapper).toHaveClass(`${cls(WRAPPER_CLASS_NAME)}`);
  });

  it('show() should show language select box element', () => {
    selectBox.show();

    expect(wrapper).not.toHaveStyle('display: none');
  });

  it('hide() should hide language select box element', () => {
    selectBox.show();
    selectBox.hide();

    expect(wrapper).toHaveStyle('display: none');
  });

  it('destory() should remove element on body', () => {
    selectBox.destroy();

    expect(wwContainer).toBeEmptyDOMElement();
    expect(eventEmitter.removeEventHandler).toHaveBeenCalled();
  });

  it('setLanguage() should change input value to selected language', () => {
    selectBox.setLanguage('foo');

    expect(input).toHaveValue('foo');
  });

  describe('wrapper element', () => {
    it('should change to active state when input is focused', () => {
      input.focus();

      expect(wrapper).toHaveClass('active');
    });

    it('should change to inactive state when input is focused out', () => {
      input.focus();
      input.blur();

      expect(wrapper).not.toHaveClass('active');
    });
  });

  describe('language list element', () => {
    it('should show when input is focused', () => {
      input.focus();

      expect(list).toHaveStyle('display: block');
    });

    it('should hide when input is focused out', () => {
      input.focus();
      input.blur();

      expect(list).toHaveStyle('display: none');
    });
  });
});
