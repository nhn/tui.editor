/**
 * @fileoverview Implements markdown editor
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';

import CodeMirrorExt from './codeMirrorExt';
import KeyMapper from './keyMapper';
import MdListManager from './mdListManager';
import ComponentManager from './componentManager';
import MdTextObject from './mdTextObject';

const keyMapper = KeyMapper.getSharedInstance();

/**
 * Class MarkdownEditor
 */
class MarkdownEditor extends CodeMirrorExt {
  /**
   * Creates an instance of MarkdownEditor.
   * @param {jQuery} $el - container jquery element
   * @param {EventManager} eventManager - event manager
   * @memberof MarkdownEditor
   */
  constructor($el, eventManager) {
    super($el.get(0), {
      mode: 'gfm',
      dragDrop: true,
      allowDropFileTypes: ['image'],
      extraKeys: {
        'Enter': 'newlineAndIndentContinue',
        'Tab': 'subListIndentTab',
        'Shift-Tab': 'indentLessOrderedList'
      }
    });
    this.eventManager = eventManager;
    this.componentManager = new ComponentManager(this);
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
   * @memberof MarkdownEditor
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
      this._emitMarkdownEditorContentChangedEvent();
      this._emitMarkdownEditorChangeEvent(cmEvent);
    });

    this.cm.on('focus', () => {
      this.eventManager.emit('focus', {
        source: 'markdown'
      });
      this.getEditor().refresh();
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

    this.cm.on('cursorActivity', () => {
      const token = this.cm.getTokenAt(this.cm.getCursor());

      const {base, overlay} = token.state;

      const state = {
        bold: !!base.strong,
        italic: !!base.em,
        strike: !!base.strikethrough,
        code: !!overlay.code,
        codeBlock: !!overlay.codeBlock,
        quote: !!base.quote,
        list: !!base.list,
        task: !!base.task,
        source: 'markdown'
      };

      if (!this._latestState || this._isStateChanged(this._latestState, state)) {
        this.eventManager.emit('stateChange', state);
        this._latestState = state;
      }
    });
  }

  /**
   * Set Editor value
   * @memberof MarkdownEditor
   * @override
   * @param {string} markdown - Markdown syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  setValue(markdown, cursorToEnd) {
    super.setValue(markdown, cursorToEnd);
    this._emitMarkdownEditorContentChangedEvent();
  }

  /**
   * Get text object of current range
   * @memberof MarkdownEditor
   * @param {{start, end}} range Range object of each editor
   * @returns {object}
   */
  getTextObject(range) {
    return new MdTextObject(this, range);
  }

  /**
   * Emit contentChangedFromMarkdown event
   * @memberof MarkdownEditor
   * @private
   */
  _emitMarkdownEditorContentChangedEvent() {
    this.eventManager.emit('contentChangedFromMarkdown', this);
  }

  /**
   * Emit changeEvent
   * @memberof MarkdownEditor
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

  /**
   * Return whether state changed or not
   * @memberof MarkdownEditor
   * @param {object} previousState - Previous state
   * @param {object} currentState - Current state
   * @returns {boolean} - changed state
   * @private
   */
  _isStateChanged(previousState, currentState) {
    let result = false;

    util.forEach(currentState, (currentStateTypeValue, stateType) => {
      result = previousState[stateType] !== currentStateTypeValue;

      return !result;
    });

    return result;
  }

  /**
   * MarkdownEditor factory method
   * @memberof MarkdownEditor
   * @param {jQuery} $el - Container element for editor
   * @param {EventManager} eventManager - EventManager instance
   * @returns {MarkdownEditor} - MarkdownEditor
   */
  static factory($el, eventManager) {
    const mde = new MarkdownEditor($el, eventManager);

    return mde;
  }
}

export default MarkdownEditor;
