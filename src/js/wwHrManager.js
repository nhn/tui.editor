/**
 * @fileoverview Implements wysiwyg hr manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import util from 'tui-code-snippet';
import domUtils from './domUtils';

/**
 * Class WwHrManager
 */
class WwHrManager {
  /**
   * Creates an instance of WwHrManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwHrManager
   */
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwHrManager#
     * @type {string}
     */
    this.name = 'hr';

    this._init();
  }

  /**
   * _init
   * Initialize
   * @memberof WwHrManager
   * @private
   */
  _init() {
    this._initEvent();
  }

  /**
   * _initEvent
   * Initialize eventmanager event
   * @memberof WwHrManager
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
   * @memberof WwHrManager
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
