/**
 * @fileoverview Implements wysiwyg task manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

var FIND_TASK_SPACES_RX = /^[\s\u200B]+/;

/**
 * WwTaskManager
 * @exports WwTaskManager
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwTaskManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

WwTaskManager.prototype.name = 'task';

/**
 * _init
 * Init
 */
WwTaskManager.prototype._init = function() {
    this._initKeyHandler();
    this._initEvent();
};

/**
 * _initEvent
 * Initialize eventmanager event
 */
WwTaskManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygRangeChangeAfter', function() {
        self._removeTaskInputInWrongPlace();
        self._unformatIncompleteTask();
        self._ensureSpaceNextToTaskInput();
    });

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._ensureSpaceNextToTaskInput();
        self._removeTaskListClass();
    });

    this.eventManager.listen('wysiwygGetValueBefore', function() {
        self._addCheckedAttrToCheckedInput();
    });

    this.eventManager.listen('wysiwygProcessHTMLText', function(html) {
        //we need remove task input space that made for safari
        return html.replace(/<input type="checkbox">(\s|&nbsp;)/g, '<input type="checkbox">');
    });
};

/**
 * _initKeyHandler
 * Initialize key event handler
 */
WwTaskManager.prototype._initKeyHandler = function() {
    var self = this;

    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
        if (self.wwe.getEditor().hasFormat('LI')) {
            //we need unformat task then let Squire control list and make task again
            //빈 태스크의 경우 input과 태스크상태를 지우고 리스트만 남기고 스콰이어가 리스트를 컨트롤한다
            //if문에 task가 아닌 li인지를 체크하는것은
            //현 뎊스가 일반리스트이고 이전뎊스가 태스크인 경우 엔터시 비정상 태스크로 남는것을 방지하기 위함
            self._unformatTaskIfNeedOnEnter(range);
            setTimeout(function() {
                self._formatTaskIfNeed();
            }, 0);

            return false;
        }
    });

    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range) {
        if (range.collapsed) {
            if (self._isInTaskList(range)) {
                self._unformatTaskIfNeedOnBackspace(range);
                //and delete list by squire
                return false;
            }
        }
    });

    this.wwe.addKeyEventHandler('TAB', function(ev, range) {
        if (range.collapsed) {
            if (self.wwe.getEditor().hasFormat('LI')) {
                ev.preventDefault();
                self.eventManager.emit('command', 'IncreaseDepth');
                return false;
            }
        }
    });

    this.wwe.addKeyEventHandler('SHIFT+TAB', function(ev, range) {
        var isNeedNext;

        if (range.collapsed) {
            if (self._isEmptyTask(range)) {
                self.wwe.getEditor().recordUndoState(range);
                self.unformatTask(range.startContainer);
                setTimeout(function() {
                    self._formatTaskIfNeed();
                }, 0);

                isNeedNext = false;
            } else if (self.wwe.getEditor().hasFormat('LI')) {
                self.wwe.getEditor().recordUndoState(range);
                setTimeout(function() {
                    self._formatTaskIfNeed();
                }, 0);
                isNeedNext = false;
            }
        }

        return isNeedNext;
    });
};

/**
 * _isInTaskList
 * Check whether passed range is in task list or not
 * @param {Range} range range
 * @returns {boolean} result
 */
WwTaskManager.prototype._isInTaskList = function(range) {
    var li;

    if (!range) {
        range = this.wwe.getEditor().getSelection().cloneRange();
    }

    if (range.startContainer.nodeType === Node.ELEMENT_NODE
        && range.startContainer.tagName === 'LI') {
            li = range.startContainer;
    } else {
        li = $(range.startContainer).parents('li')[0];
    }

    return $(li).hasClass('task-list-item');
};

/**
 * _unformatIncompleteTask
 * Unformat incomplete task
 */
WwTaskManager.prototype._unformatIncompleteTask = function() {
    this.wwe.get$Body().find('.task-list-item').each(function(index, task) {
        if ((!domUtils.isElemNode(task.firstChild) || task.firstChild.tagName !== 'INPUT')
            && (!domUtils.isElemNode(task.firstChild.firstChild) || task.firstChild.firstChild.tagName !== 'INPUT')
        ) {
            $(task).removeClass('task-list-item');
        }
    });
};

