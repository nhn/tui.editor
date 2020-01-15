/**
 * @fileoverview test ui popup add table
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import PopupAddTable from '@/ui/popupAddTable';
import EventManager from '@/eventManager';

describe('PopupAddTable', () => {
  let popup, em;

  beforeEach(() => {
    em = new EventManager();

    popup = new PopupAddTable({
      eventManager: em
    });
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('cell bound caculation', () => {
    it('0 x 0 offset to bound', () => {
      const bound = popup._getBoundByOffset(1, 1);

      expect(bound.row).toEqual(0);
      expect(bound.col).toEqual(0);
    });

    it('2 x 2 offset to bound', () => {
      const bound = popup._getBoundByOffset(
        PopupAddTable.CELL_WIDTH * 2 + 10,
        PopupAddTable.CELL_HEIGHT * 2 + 10
      );

      expect(bound.row).toEqual(2);
      expect(bound.col).toEqual(2);
    });

    it('4 x 3 offset to bound', () => {
      const bound = popup._getBoundByOffset(
        PopupAddTable.CELL_WIDTH * 3 + 10,
        PopupAddTable.CELL_HEIGHT * 4 + 10
      );

      expect(bound.row).toEqual(4);
      expect(bound.col).toEqual(3);
    });

    it('0 x 0 cell bound to offset', () => {
      const boundOffset = popup._getOffsetByBound(0, 0);

      expect(boundOffset.y).toEqual(PopupAddTable.CELL_HEIGHT);
      expect(boundOffset.x).toEqual(PopupAddTable.CELL_WIDTH);
    });

    it('2 x 2 cell bound to offset', () => {
      const boundOffset = popup._getOffsetByBound(2, 2);

      expect(boundOffset.y).toEqual(PopupAddTable.CELL_HEIGHT * 3);
      expect(boundOffset.x).toEqual(PopupAddTable.CELL_WIDTH * 3);
    });

    it('4 x 3 cell bound to offset', () => {
      const boundOffset = popup._getOffsetByBound(3, 4);

      expect(boundOffset.y).toEqual(PopupAddTable.CELL_HEIGHT * 5);
      expect(boundOffset.x).toEqual(PopupAddTable.CELL_WIDTH * 4);
    });
  });

  describe('_getSelectionBoundByOffset', () => {
    it('get selection bound by offset', () => {
      const bound = popup._getSelectionBoundByOffset(
        PopupAddTable.CELL_WIDTH * 4,
        PopupAddTable.CELL_HEIGHT * 5
      );

      expect(bound.row).toEqual(5);
      expect(bound.col).toEqual(4);
    });
    it('dont get lower value than minimum value', () => {
      const bound = popup._getSelectionBoundByOffset(0, 1);

      expect(bound.row).toEqual(PopupAddTable.MIN_ROW_SELECTION_INDEX);
      expect(bound.col).toEqual(PopupAddTable.MIN_COL_SELECTION_INDEX);
    });
  });

  describe('_getResizedTableBound', () => {
    it('get resized table bound if need', () => {
      const bound = popup._getResizedTableBound(5, 7);

      expect(bound.row).toEqual(8);
      expect(bound.col).toEqual(6);
    });

    it('dont get resized table bound if need', () => {
      const bound = popup._getResizedTableBound(3, 4);

      expect(bound).not.toBeDefined();
    });
  });
});
