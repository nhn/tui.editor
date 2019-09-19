/**
 * @fileoverview Implements wysiwyg task manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import domUtils from './domUtils';

const TASK_CLASS_NAME = 'task-list-item';
const TASK_ATTR_NAME = 'data-te-task';
const TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class WwTaskManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */
class WwTaskManager {
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'task';

    this._init();
  }

  /**
   * Init
   * @private
   */
  _init() {
    this._initKeyHandler();
    this._initEvent();

    this.wwe.getEditor().addEventListener('mousedown', ev => {
      const style = getComputedStyle(ev.target, ':before');

      if (ev.target.hasAttribute(TASK_ATTR_NAME) && domUtils.isInsideTaskBox(style, ev.offsetX, ev.offsetY)) {
        // Prevent cursor focusing
        ev.preventDefault();
        $(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
      }
    });
  }

  /**
   * Initialize event
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygSetValueAfter', () => {
      this._removeTaskListClass();
    });
  }

  /**
   * Initialize key event handler
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
   * Check whether passed range is in task list or not
   * @param {Range} range range
   * @returns {boolean} result
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
   * Unforamt task
   * @param {Node} node target
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
   * Format task
   * @param {Node} node target
   */
  formatTask(node) {
    const $selected = $(node);
    const $li = $selected.closest('li');

    $li.addClass(TASK_CLASS_NAME);
    $li.attr(TASK_ATTR_NAME, '');
  }

  /**
   * Format task if current range has task class name
   * @private
   */
  _formatTaskIfNeed() {
    const range = this.wwe.getEditor().getSelection().cloneRange();

    if (this.isInTaskList(range)) {
      this.formatTask(range.startContainer);
    }
  }

  /**
   * Remove tasklist class
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
