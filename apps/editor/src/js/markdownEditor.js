/**
 * @fileoverview Implements markdown editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import { MarkdownDocument } from '@toast-ui/markdown-parser';

import CodeMirrorExt from './codeMirrorExt';
import KeyMapper from './keyMapper';
import MdListManager from './mdListManager';
import ComponentManager from './componentManager';
import MdTextObject from './mdTextObject';

const keyMapper = KeyMapper.getSharedInstance();

const tokenTypes = {
  strong: 'strong',
  emph: 'em',
  strike: 'strikethrough',
  thematicBreak: 'hr',
  blockQuote: 'quote',
  code: 'comment',
  codeBlock: 'comment'
};

/**
 * Class MarkdownEditor
 * @param {HTMLElement} el - container element
 * @param {EventManager} eventManager - event manager
 * @param {Object} options - options of editor
 */
class MarkdownEditor extends CodeMirrorExt {
  constructor(el, eventManager, options) {
    super(el, {
      dragDrop: true,
      allowDropFileTypes: ['image'],
      extraKeys: {
        Enter: 'newlineAndIndentContinueMarkdownList',
        Tab: 'indentOrderedList',
        'Shift-Tab': 'indentLessOrderedList'
      },
      viewportMargin: options && options.height === 'auto' ? Infinity : 10
    });
    this.eventManager = eventManager;
    this.componentManager = new ComponentManager(this);
    this.mdDocument = new MarkdownDocument();
    this.componentManager.addManager(MdListManager);

    /**
     * latest state info
     * @type {object}
     * @private
     */
    this._latestState = null;

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

    // this.cm.on('cursorActivity', () => {
    //   const token = this.cm.getTokenAt(this.cm.getCursor());
    //   const { base } = token.state;
    //   const state = {
    //     bold: !!base.strong,
    //     italic: !!base.em,
    //     strike: !!base.strikethrough,
    //     code: base.code > 0,
    //     codeBlock: base.code === -1,
    //     quote: !!base.quote,
    //     list: !!base.list,
    //     task: !!base.taskList,
    //     source: 'markdown'
    //   };

    //   if (!this._latestState || this._isStateChanged(this._latestState, state)) {
    //     this.eventManager.emit('stateChange', state);
    //     this._latestState = state;
    //   }
    // });
  }

