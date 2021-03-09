import { MdNodeType } from '@t/node';
import { Process, BlockHandler } from '../blockHandlers';

export const table: BlockHandler = {
  continue() {
    return Process.Go;
  },
  finalize() {},
  canContain(t: MdNodeType) {
    return t === 'tableHead' || t === 'tableBody';
  },
  acceptsLines: false,
};

export const tableBody: BlockHandler = {
  continue() {
    return Process.Go;
  },
  finalize() {},
  canContain(t: MdNodeType) {
    return t === 'tableRow';
  },
  acceptsLines: false,
};

export const tableHead: BlockHandler = {
  continue() {
    return Process.Stop;
  },
  finalize() {},
  canContain(t: MdNodeType) {
    return t === 'tableRow' || t === 'tableDelimRow';
  },
  acceptsLines: false,
};

export const tableDelimRow: BlockHandler = {
  continue() {
    return Process.Stop;
  },
  finalize() {},
  canContain(t: MdNodeType) {
    return t === 'tableDelimCell';
  },
  acceptsLines: false,
};

export const tableDelimCell: BlockHandler = {
  continue() {
    return Process.Stop;
  },
  finalize() {},
  canContain() {
    return false;
  },
  acceptsLines: false,
};

export const tableRow: BlockHandler = {
  continue() {
    return Process.Stop;
  },
  finalize() {},
  canContain(t: MdNodeType) {
    return t === 'tableCell';
  },
  acceptsLines: false,
};

export const tableCell: BlockHandler = {
  continue() {
    return Process.Stop;
  },
  finalize() {},
  canContain() {
    return false;
  },
  acceptsLines: false,
};
