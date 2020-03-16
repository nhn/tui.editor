/**
 * @fileoverview test button
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import ToolbarButton from '@/ui/toolbarButton';

describe('ToolbarButton', () => {
  let button;

  describe('creation', () => {
    it('should make button element', () => {
      button = new ToolbarButton({});
      expect(button.el.tagName).toEqual('BUTTON');
    });

    it('should have an element containing given class on className option', () => {
      button = new ToolbarButton({
        className: 'myclass'
      });
      expect($(button.el).hasClass('myclass')).toBe(true);
    });

    it('should have text given by text option', () => {
      button = new ToolbarButton({
        text: 'buttonText'
      });

      expect($(button.el).text()).toEqual('buttonText');
    });

    it('should have applied given style on style option', () => {
      button = new ToolbarButton({
        style: 'display:none'
      });

      expect($(button.el).css('display')).toEqual('none');
    });
  });

  describe('event', () => {
    let buttonElement;

    beforeEach(() => {
      buttonElement = document.createElement('button');
      document.body.appendChild(buttonElement);
    });

    afterEach(() => {
      document.body.removeChild(buttonElement);
    });

    it('should emit the command event which name is given by command option when the button is clicked', () => {
      let passedCommand;

      button = new ToolbarButton({
        el: buttonElement,
        command: 'mycommand'
      });

      button.on('command', command => {
        passedCommand = command;
      });

      button.el.click();

      expect(passedCommand).toEqual('mycommand');
    });

    it('should emit the event which name is given by event option when the button is clicked', () => {
      let passedEvent;

      button = new ToolbarButton({
        el: buttonElement,
        event: 'myevent'
      });

      button.on('event', event => {
        passedEvent = event;
      });

      button.el.click();

      expect(passedEvent).toEqual('myevent');
    });

    it('should not emmit clicked if disabled', () => {
      let passedEvent;

      button = new ToolbarButton({
        el: buttonElement,
        event: 'myevent'
      });
      button.disable();

      button.on('event', (e, event) => {
        passedEvent = event;
      });

      button.el.click();

      expect(passedEvent).toBeFalsy();
    });

    it('should emit only command event prior to event, given event option will be ignored', () => {
      const eventHandler = jasmine.createSpy('eventHandler');
      const commandHandler = jasmine.createSpy('commandHandler');

      button = new ToolbarButton({
        el: buttonElement,
        command: 'mycommand',
        event: 'myevent'
      });

      button.on('command', commandHandler);
      button.on('event', eventHandler);

      button.el.click();

      expect(commandHandler).toHaveBeenCalled();
      expect(eventHandler).not.toHaveBeenCalled();
    });
  });

  describe('enable/disable', () => {
    it('should remove/add disabled attr', () => {
      button = new ToolbarButton({});

      button.disable();
      expect(button.el.disabled).toBeTruthy();

      button.enable();
      expect(button.el.disabled).toBeFalsy();
    });
  });
});
