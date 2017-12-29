/**
 * @fileoverview test ui toolbar
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Toolbar from '../../src/js/ui/toolbar';
import CommandManager from '../../src/js/commandManager';
import Command from '../../src/js/command';
import EventManager from '../../src/js/eventManager';
import Button from '../../src/js/ui/button';

describe('Toolbar', () => {
  let toolbar,
    em,
    cm;

  beforeEach(() => {
    em = new EventManager();
    em.addEventType('test');
    cm = new CommandManager({
      eventManager: em
    });
    toolbar = new Toolbar(em, cm);
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('addButton()', () => {
    it('add a button on toolbar', () => {
      const len = toolbar.buttons.length;

      toolbar.addButton(new Button({
        className: 'test',
        command: 'test',
        text: 'test'
      }));

      expect(toolbar.buttons.length).toBe(len + 1);
    });

    it('if addButton param is not a button make button with props', () => {
      const len = toolbar.buttons.length;

      toolbar.addButton({
        className: 'test',
        command: 'test',
        text: 'test'
      });

      expect(toolbar.buttons.length).toBe(len + 1);
    });

    it('addButton with index should insert button into given position', () => {
      toolbar.addButton({
        className: 'test',
        command: 'test',
        text: 'test'
      }, 0);

      expect(toolbar.buttons[0].$el.text()).toBe('test');
    });

    it('add multiple buttons via array', () => {
      const len = toolbar.buttons.length;

      toolbar.addButton([{
        className: 'test',
        command: 'test',
        text: 'test'
      }, {
        className: 'test2',
        command: 'test2',
        text: 'test2'
      }]);

      expect(toolbar.buttons.length).toBe(len + 2);
    });

    it('add multiple buttons via array with index should insert buttons into given position', () => {
      toolbar.addButton([{
        className: 'test',
        command: 'test',
        text: 'test'
      }, {
        className: 'test2',
        command: 'test2',
        text: 'test2'
      }], 1);

      expect(toolbar.buttons[1].$el.text()).toBe('test');
      expect(toolbar.buttons[2].$el.text()).toBe('test2');
    });

    it('click on added button emits given command', () => {
      toolbar.addButton(new Button({
        className: 'test',
        command: 'test',
        text: 'test'
      }));

      $('body').append(toolbar.$el);

      const command = new Command('test', Command.TYPE.GB);
      command.setup = function() {};
      command.exec = jasmine.createSpy('exec');

      cm.addCommand(command);

      $('.test').trigger('click');

      expect(command.exec).toHaveBeenCalled();
    });

    it('click on button calls handler through command', () => {
      const handler = jasmine.createSpy('exec');

      toolbar.addButton(new Button({
        className: 'test',
        event: 'test',
        text: 'test'
      }));

      $('body').append(toolbar.$el);

      em.listen('test', handler);

      $('.test').trigger('click');

      expect(handler).toHaveBeenCalled();
    });
  });

  it('button state should be (de)activated on stateChange event', () => {
    toolbar.addButton(new Button({
      className: 'testButton',
      event: 'testEvent',
      text: 'textText',
      state: 'testState'
    }), 0);
    const $buttonEl = toolbar.buttons[0].$el;

    em.emit('stateChange', {
      testState: true
    });
    expect($buttonEl.hasClass('active')).toBe(true);

    em.emit('stateChange', {
      testState: false
    });
    expect($buttonEl.hasClass('active')).toBe(false);
  });

  describe('toolbar', () => {
    beforeEach(() => {
      $('body').append(toolbar.$el);
    });

    it('includes default buttons', () => {
      expect($('.tui-bold').length).toEqual(1);
      expect($('.tui-italic').length).toEqual(1);
      expect($('.tui-quote').length).toEqual(1);
      expect($('.tui-heading').length).toEqual(1);
      expect($('.tui-hrline').length).toEqual(1);
      expect($('.tui-link').length).toEqual(1);
      expect($('.tui-image').length).toEqual(1);
      expect($('.tui-ul').length).toEqual(1);
      expect($('.tui-ol').length).toEqual(1);
      expect($('.tui-task').length).toEqual(1);
      expect($('.tui-table').length).toEqual(1);
      expect($('.tui-codeblock').length).toEqual(1);
      expect($('.tui-code').length).toEqual(1);
    });
  });
});
