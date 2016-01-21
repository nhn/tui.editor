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
 * @augments
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwTaskManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

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

    this.wwe.addKeyEventHandler(function(event, range, keyMap) {
        var isHandled;

        //enter
        if (event.keyCode === 13) {
            if (self._isInTaskList(range)) {
                //we need remove empty task then Squire control list
                //빈 태스크의 경우 input과 태스크상태를 지우고 리스트만 남기고 스콰이어가 리스트를 컨트롤한다
                self._unformatTaskIfNeedOnEnter(range);

                setTimeout(function() {
                    if (self._isInTaskList()) {
                        self.eventManager.emit('command', 'Task');
                    }
                }, 0);

                isHandled = true;
            }
        //backspace
        } else if (event.keyCode === 8) {
            if (range.collapsed) {
                if (self._isInTaskList(range)) {
                    self._unformatTaskIfNeedOnBackspace(range);
                    //and delete list by squire
                    isHandled = true;
                }
            }
        } else if (keyMap === 'TAB') {
            if (range.collapsed && self._isInTaskList(range)) {
                event.preventDefault();
                self.eventManager.emit('command', 'IncreaseTask');
                isHandled = true;
            }
        } else if (keyMap === 'SHIFT+TAB') {
            if (range.collapsed && self._isInTaskList(range)) {
                event.preventDefault();
                self.wwe.getEditor().recordUndoState(range);
                self.wwe.getEditor().decreaseListLevel();
                self.eventManager.emit('command', 'Task');
                isHandled = true;
            }
        }

        return isHandled;
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
    var $selected, $li, $inputs,
        isEmptyTask;

    $selected = $(range.startContainer);
    $li = $selected.closest('li');
    $inputs = $li.find('input:checkbox');
    isEmptyTask = ($li.text().replace(FIND_TASK_SPACES_RX, '') === '');

    if ($li.length && $inputs.length && isEmptyTask) {
        $inputs.remove();
        $li.removeClass('task-list-item');
        $li.html('<div><br></div>');
    }
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
            prevEl = domUtils.getChildNodeAt(startContainer, startOffset);
        //inputbox 오른편 어딘가에서 지워지는경우
        } else {
            prevEl = domUtils.getChildNodeAt(startContainer, startOffset - 1);

            //지워질위치가 인풋스페이스 텍스트 영역으로 의심되는경우 그다음 엘리먼드로 prevEl을 지정해준다.(그다음이 input이면 지워지도록)
            if (domUtils.isTextNode(prevEl) && prevEl.nodeValue.length === 1 && FIND_TASK_SPACES_RX.test(prevEl.nodeValue)) {
                prevEl = domUtils.getChildNodeAt(startContainer, startOffset - 2);
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
 * _ensureSpaceNextToTaskInput
 * Ensure space next to task input
 * this because we need some space after input for safari cursor issue
 */
WwTaskManager.prototype.______ensureSpaceNextToTaskInput = function() {
    var findTextNodeFilter, firstTextNode, $wrapper,
        self = this;

    findTextNodeFilter = function() {
        return this.nodeType === 3;
    };

    this.wwe.get$Body().find('.task-list-item').each(function(i, node) {
        $wrapper = $(node).find('div');

        if (!$wrapper.length) {
            $wrapper = $(node);
        }

        firstTextNode = $wrapper.contents().filter(findTextNodeFilter)[0];

        if (!firstTextNode) {
            firstTextNode = self.wwe.getEditor().getDocument().createTextNode(' ');
            $(firstTextNode).insertAfter($wrapper.find('input'));
        } else if (!(firstTextNode.nodeValue.match(FIND_TASK_SPACES_RX))) {
            firstTextNode.nodeValue = ' ' + firstTextNode.nodeValue;
        }
    });
};

WwTaskManager.prototype._ensureSpaceNextToTaskInput = function() {
    var findTextNodeFilter, firstTextNode, $wrapper,
        self = this;

    findTextNodeFilter = function() {
        return this.nodeType === 3;
    };

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
module.exports = WwTaskManager;
