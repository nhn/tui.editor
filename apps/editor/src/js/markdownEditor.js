/**
 * @fileoverview Implements markdown editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import isBoolean from 'tui-code-snippet/type/isBoolean';

import CodeMirrorExt from './codeMirrorExt';
import KeyMapper from './keyMapper';
import MdListManager from './mdListManager';
import ComponentManager from './componentManager';
import MdTextObject from './mdTextObject';
import {
  traverseParentNodes,
  isStyledTextNode,
  getMdStartLine,
  getMdEndLine,
  getMdStartCh,
  getMdEndCh,
  addChPos,
  findClosestNode
} from './utils/markdown';
import { getMarkInfo } from './markTextHelper';

const keyMapper = KeyMapper.getSharedInstance();

const defaultToolbarState = {
  strong: false,
  emph: false,
  strike: false,
  thematicBreak: false,
  blockQuote: false,
  code: false,
  codeBlock: false,
  list: false,
  taskList: false,
  orderedList: false,
  heading: false,
  table: false
};

function getToolbarStateType({ type, listData }) {
  if (type === 'list' || type === 'item') {
    if (listData.task) {
      return 'taskList';
    }
    return listData.type === 'ordered' ? 'orderedList' : 'list';
  }
  if (type.indexOf('table') !== -1) {
    return 'table';
  }
  return type;
}

function getToolbarState(targetNode, ch, mdLine, mdCh) {
  const state = { ...defaultToolbarState };
  let listEnabled = false;

  traverseParentNodes(targetNode, mdNode => {
    const type = getToolbarStateType(mdNode);

    if (!isBoolean(state[type])) {
      return;
    }

    if (type === 'list' || type === 'orderedList') {
      if (!listEnabled) {
        state[type] = true;
        listEnabled = true;
      }
    } else {
      state[type] = true;
    }
  });

  // if position is matched to start, end position of inline node, highlighting is ignored
  if (
    isStyledTextNode(targetNode) &&
    ((mdCh === ch && getMdEndLine(targetNode) === mdLine) ||
      (mdCh === getMdEndCh(targetNode) + 1 && mdLine === getMdEndLine(targetNode)) ||
      (mdCh === getMdStartCh(targetNode) && mdLine === getMdStartLine(targetNode)))
  ) {
    state[targetNode.type] = false;
  }

  return state;
}

/**
 * Return whether state changed or not
 * @param {object} previousState - Previous state
 * @param {object} currentState - Current state
 * @returns {boolean} - changed state
 * @private
 */
function isToolbarStateChanged(previousState, currentState) {
  if (!previousState && !currentState) {
    return false;
  }

  if ((!previousState && currentState) || (previousState && !currentState)) {
    return true;
  }

  return Object.keys(currentState).some(type => previousState[type] !== currentState[type]);
}

const ATTR_NAME_MARK = 'data-tui-mark';
const TASK_MARKER_RX = /^\[(\s*)(x?)(\s*)\](?:\s+)/i;
const TASK_MARKER_KEY_RX = /x|backspace/i;

/**
 * Class MarkdownEditor
 * @param {HTMLElement} el - container element
 * @param {EventManager} eventManager - event manager
 * @param {Object} options - options of editor
 */
class MarkdownEditor extends CodeMirrorExt {
  constructor(el, eventManager, toastMark, options) {
    super(el, {
      dragDrop: true,
      allowDropFileTypes: ['image'],
      extraKeys: {
        Enter: 'newlineAndIndentContinueMarkdownList',
        Tab: 'indentOrderedList',
        'Shift-Tab': 'indentLessOrderedList',
        'Shift-Ctrl-X': () => this._toggleTaskStates()
      },
      viewportMargin: options && options.height === 'auto' ? Infinity : 10
    });
    this.eventManager = eventManager;
    this.componentManager = new ComponentManager(this);
    this.toastMark = toastMark;
    this.componentManager.addManager(MdListManager);

    /**
     * latest state info
     * @type {object}
     * @private
     */
    this._latestState = null;

    /**
     * map of marked lines
     * @type {Object.<number, boolean}
     * @private
     */
    this._markedLines = {};

    this._initEvent();
  }

