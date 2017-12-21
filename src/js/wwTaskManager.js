/**
 * @fileoverview Implements wysiwyg task manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

const TASK_CLASS_NAME = 'task-list-item';
const TASK_ATTR_NAME = 'data-te-task';
const TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class WwTaskManager
 */
class WwTaskManager {
  /**
   * Creates an instance of WwTaskManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwTaskManager
   */
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwTaskManager#
     * @type {string}
     */
    this.name = 'task';

    this._init();
  }

  /**
   * _init
   * Init
   * @memberof WwTaskManager
   * @private
   */
  _init() {
    this._initKeyHandler();
    this._initEvent();

    this.wwe.getEditor().addEventListener('mousedown', ev => {
      const isOnTaskBox = ev.offsetX < 18 && ev.offsetY < 18;

      if (ev.target.hasAttribute(TASK_ATTR_NAME) && isOnTaskBox) {
        $(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
      }
    });
  }

  /**
   * _initEvent
   * Initialize event
   * @memberof WwTaskManager
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygSetValueAfter', () => {
      this._removeTaskListClass();
    });
  }

  /**
   * _initKeyHandler
   * Initialize key event handler
   * @memberof WwTaskManager
   * @private
   */
  _initKeyHandler() {
    this.wwe.addKeyEventHandler('ENTER', (ev, range) => {
      if (this.isInTaskList(range)) {
        this.wwe.defer(() => {
          const newRange = this.wwe.getRange();
          const $li = $(newRange.startContainer).closest('li');
          $li.removeClass(TASK_CHECKED_CLASS_NAME);
        });
      }
    });
  }

  /**
   * isInTaskList
   * Check whether passed range is in task list or not
   * @param {Range} range range
   * @returns {boolean} result
   * @memberof WwTaskManager
   */
  isInTaskList(range) {
    let li;

    if (!range) {
      range = this.wwe.getEditor().getSelection().cloneRange();
    }

    if (range.startContainer.nodeType === Node.ELEMENT_NODE
            && range.startContainer.tagName === 'LI'
    ) {
      li = range.startContainer;
    } else {
      li = $(range.startContainer).parents('li').get(0);
    }

    return $(li).hasClass(TASK_CLASS_NAME);
  }

  /**
   * unformatTask
   * Unforamt task
   * @param {Node} node target
   * @memberof WwTaskManager
   */
  unformatTask(node) {
    const $li = $(node).closest('li');

    $li.removeClass(TASK_CLASS_NAME);
    $li.removeClass(TASK_CHECKED_CLASS_NAME);

    $li.removeAttr(TASK_ATTR_NAME);

    if (!$li.attr('class')) {
      $li.removeAttr('class');
    }
  }

  /**
   * formatTask
   * Format task
   * @param {Node} node target
   * @memberof WwTaskManager
   */
  formatTask(node) {
    const $selected = $(node);
    const $li = $selected.closest('li');

    $li.addClass(TASK_CLASS_NAME);
    $li.attr(TASK_ATTR_NAME, '');
  }

  /**
   * _formatTaskIfNeed
   * Format task if current range has task class name
   * @memberof WwTaskManager
   * @private
   */
  _formatTaskIfNeed() {
    const range = this.wwe.getEditor().getSelection().cloneRange();

    if (this.isInTaskList(range)) {
      this.formatTask(range.startContainer);
    }
  }

  /**
   * _removeTaskListClass
   * Remove tasklist class
   * @memberof WwTaskManager
   * @private
   */
  _removeTaskListClass() {
    // because task-list class is block merge normal list and task list
    this.wwe.get$Body().find('.task-list').each((index, node) => {
      $(node).removeClass('task-list');
    });
  }
}

export default WwTaskManager;
