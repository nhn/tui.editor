/**
 * @fileoverview Implements wysiwyg task manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var TASK_CLASS_NAME = 'task-list-item';
var TASK_ATTR_NAME = 'data-te-task';
var TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * WwTaskManager
 * @exports WwTaskManager
 * @class WwTaskManager
 * @constructor
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwTaskManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

/**
 * Name property
 * @api
 * @memberOf WwTaskManager
 * @type {string}
 */
WwTaskManager.prototype.name = 'task';

/**
 * _init
 * Init
 * @memberOf WwTaskManager
 * @private
 */
WwTaskManager.prototype._init = function() {
    this._initKeyHandler();
    this._initEvent();

    this.wwe.getEditor().addEventListener('click', function(ev) {
        if (ev.target.hasAttribute(TASK_ATTR_NAME)) {
            $(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
        }
    });
};

/**
 * _initEvent
 * Initialize event
 * @memberOf WwTaskManager
 * @private
 */
WwTaskManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._removeTaskListClass();
    });
};

/**
 * _initKeyHandler
 * Initialize key event handler
 * @memberOf WwTaskManager
 * @private
 */
WwTaskManager.prototype._initKeyHandler = function() {
    var self = this;

    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
        if (self.isInTaskList(range)) {
            self.wwe.defer(function() {
                var newRange = self.wwe.getRange();
                var $li = $(newRange.startContainer).closest('li');
                $li.removeClass(TASK_CHECKED_CLASS_NAME);
            });
        }
    });
};

/**
 * isInTaskList
 * Check whether passed range is in task list or not
 * @param {Range} range range
 * @returns {boolean} result
 * @memberOf WwTaskManager
 * @api
 */
WwTaskManager.prototype.isInTaskList = function(range) {
    var li;

    if (!range) {
        range = this.wwe.getEditor().getSelection().cloneRange();
    }

    if (range.startContainer.nodeType === Node.ELEMENT_NODE
        && range.startContainer.tagName === 'LI'
    ) {
        li = range.startContainer;
    } else {
        li = $(range.startContainer).parents('li')[0];
    }

    return $(li).hasClass(TASK_CLASS_NAME);
};

/**
 * unformatTask
 * Unforamt task
 * @param {Node} node target
 * @memberOf WwTaskManager
 * @api
 */
WwTaskManager.prototype.unformatTask = function unformatTask(node) {
    var $li;

    $li = $(node).closest('li');

    $li.removeClass(TASK_CLASS_NAME);
    $li.removeClass(TASK_CHECKED_CLASS_NAME);

    $li.removeAttr(TASK_ATTR_NAME);

    if (!$li.attr('class')) {
        $li.removeAttr('class');
    }
};

/**
 * formatTask
 * Format task
 * @param {Node} node target
 * @memberOf WwTaskManager
 * @api
 */
WwTaskManager.prototype.formatTask = function(node) {
    var $selected, $li;

    $selected = $(node);
    $li = $selected.closest('li');
    $li.addClass(TASK_CLASS_NAME);
    $li.attr(TASK_ATTR_NAME, '');
};

/**
 * _formatTaskIfNeed
 * Format task if current range has task class name
 * @memberOf WwTaskManager
 * @private
 */
WwTaskManager.prototype._formatTaskIfNeed = function() {
    var range = this.wwe.getEditor().getSelection().cloneRange();

    if (this.isInTaskList(range)) {
        this.formatTask(range.startContainer);
    }
};

/**
 * _removeTaskListClass
 * Remove tasklist class
 * @memberOf WwTaskManager
 * @private
 */
WwTaskManager.prototype._removeTaskListClass = function() {
    //because task-list class is block merge normal list and task list
    this.wwe.get$Body().find('.task-list').each(function(index, node) {
        $(node).removeClass('task-list');
    });
};

module.exports = WwTaskManager;
