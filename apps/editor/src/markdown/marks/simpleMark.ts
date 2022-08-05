import { DOMOutputSpec } from 'prosemirror-model';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';

export class TaskDelimiter extends Mark {
  get name() {
    return 'taskDelimiter';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpec {
        return ['span', { class: clsWithMdPrefix('delimiter', 'list-item') }, 0];
      },
    };
  }
}

export class Delimiter extends Mark {
  get name() {
    return 'delimiter';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpec {
        return ['span', { class: clsWithMdPrefix('delimiter') }, 0];
      },
    };
  }
}

export class Meta extends Mark {
  get name() {
    return 'meta';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpec {
        return ['span', { class: clsWithMdPrefix('meta') }, 0];
      },
    };
  }
}

export class MarkedText extends Mark {
  get name() {
    return 'markedText';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpec {
        return ['span', { class: clsWithMdPrefix('marked-text') }, 0];
      },
    };
  }
}

export class TableCell extends Mark {
  get name() {
    return 'tableCell';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpec {
        return ['span', { class: clsWithMdPrefix('table-cell') }, 0];
      },
    };
  }
}