/**
 * _removeTaskInputInWrongPlace
 * Remove task input in wrong place while user editing
 */
WwTaskManager.prototype._removeTaskInputInWrongPlace = function() {
    var self = this;

    this._addCheckedAttrToCheckedInput();

    this.wwe.get$Body()
        .find('input:checkbox')
        .each(function(index, node) {
            var isInsideTask, isCorrectPlace, parent;

            isInsideTask = ($(node).parents('li').length > 1 || $(node).parents('li').hasClass('task-list-item'));
            isCorrectPlace = !node.previousSibling;

            if (!isInsideTask || !isCorrectPlace) {
                parent = $(node).parent();
                $(node).remove();
                self.wwe.replaceContentText(parent, FIND_TASK_SPACES_RX, '');
            }
        });
};

/**
 * _unformatTaskIfNeedOnEnter
 * Unformat task if need on enter
 * @param {Range} range range
 */
WwTaskManager.prototype._unformatTaskIfNeedOnEnter = function(range) {
    var $li;

    $li = $(range.startContainer).closest('li');

    if (this._isEmptyTask(range)) {
        this.unformatTask(range.startContainer);
        $li.html('<div><br></div>');
    }
};

WwTaskManager.prototype._isEmptyTask = function(range) {
    return this._isInTaskList(range) && this._isEmptyContainer(range.startContainer);
};

WwTaskManager.prototype._isEmptyContainer = function(node) {
    return node.textContent.replace(FIND_TASK_SPACES_RX, '') === '';
};

/**
 * _unformatTaskIfNeedOnBackspace
 * Unformat task if need on backspace
 * @param {Range} range range
 */
WwTaskManager.prototype._unformatTaskIfNeedOnBackspace = function(range) {
    var startContainer, startOffset,
        prevEl, needRemove;

    startContainer = range.startContainer;
    startOffset = range.startOffset;

    //스타트 컨테이너가 엘리먼트인경우 엘리먼트 offset을 기준으로 다음 지워질것이 input인지 판단한다
    //유저가 임의로 Task빈칸에 수정을 가했을경우
    if (domUtils.isElemNode(startContainer)) {
        //태스크리스트의 제일 첫 오프셋인경우(인풋박스 바로 위)
        if (startOffset === 0) {
            prevEl = domUtils.getChildNodeByOffset(startContainer, startOffset);
        //inputbox 오른편 어딘가에서 지워지는경우
        } else {
            prevEl = domUtils.getChildNodeByOffset(startContainer, startOffset - 1);

            //지워질위치가 인풋스페이스 텍스트 영역으로 의심되는경우 그다음 엘리먼드로 prevEl을 지정해준다.(그다음이 input이면 지워지도록)
            if (domUtils.isTextNode(prevEl) && prevEl.nodeValue.length === 1
                && FIND_TASK_SPACES_RX.test(prevEl.nodeValue)) {
                prevEl = domUtils.getChildNodeByOffset(startContainer, startOffset - 2);
            }
        }

        needRemove = (domUtils.getNodeName(prevEl) === 'INPUT');
    //텍스트 노드인경우
    } else if (domUtils.isTextNode(startContainer)) {
        //previousSibling이 있다면 그건 div바로 아래의 텍스트 노드임 아닌경우가생기면 버그
        //있고 그게 input이라면 offset체크
        if (startContainer.previousSibling) {
            prevEl = startContainer.previousSibling;
        //previsousSibling이 없는 경우, 인라인태그로 감싸져있는경우다
        } else {
            prevEl = startContainer.parentNode.previousSibling;
        }

        //inputbox 이후의 텍스트노드에서 빈칸한개가 지워지는경우 같이 지운다
        //(input과 빈칸한개는 같이 지워지는게 옳다고판단)
        if (prevEl.tagName === 'INPUT' && startOffset === 1 && FIND_TASK_SPACES_RX.test(startContainer.nodeValue)) {
            startContainer.nodeValue = startContainer.nodeValue.replace(FIND_TASK_SPACES_RX, '');
            needRemove = true;
        }
    }

    if (needRemove) {
        this.wwe.saveSelection(range);

        $(prevEl).closest('li').removeClass('task-list-item');
        $(prevEl).remove();

        this.wwe.restoreSavedSelection();
    }
};

