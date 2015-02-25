/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var util = ne.util;

/**
 * EventManager
 * @exports EventManager
 * @extends {}
 * @constructor
 * @class
 */
function EventManager() {
    this.events = new util.HashMap();
}

EventManager.prototype.listen = function(name, handler) {
    var eventHandlers = this.events.get(name) || [];
    eventHandlers.push(handler);

    this.events.set(name, eventHandlers);
};

EventManager.prototype.emit = function() {
    var args = util.toArray(arguments),
        name = args.shift(),
        eventHandlers = this.events.get(name);

    if (eventHandlers) {
       util.forEach(eventHandlers, function(handler) {
            handler.apply(null, args);
       });
    }
};

module.exports = EventManager;
