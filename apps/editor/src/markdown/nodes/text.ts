import Node from '@/spec/node';

export class Text extends Node {
  get name() {
    return 'text';
  }

  get defaultSchema() {
    return {
      group: 'inline',
    };
  }
}
