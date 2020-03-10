/**
 * @fileoverview Implements table extension ui
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import css from 'tui-code-snippet/domUtil/css';
import matches from 'tui-code-snippet/domUtil/matches';

/**
 * Change contextmenu content.
 * @param {object} popupTableUtils - PopupTableUtils instance for managing contextmenu of table
 * @param  {I18n} i18n - instance of language module
 * @private
 */
function _changeContent(popupTableUtils, i18n) {
  const POPUP_CONTENT = [
    `<button type="button" class="te-table-add-row">${i18n.get('Add row')}</button>`,
    `<button type="button" class="te-table-add-col">${i18n.get('Add col')}</button>`,
    `<button type="button" class="te-table-remove-row">${i18n.get('Remove row')}</button>`,
    `<button type="button" class="te-table-remove-col">${i18n.get('Remove col')}</button>`,
    '<hr/>',
    `<button type="button" class="te-table-merge">${i18n.get('Merge cells')}</button>`,
    `<button type="button" class="te-table-unmerge">${i18n.get('Unmerge cells')}</button>`,
    '<hr/>',
    `<button type="button" class="te-table-col-align-left">${i18n.get('Align left')}</button>`,
    `<button type="button" class="te-table-col-align-center">${i18n.get('Align center')}</button>`,
    `<button type="button" class="te-table-col-align-right">${i18n.get('Align right')}</button>`,
    '<hr/>',
    `<button type="button" class="te-table-remove">${i18n.get('Remove table')}</button>`
  ].join('');

  popupTableUtils.setContent(POPUP_CONTENT);
  popupTableUtils._initDOMEvent();
}

function show(element) {
  css(element, { display: 'block' });
}

function hide(element) {
  css(element, { display: 'none' });
}

/**
 * Bind events for merge feature of contextmenu.
 * @param {object} popupTableUtils - PopupTableUtils instance for managing contextmenu of table
 * @param {object} eventManager - event manager instance of editor
 * @param {object} selectionManager - table selection manager instance
 * @private
 */
function _bindEvents(popupTableUtils, eventManager, selectionManager) {
  const { body } = popupTableUtils;
  const [, , , , mergeBtn, unmergeBtn] = body.querySelectorAll('button');
  const separator = body.querySelector('hr');

  popupTableUtils.on('click .te-table-merge', () => {
    eventManager.emit('command', 'MergeCells');
  });

  popupTableUtils.on('click .te-table-unmerge', () => {
    eventManager.emit('command', 'UnmergeCells');
  });

  eventManager.listen('openPopupTableUtils', () => {
    const selectedCells = selectionManager.getSelectedCells();
    const selectedCellCount = selectedCells.length;

    if (selectedCellCount) {
      if (selectedCellCount < 2 || selectionManager.hasSelectedBothThAndTd(selectedCells)) {
        hide(mergeBtn);
      } else {
        show(mergeBtn);
      }

      const mergedCells = toArray(selectedCells).filter(selectedCell =>
        matches(selectedCell, '[rowspan], [colspan')
      );

      if (mergedCells.length) {
        show(unmergeBtn);
      } else {
        hide(unmergeBtn);
      }
      show(separator);
    } else {
      hide(mergeBtn);
      hide(unmergeBtn);
      hide(separator);
    }
  });
}

/**
 * Update contextmenu UI.
 * @param {object} popupTableUtils - PopupTableUtils instance for managing contextmenu of table
 * @param {object} eventManager - event manager instance of editor
 * @param {object} selectionManager - table selection manager instance
 * @param {Editor} editor - editor instance
 */
export function updateContextMenu(popupTableUtils, eventManager, selectionManager, editor) {
  const { i18n } = editor;

  _changeContent(popupTableUtils, i18n);
  _bindEvents(popupTableUtils, eventManager, selectionManager);
}