  /**
   * _initEvent
   * Initialize EventManager event handler
   * @private
   */
  _initEvent() {
    this.cm.getWrapperElement().addEventListener('click', () => {
      this.eventManager.emit('click', {
        source: 'markdown'
      });
    });

    this.cm.on('beforeChange', (cm, ev) => {
      if (ev.origin === 'paste') {
        this.eventManager.emit('pasteBefore', {
          source: 'markdown',
          data: ev
        });
      }
    });

    this.cm.on('change', (cm, cmEvent) => {
      this._refreshCodeMirrorMarks(cmEvent);
      this._emitMarkdownEditorChangeEvent(cmEvent);
    });

    this.cm.on('focus', () => {
      this.eventManager.emit('focus', {
        source: 'markdown'
      });
    });

    this.cm.on('blur', () => {
      this.eventManager.emit('blur', {
        source: 'markdown'
      });
    });

    this.cm.on('scroll', (cm, eventData) => {
      this.eventManager.emit('scroll', {
        source: 'markdown',
        data: eventData
      });
    });

    this.cm.on('keydown', (cm, keyboardEvent) => {
      this.eventManager.emit('keydown', {
        source: 'markdown',
        data: keyboardEvent
      });

      this.eventManager.emit('keyMap', {
        source: 'markdown',
        keyMap: keyMapper.convert(keyboardEvent),
        data: keyboardEvent
      });
    });

    this.cm.on('keyup', (cm, keyboardEvent) => {
      this.eventManager.emit('keyup', {
        source: 'markdown',
        data: keyboardEvent
      });

      const { key } = keyboardEvent;

      if (TASK_MARKER_KEY_RX.test(key)) {
        this._changeTextToTaskMarker(keyboardEvent);
      }
    });

    this.cm.on('copy', (cm, ev) => {
      this.eventManager.emit('copy', {
        source: 'markdown',
        data: ev
      });
    });

    this.cm.on('cut', (cm, ev) => {
      this.eventManager.emit('cut', {
        source: 'markdown',
        data: ev
      });
    });

    this.cm.on('paste', (cm, clipboardEvent) => {
      this.eventManager.emit('paste', {
        source: 'markdown',
        data: clipboardEvent
      });
    });

    this.cm.on('drop', (cm, eventData) => {
      eventData.preventDefault();

      this.eventManager.emit('drop', {
        source: 'markdown',
        data: eventData
      });
    });

    this.cm.on('cursorActivity', () => this._onChangeCursorActivity());
  }

  /**
   * Set Editor value
   * @param {string} markdown - Markdown syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   * @override
   */
  setValue(markdown, cursorToEnd) {
    super.setValue(markdown, cursorToEnd);
  }

  /**
   * Get text object of current range
   * @param {{start, end}} range Range object of each editor
   * @returns {MdTextObject}
   */
  getTextObject(range) {
    return new MdTextObject(this, range);
  }

  /**
   * Emit contentChangedFromMarkdown event
   * @param {event} e - Event object
   * @private
   */
  _emitMarkdownEditorContentChangedEvent(eventObj) {
    this.eventManager.emit('contentChangedFromMarkdown', eventObj);
  }

  /**
   * Emit changeEvent
   * @param {event} e - Event object
   * @private
   */
  _emitMarkdownEditorChangeEvent(e) {
    if (e.origin !== 'setValue') {
      const eventObj = {
        source: 'markdown'
      };

      this.eventManager.emit('changeFromMarkdown', eventObj);
      this.eventManager.emit('change', eventObj);
    }
  }

  _changeTaskState(mdNode, line) {
    const { listData, sourcepos } = mdNode;
    const { task, checked, padding } = listData;

    if (task) {
      const stateChar = checked ? ' ' : 'x';
      const [[, startCh]] = sourcepos;
      const startPos = { line, ch: startCh + padding };

      this.cm.replaceRange(stateChar, startPos, addChPos(startPos, 1));
    }
  }

  _toggleTaskStates() {
    const ranges = this.cm.listSelections();

    ranges.forEach(range => {
      const { anchor, head } = range;
      const startLine = Math.min(anchor.line, head.line);
      const endLine = Math.max(anchor.line, head.line);
      let mdNode;

      for (let index = startLine, len = endLine; index <= len; index += 1) {
        mdNode = this.toastMark.findFirstNodeAtLine(index + 1);

        if (mdNode.type === 'list' || mdNode.type === 'item') {
          this._changeTaskState(mdNode, index);
        }
      }
    });
  }

  _refreshCodeMirrorMarks(e) {
    const { from, to, text } = e;
    const changed = this.toastMark.editMarkdown(
      [from.line + 1, from.ch + 1],
      [to.line + 1, to.ch + 1],
      text.join('\n')
    );

    this._emitMarkdownEditorContentChangedEvent(changed);

    if (!changed.length) {
      return;
    }

    changed.forEach(editResult => this._markNodes(editResult));
  }

