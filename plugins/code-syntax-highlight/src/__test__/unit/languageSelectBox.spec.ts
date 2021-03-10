import { oneLineTrim } from 'common-tags';
import {
  LanguageSelectBox,
  WRAPPER_CLASS_NAME,
  INPUT_CLASS_NANE,
  LIST_CLASS_NAME,
} from '@/nodeViews/languageSelectBox';
import { cls } from '@/utils/dom';

interface Emitter {
  emit: () => void;
  listen: () => void;
}

describe('languageSelectBox', () => {
  let selectBox: LanguageSelectBox,
    eventEmitter: Emitter,
    wrapper: HTMLElement,
    input: HTMLInputElement,
    list: HTMLElement;

  beforeEach(() => {
    eventEmitter = {
      emit: jest.fn(),
      listen: jest.fn(),
    };
    selectBox = new LanguageSelectBox(eventEmitter, ['js', 'css', 'ts']);

    wrapper = document.body.querySelector(`.${cls(WRAPPER_CLASS_NAME)}`)!;
    input = document.body.querySelector(`.${cls(INPUT_CLASS_NANE)} > input`)!;
    list = document.body.querySelector(`.${cls(LIST_CLASS_NAME)}`)!;
  });

  afterEach(() => {
    selectBox.destroy();
  });

  it('should create language select box element on body', () => {
    const expected = oneLineTrim`
      <div class="tui-editor-code-block-language" style="display: none;">
        <span class="tui-editor-code-block-language-input">
          <input type="text" maxlength="20">
        </span>
        <div class="tui-editor-code-block-language-list" style="display: none;">
          <div class="buttons">
            <button type="button" data-language="js" class="active">js</button>
            <button type="button" data-language="css">css</button>
            <button type="button" data-language="ts">ts</button>
          </div>
        </div>
      </div>
    `;

    expect(document.body.innerHTML).toBe(expected);
  });

  describe('method', () => {
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

      expect(document.body).toBeEmptyDOMElement();
    });

    it('setLanguage() should change input value to selected language', () => {
      selectBox.setLanguage('foo');

      expect(input).toHaveValue('foo');
    });
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

      expect(list).not.toHaveStyle('display: none');
    });

    it('should hide when input is focused out', () => {
      input.focus();
      input.blur();

      expect(list).toHaveStyle('display: none');
    });
  });
});
