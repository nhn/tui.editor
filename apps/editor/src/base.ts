import { Node, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Emitter } from '@t/event';
import { Context, EditorAllCommandMap } from '@t/spec';
import SpecManager from './spec/specManager';

export interface StateOptions {
  doc: Node | null;
}

export default abstract class EditorBase {
  el: HTMLElement;

  eventEmitter: Emitter;

  context!: Context;

  schema!: Schema;

  keymaps!: Plugin[];

  view!: EditorView;

  commands!: EditorAllCommandMap;

  specs!: SpecManager;

  constructor(el: HTMLElement, eventEmitter: Emitter) {
    this.el = el;
    this.eventEmitter = eventEmitter;
  }

  // abstract addWidget(range: Range, node: Node, style: string, offset?: number): void;

  abstract createSpecs(): SpecManager;

  abstract createContext(): Context;

  abstract createState(state?: StateOptions): void;

  abstract createView(): EditorView;

  createSchema() {
    return new Schema({
      nodes: this.specs.nodes,
      marks: this.specs.marks
    });
  }

  createKeymaps() {
    return this.specs.keymaps();
  }

  createCommands() {
    return this.specs.commands(this.view);
  }

  focus() {
    this.view.focus();
  }

  abstract blur(): void;

  abstract getRange(): any;

  abstract insertText(text: string): void;

  abstract moveCursorToEnd(): void;

  abstract moveCursorToStart(): void;

  abstract replaceRelativeOffset(content: string, offset: number, overwriteLength: number): void;

  abstract replaceSelection(content: string, range: Range): void;

  abstract scrollTop(value: number): boolean;

  abstract setHeight(height: number): void;

  abstract setMinHeight(minHeight: number): void;

  abstract setPlaceholder(placeholder: string): void;

  abstract destroy(): void;
}
