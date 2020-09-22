import { DOMOutputSpecArray } from 'prosemirror-model';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';

export class TaskDelimiter extends Mark {
  get name() {
    return 'taskDelimiter';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('delimiter', 'list-item') }, 0];
      }
    };
  }
}

export class Delimiter extends Mark {
  get name() {
    return 'delimiter';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('delimiter') }, 0];
      }
    };
  }
}

export class Meta extends Mark {
  get name() {
    return 'meta';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('meta') }, 0];
      }
    };
  }
}

export class MarkedText extends Mark {
  get name() {
    return 'markedText';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('marked-text') }, 0];
      }
    };
  }
}
