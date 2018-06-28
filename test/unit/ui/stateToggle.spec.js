/**
 * @fileoverview test StateToggle
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import StateToggle from '../../../src/js/ui/stateToggle';
import EventManager from '../../../src/js/eventManager';

describe('StateToggle', () => {
  let em, toggle;

  beforeEach(() => {
    toggle = {
      enable: () => {},
      disable: () => {}
    };
    spyOn(toggle, 'enable');
    spyOn(toggle, 'disable');
    em = new EventManager();
  });

  it('should call enable of given toggle if it listen to compatible state', () => {
    // eslint-disable-next-line no-unused-vars
    const stateToggle = new StateToggle(em, toggle, {
      enableOn: ['state1', 'state2']
    });

    em.emit('stateChange', {
      state1: false,
      state2: false
    });

    expect(toggle.enable.calls.count()).toBe(0);
    expect(toggle.disable.calls.count()).toBe(1);

    em.emit('stateChange', {
      state1: true,
      state2: false
    });

    expect(toggle.enable.calls.count()).toBe(1);
    expect(toggle.disable.calls.count()).toBe(1);

    em.emit('stateChange', {
      state1: false,
      state2: true
    });

    expect(toggle.enable.calls.count()).toBe(2);
    expect(toggle.disable.calls.count()).toBe(1);

    em.emit('stateChange', {
      state1: true,
      state2: true
    });

    expect(toggle.enable.calls.count()).toBe(3);
    expect(toggle.disable.calls.count()).toBe(1);
  });
});