/**
 * _addCheckedAttrToCheckedInput
 * Add checked attr to checked input
 */
WwTaskManager.prototype._addCheckedAttrToCheckedInput = function() {
    var doc = this.wwe.getEditor().getDocument();

    //save input checked state to tag
    $(doc.body).find('input').each(function(index, input) {
        if (input.checked) {
            $(input).attr('checked', 'checked');
        } else {
            $(input).removeAttr('checked');
        }
    });
};

/**
 * _removeTaskListClass
 * Remove tasklist class
 */
WwTaskManager.prototype._removeTaskListClass = function() {
    //because task-list class is block merge normal list and task list
    this.wwe.get$Body().find('.task-list').each(function(index, node) {
        $(node).removeClass('task-list');
    });
};


/**
 * findTextNodeFilter
 * @this Node
 * @returns {boolean} true or not
 */
function findTextNodeFilter() {
    return this.nodeType === Node.TEXT_NODE;
}

/**
 * _ensureSpaceNextToTaskInput
 * Ensure space next to task input
 * this because we need some space after input for safari cursor issue
 */
WwTaskManager.prototype._ensureSpaceNextToTaskInput = function() {
    var firstTextNode, $wrapper,
        self = this;

    this.wwe.get$Body().find('.task-list-item').each(function(i, node) {
        $wrapper = $(node).find('div');

        if (!$wrapper.length) {
            $wrapper = $(node);
        }

        firstTextNode = $wrapper.contents().filter(findTextNodeFilter)[0];

        if (!firstTextNode || !(firstTextNode.nodeValue.match(FIND_TASK_SPACES_RX))) {
            $(self.wwe.getEditor().getDocument().createTextNode(' ')).insertAfter($wrapper.find('input'));
        }
    });
};

/**
 * unformatTask
 * Unforamt task
 * @param {Node} node target
 */
WwTaskManager.prototype.unformatTask = function unformatTask(node) {
    var $li, firstTextNode, $wrapper;

    $li = $(node).closest('li');

    $wrapper = $li.find('div');

    if (!$wrapper.length) {
        $wrapper = $li;
    }

    $wrapper.find('input:checkbox').remove();

    $li.removeClass('task-list-item');

    if (!$li.attr('class')) {
        $li.removeAttr('class');
    }

    firstTextNode = $wrapper.contents().filter(findTextNodeFilter)[0];

    if (firstTextNode && firstTextNode.nodeValue.match(FIND_TASK_SPACES_RX)) {
        firstTextNode.nodeValue = firstTextNode.nodeValue.replace(FIND_TASK_SPACES_RX, '');
    }
};

/**
 * formatTask
 * Format task
 * @param {Node} node target
 */
WwTaskManager.prototype.formatTask = function(node) {
    var range, $selected, $li, hasInput, $block, sq;

    sq = this.wwe.getEditor();
    $selected = $(node);
    $li = $selected.closest('li');

    hasInput = $li.children('input:checkbox').length || $li.children('div').eq(0).children('input:checkbox').length;

    $li.addClass('task-list-item');

    if (!hasInput) {
        $block = $selected.closest('div').eq(0);

        if (!$block.length) {
            $block = $li.eq(0);
        }

        range = sq.getSelection().cloneRange();

        range.setStart($block[0], 0);
        range.collapse(true);

        sq.insertElement(sq.createElement('INPUT', {
            type: 'checkbox'
        }), range);

        range.setStart($block[0], 1);

        //we need some space for safari
        sq.insertElement(sq.getDocument().createTextNode(' '), range);
    }
};

/**
 * _formatTaskIfNeed
 * Format task if current range has task class name
 */
WwTaskManager.prototype._formatTaskIfNeed = function() {
    var range = this.wwe.getEditor().getSelection().cloneRange();

    if (this._isInTaskList(range)) {
        range = this.wwe.insertSelectionMarker(range);
        this.formatTask(range.startContainer);
        this.wwe.restoreSelectionMarker();
    }
};

module.exports = WwTaskManager;