  _markNodes(editResult) {
    const { nodes, removedNodeRange } = editResult;

    if (removedNodeRange) {
      this._removeBackgroundOfLines(removedNodeRange);
    }

    if (nodes.length) {
      const [editFromPos] = nodes[0].sourcepos;
      const [, editToPos] = nodes[nodes.length - 1].sourcepos;
      const editFrom = { line: editFromPos[0] - 1, ch: editFromPos[1] - 1 };
      const editTo = { line: editToPos[0] - 1, ch: editToPos[1] };
      const marks = this.cm.findMarks(editFrom, editTo);

      for (const mark of marks) {
        if (mark.attributes && ATTR_NAME_MARK in mark.attributes) {
          mark.clear();
        }
      }

      for (const parent of nodes) {
        const walker = parent.walker();
        let event = walker.next();

        while (event) {
          const { node, entering } = event;

          // eslint-disable-next-line max-depth
          if (entering) {
            this._markNode(node);
          }
          event = walker.next();
        }
      }
    }
  }

  _changeTextToTaskMarker() {
    const { line, ch } = this.cm.getCursor();
    const mdCh = this.cm.getLine(line).length === ch ? ch : ch + 1;
    const mdNode = this.toastMark.findNodeAtPosition([line + 1, mdCh]);
    const paraNode = findClosestNode(
      mdNode,
      node => node.type === 'paragraph' && node.parent && node.parent.type === 'item'
    );

    if (paraNode && paraNode.firstChild) {
      const { literal, sourcepos } = paraNode.firstChild;
      const [[startLine, startCh]] = sourcepos;
      const matched = literal.match(TASK_MARKER_RX);

      if (matched) {
        const [, startSpaces, stateChar, lastSpaces] = matched;
        const spaces = startSpaces.length + lastSpaces.length;
        const startPos = { line: startLine - 1, ch: startCh };

        if (stateChar) {
          this.cm.replaceRange(stateChar, startPos, addChPos(startPos, spaces ? spaces + 1 : 0));
        } else if (!spaces) {
          this.cm.replaceRange(' ', startPos, startPos);
        }
      }
    }
  }

  _removeBackgroundOfLines(removedNodeRange) {
    const [startLine, endLine] = removedNodeRange.line;

    for (let index = startLine; index <= endLine; index += 1) {
      if (this._markedLines[index]) {
        this.cm.removeLineClass(index, 'background');
        this._markedLines[index] = false;
      }
    }
  }

  _markCodeBlockBackground(lineBackground) {
    const { start, end, className } = lineBackground;

    for (let index = start; index <= end; index += 1) {
      let lineClassName = className;

      if (index === start) {
        lineClassName += ' start';
      } else if (index === end) {
        lineClassName += ' end';
      }

      this.cm.addLineClass(index, 'background', lineClassName);
      this._markedLines[index] = true;
    }
  }

  _markNode(node) {
    const from = { line: getMdStartLine(node) - 1, ch: getMdStartCh(node) - 1 };
    const to = { line: getMdEndLine(node) - 1, ch: getMdEndCh(node) };
    const markInfo = getMarkInfo(node, from, to, this.cm.getLine(to.line));

    if (markInfo) {
      const { marks = [], lineBackground = {} } = markInfo;

      marks.forEach(({ start, end, className }) => {
        const attributes = { [ATTR_NAME_MARK]: '' };

        this.cm.markText(start, end, { className, attributes });
      });

      this._markCodeBlockBackground(lineBackground);
    }
  }

  _setToolbarState(state) {
    if (isToolbarStateChanged(this._latestState, state)) {
      const eventObj = {
        source: 'markdown',
        ...(state ? state : defaultToolbarState)
      };

      this.eventManager.emit('stateChange', eventObj);
    }

    this._latestState = state;
  }

  _onChangeCursorActivity() {
    const { line, ch } = this.cm.getCursor();
    const mdLine = line + 1;
    const mdCh = this.cm.getLine(line).length === ch ? ch : ch + 1;
    let mdNode = this.toastMark.findNodeAtPosition([mdLine, mdCh]);
    let state = null;

    // To prevent to execute codemirror command in codeblock
    this.cm.state.isCursorInCodeBlock = mdNode && mdNode.type === 'codeBlock';
    this.eventManager.emit('cursorActivity', {
      source: 'markdown',
      cursor: { line, ch },
      markdownNode: mdNode
    });

    if (mdNode) {
      mdNode = mdNode.type === 'text' ? mdNode.parent : mdNode;
      state = getToolbarState(mdNode, ch, mdLine, mdCh);
    }

    this._setToolbarState(state);
  }

  /**
   * latestState reset
   */
  resetState() {
    this._latestState = null;
  }

  getToastMark() {
    return this.toastMark;
  }

  /**
   * MarkdownEditor factory method
   * @param {HTMLElement} el - Container element for editor
   * @param {EventManager} eventManager - EventManager instance
   * @param {Object} options - options of editor
   * @returns {MarkdownEditor} - MarkdownEditor
   * @ignore
   */
  static factory(el, eventManager, toastMark, options) {
    return new MarkdownEditor(el, eventManager, toastMark, options);
  }
}

export default MarkdownEditor;
