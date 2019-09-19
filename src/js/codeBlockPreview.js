/**
 * @fileoverview Implements CodeBlockPreview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Preview from './preview';

const EVENT_REQUIRE_SCROLL_SYNC = 'requireScrollSync';

/**
 * Class Code block preview
 * @param {jQuery} $el - base element
 * @param {EventManager} eventManager - event manager
 * @param {Convertor} convertor - convertor
 * @param {CodeBlockEditor} codeBlockEditor - code block editor
 * @ignore
 */
class CodeBlockPreview extends Preview {
  constructor($el, eventManager, convertor, codeBlockEditor) {
    super($el, eventManager, convertor, true);

    this._codeBlockEditor = codeBlockEditor;

    this._initEvent();
  }

  _initEvent() {
    this._codeBlockEditor.on('update', () => this.lazyRunner.run('refresh'));
  }

  /**
   * refresh preview
   * @override
   */
  refresh() {
    const language = this._codeBlockEditor.getLanguage();
    const codeText = this._codeBlockEditor.getEditorCodeText();

    super.refresh(`\`\`\`${language}\n${codeText}\n\`\`\``);
    this.$el.trigger(EVENT_REQUIRE_SCROLL_SYNC);
  }

  /**
   * clear preview
   */
  clear() {
    super.render('');
  }
}

export default CodeBlockPreview;
