/**
 * @fileoverview Implements wysiwyg hr manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import util from 'tui-code-snippet';

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
      this._unwrapDivOnHr();
    });
  }

  /**
   * _unwrapDivOnHr
   * Unwrap default block on hr
   * @memberof WwHrManager
   * @private
   */
  _unwrapDivOnHr() {
    const editorContentBody = this.wwe.get$Body()[0];
    const hrNodes = editorContentBody.querySelectorAll('hr');
    util.forEachArray(hrNodes, hrNode => {
      const {parentNode} = hrNode;

      if (parentNode !== editorContentBody) {
        const {parentNode: parentOfparent} = parentNode;

        parentOfparent.removeChild(parentNode);
        parentOfparent.appendChild(hrNode);
      }

      while (hrNode.firstChild) {
        hrNode.removeChild(hrNode.firstChild);
      }

      hrNode.setAttribute('contenteditable', false);
    });
  }
}

export default WwHrManager;
