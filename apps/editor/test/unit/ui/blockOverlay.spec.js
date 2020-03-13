/**
 * @fileoverview test ui block overlay
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import BlockOverlay from '@/ui/blockOverlay';
import EventManager from '@/eventManager';

import domUtils from '@/utils/dom';

describe('BlockOverlay', () => {
  let blockOverlay, $container, $targetElement, $targetElement2, em;

  beforeEach(() => {
    $('body').attr('contenteditable', true);
    $container = $('<div>');
    $container.css('position', 'relative');

    $targetElement = $('<pre>');
    $targetElement.css({
      position: 'absolute',
      left: '1px',
      top: '2px',
      width: '3px',
      height: '4px'
    });

    $targetElement2 = $('<pre>');
    $targetElement2.css({
      position: 'absolute',
      left: '2px',
      top: '3px',
      width: '4px',
      height: '5px'
    });

    $('body').append($targetElement);
    $('body').append($container);

    em = new EventManager();
    blockOverlay = new BlockOverlay({
      eventManager: em,
      container: $container.get(0),
      attachedSelector: 'pre'
    });
  });

  afterEach(() => {
    $('body').empty();
  });

  it('should match position & size to attachedElement on change event', () => {
    blockOverlay._attachedElement = $targetElement.get(0);
    blockOverlay.setVisibility(true);

    $targetElement.css('top', '1px');
    $targetElement.css('left', '2px');

    em.emit('change', {
      source: 'wysiwyg'
    });

    expect(domUtils.getOffset(blockOverlay.el)).toEqual(domUtils.getOffset($targetElement.get(0)));

    $targetElement.width('10px');
    $targetElement.height('10px');

    em.emit('change', {
      source: 'wysiwyg'
    });

    expect($(blockOverlay.el).width()).toBe($targetElement.width());
    expect($(blockOverlay.el).height()).toBe($targetElement.height());
  });

  it('show on mouseover', () => {
    em.emit('mouseover', {
      source: 'wysiwyg',
      data: {
        target: $targetElement.get(0)
      }
    });
    expect(blockOverlay.getVisibility()).toBe(true);

    blockOverlay.setVisibility(false);
    blockOverlay._attachedElement = $targetElement.get(0);
    em.emit('mouseover', {
      source: 'wysiwyg',
      data: {
        target: blockOverlay.el
      }
    });

    expect(blockOverlay.getVisibility()).toBe(true);
  });

  it('hide on mouseover the other elements than target nor blockOverlay', () => {
    em.emit('mouseout', {
      source: 'wysiwyg',
      data: {
        target: $targetElement2
      }
    });

    expect(blockOverlay.getVisibility()).toBe(false);
  });

  it('hide on attached element destroyed', () => {
    blockOverlay._attachedElement = $targetElement.get(0);
    blockOverlay.setVisibility(true);
    $targetElement.remove();

    em.emit('change');

    expect(blockOverlay.getVisibility()).toBe(false);
  });
});