  /**
   * Set Editor value
   * @param {string} markdown - Markdown syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   * @override
   */
  setValue(markdown, cursorToEnd) {
    super.setValue(markdown, cursorToEnd);
    // this._emitMarkdownEditorContentChangedEvent();
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

  _refreshCodeMirrorMarks(e) {
    const { from, to, text } = e;
    const editResult = this.mdDocument.editMarkdown(
      [from.line + 1, from.ch + 1],
      [to.line + 1, to.ch + 1],
      text.join('\n')
    );

    this._emitMarkdownEditorContentChangedEvent(editResult);

    const { nodes } = editResult;

    if (!nodes.length) {
      return;
    }

    /* eslint-disable max-depth */
    const [editFromPos] = nodes[0].sourcepos;
    const [, editToPos] = nodes[nodes.length - 1].sourcepos;
    const editFrom = { line: editFromPos[0] - 1, ch: editFromPos[1] - 1 };
    const editTo = { line: editToPos[0] - 1, ch: editToPos[1] };
    const marks = this.cm.findMarks(editFrom, editTo);

    for (const mark of marks) {
      mark.clear();
    }

    for (const parent of nodes) {
      const walker = parent.walker();
      let event = walker.next();

      while (event) {
        const { node, entering } = event;

        if (entering) {
          const { type, sourcepos } = node;
          const [startPosition, endPosition] = sourcepos;
          const [startLine, startCh] = startPosition;
          const [endLine, endCh] = endPosition;
          const start = { line: startLine - 1, ch: startCh - 1 };
          const end = { line: endLine - 1, ch: endCh };
          const extraNode = tokenTypes[type];

          if (type === 'heading') {
            this.cm.markText(start, end, { className: `cm-header cm-header-${node.level}` });
          } else if (extraNode) {
            this.cm.markText(start, end, { className: `cm-${extraNode}` });
          } else if (type === 'image' || type === 'link') {
            this._markTextInLinkOrImage(type, startPosition, endPosition, node.destination);
          } else if (this._isListNode(node)) {
            this._markTextInList(node.parent, startPosition, endPosition);
          }
        }
        event = walker.next();
      }
    }
    /* eslint-enable max-depth */
  }

  _isListNode(node) {
    const { type, parent } = node;

    return type === 'paragraph' && !!parent && parent.type === 'item';
  }

  _markTextInLinkOrImage(type, startPositon, endPosition, destination) {
    const [startLine, startCh] = startPositon;
    const [endLine, endCh] = endPosition;

    const urlStart = { line: endLine - 1, ch: endCh - destination.length - 2 };
    const urlEnd = { line: endLine - 1, ch: endCh + 1 };

    if (type === 'image') {
      const markerStart = { line: startLine - 1, ch: endCh - 1 };
      const markerEnd = { line: startLine - 1, ch: startCh };

      this.cm.markText(markerStart, markerEnd, { className: 'cm-image cm-image-marker' });
      this.cm.markText({ line: startLine - 1, ch: startCh }, urlStart, {
        className: 'cm-link cm-image cm-image-alt-text'
      });
    } else {
      this.cm.markText({ line: startLine - 1, ch: startCh - 1 }, urlStart, {
        className: 'cm-link'
      });
    }

    this.cm.markText(urlStart, urlEnd, { className: 'cm-string cm-url' });
  }

  _getClassNameOfListItem(node) {
    let depth = 0;

    while (node.parent.parent.type === 'item' && node.parent.parent.type !== 'document') {
      node = node.parent.parent;
      depth += 1;
    }

    const reminder = depth % 3;
    let className;

    if (reminder === 0) {
      className = 'variable-2';
    } else if (reminder === 1) {
      className = 'variable-3';
    } else {
      className = 'keyword';
    }

    return `cm-${className}`;
  }

  _markTextInList(node, startPosition, endPosition) {
    const className = this._getClassNameOfListItem(node);
    const { padding, task } = node.listData;
    const [startLine, startCh] = startPosition;
    const [endLine, endCh] = endPosition;

    let startListItem = { line: startLine - 1, ch: startCh - 1 };
    const endListItem = { line: endLine - 1, ch: endCh };
    const indent = startCh - padding;

    if (task) {
      const meta = indent - 3;

      this.cm.markText(
        { line: startLine - 1, ch: meta - 2 },
        { line: endLine - 1, ch: meta },
        { className }
      );
      this.cm.markText(
        { line: startLine - 1, ch: meta },
        { line: endLine - 1, ch: indent },
        { className: 'cm-meta' }
      );
    } else {
      startListItem = { line: startLine - 1, ch: indent - 1 };
    }

    this.cm.markText(startListItem, endListItem, { className });
  }

  /**
   * Return whether state changed or not
   * @param {object} previousState - Previous state
   * @param {object} currentState - Current state
   * @returns {boolean} - changed state
   * @private
   */
  _isStateChanged(previousState, currentState) {
    let result = false;

    forEachOwnProperties(currentState, (currentStateTypeValue, stateType) => {
      result = previousState[stateType] !== currentStateTypeValue;

      return !result;
    });

    return result;
  }

  /**
   * latestState reset
   */
  resetState() {
    this._latestState = null;
  }

  /**
   * MarkdownEditor factory method
   * @param {HTMLElement} el - Container element for editor
   * @param {EventManager} eventManager - EventManager instance
   * @param {Object} options - options of editor
   * @returns {MarkdownEditor} - MarkdownEditor
   * @ignore
   */
  static factory(el, eventManager, options) {
    return new MarkdownEditor(el, eventManager, options);
  }
}

export default MarkdownEditor;
