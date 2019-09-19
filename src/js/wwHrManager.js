/**
 * @fileoverview Implements wysiwyg hr manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import util from 'tui-code-snippet';
import domUtils from './domUtils';

/**
 * Class WwHrManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */
class WwHrManager {
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'hr';

    this._init();
  }

  /**
   * Initialize
   * @private
   */
  _init() {
    this._initEvent();
  }

  /**
   * Initialize eventmanager event
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygSetValueAfter', () => {
      this._insertEmptyLineIfNeed();
      this._changeHRForWysiwyg();
    });
  }

  /**
   * If <hr> is frist or last child of root, insert empty line before or after HR
   * @private
   */
  _insertEmptyLineIfNeed() {
    const editorContentBody = this.wwe.get$Body()[0];
    const {firstChild, lastChild} = editorContentBody;

    if (firstChild && firstChild.nodeName === 'HR') {
      editorContentBody.insertBefore(domUtils.createEmptyLine(), firstChild);
    } else if (lastChild && lastChild.nodeName === 'HR') {
      editorContentBody.appendChild(domUtils.createEmptyLine());
    }
  }

  /**
   * <hr> is set contenteditable to false with wrapping div like below.
   * <div contenteditable="false"><hr contenteditable="false"><div>
   * @private
   */
  _changeHRForWysiwyg() {
    const editorContentBody = this.wwe.get$Body()[0];
    const hrNodes = editorContentBody.querySelectorAll('hr');

    util.forEachArray(hrNodes, hrNode => {
      const {parentNode} = hrNode;

      parentNode.replaceChild(domUtils.createHorizontalRule(), hrNode);
    });
  }
}

export default WwHrManager;
