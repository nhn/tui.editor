/**
* @fileoverview Implements table extension ui
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';

import Editor from '../editorProxy';
const {i18n} = Editor;

/**
 * Change contextmenu content.
 * @param {object} popupTableUtils - PopupTableUtils instance for managing contextmenu of table
 * @private
 */
function _changeContent(popupTableUtils) {
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
  const $popupContent = $(POPUP_CONTENT);

  popupTableUtils.setContent($popupContent);
}

/**
 * Bind events for merge feature of contextmenu.
 * @param {object} popupTableUtils - PopupTableUtils instance for managing contextmenu of table
 * @param {object} eventManager - event manager instance of editor
 * @param {object} selectionManager - table selection manager instance
 * @private
 */
function _bindEvents(popupTableUtils, eventManager, selectionManager) {
  const $popupContent = popupTableUtils.$content;
  const $mergeBtn = $($popupContent[5]);
  const $unmergeBtn = $($popupContent[6]);
  const $separator = $($popupContent[7]);

  popupTableUtils.on('click .te-table-merge', () => {
    eventManager.emit('command', 'MergeCells');
  });

  popupTableUtils.on('click .te-table-unmerge', () => {
    eventManager.emit('command', 'UnmergeCells');
  });

  eventManager.listen('openPopupTableUtils', () => {
    const $selectedCells = selectionManager.getSelectedCells();
    const selectedCellCount = $selectedCells.length;

    if (selectedCellCount) {
      if (selectedCellCount < 2 || selectionManager.hasSelectedBothThAndTd($selectedCells)) {
        $mergeBtn.hide();
      } else {
        $mergeBtn.show();
      }

      if ($selectedCells.is('[rowspan], [colspan]')) {
        $unmergeBtn.show();
      } else {
        $unmergeBtn.hide();
      }
      $separator.show();
    } else {
      $mergeBtn.hide();
      $unmergeBtn.hide();
      $separator.hide();
    }
  });
}

/**
 * Update contextmenu UI.
 * @param {object} popupTableUtils - PopupTableUtils instance for managing contextmenu of table
 * @param {object} eventManager - event manager instance of editor
 * @param {object} selectionManager - table selection manager instance
 * @ignore
 */
function updateContextMenu(popupTableUtils, eventManager, selectionManager) {
  _changeContent(popupTableUtils);
  _bindEvents(popupTableUtils, eventManager, selectionManager);
}

export default {
  updateContextMenu
};
