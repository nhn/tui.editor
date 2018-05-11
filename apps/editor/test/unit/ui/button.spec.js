/**
 * @fileoverview test button
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Button from '../../../src/js/ui/button';

describe('Button', () => {
  let button;

  afterEach(() => {
    $('body').empty();
  });

  describe('creation', () => {
    it('should make button element', () => {
      button = new Button({});
      expect(button.$el.prop('tagName')).toEqual('BUTTON');
    });

    it('should have an element containing given class on className option', () => {
      button = new Button({
        className: 'myclass'
      });
      expect(button.$el.hasClass('myclass')).toBe(true);
    });

    it('should have text given by text option', () => {
      button = new Button({
        text: 'buttonText'
      });

      expect(button.$el.text()).toEqual('buttonText');
    });

    it('should have applied given style on style option', () => {
      button = new Button({
        style: 'display:none'
      });

      expect(button.$el.css('display')).toEqual('none');
    });
  });

  describe('event', () => {
    it('should emit the command event which name is given by command option when the button is clicked', () => {
      let passedCommand;

      button = new Button({
        command: 'mycommand'
      });

      button.on('command', (e, command) => {
        passedCommand = command;
      });

      button.$el.trigger('click');

      expect(passedCommand).toEqual('mycommand');
    });

    it('should emit the event which name is given by event option when the button is clicked', () => {
      let passedEvent;

      button = new Button({
        event: 'myevent'
      });

      button.on('event', (e, event) => {
        passedEvent = event;
      });

      button.$el.trigger('click');

      expect(passedEvent).toEqual('myevent');
    });

    it('should emit only command event prior to event, given event option will be ignored', () => {
      const eventHandler = jasmine.createSpy('eventHandler');
      const commandHandler = jasmine.createSpy('commandHandler');

      button = new Button({
        command: 'mycommand',
        event: 'myevent'
      });

      button.on('command', commandHandler);
      button.on('event', eventHandler);

      button.$el.trigger('click');

      expect(commandHandler).toHaveBeenCalled();
      expect(eventHandler).not.toHaveBeenCalled();
    });
  });
});
