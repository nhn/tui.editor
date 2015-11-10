/**
 * @fileoverview HTML UI를 관리하는 컨트롤러
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util,
    _id = 0;
/**
 * UIController 클래스
 * @exports UIController
 * @constructor
 * @class
 * @param {Object} options 옵션
 * @param {jQuery} options.rootElement 이니셜라이즈할때 el에 들어갈 루트 엘리먼트를 셋팅할수있다.
 */
function UIController(options) {
    options = util.extend({
        tagName: 'div'
    }, options || {});

    this.tagName = options.tagName;
    this.className = options.className;

    /**
     * rootElement
     * @type {jQuery}
     */
    this.$el = null;

    this._initID();

    this.setRootElement(options.rootElement);
}


/**********
 * method
 **********/

/**
 * UIC에 custom event을 걸거나 jQuery를 이용해 dom에 이벤트를 건다.
 * @param {string} aType 이벤트명과 셀렉터 스트링
 * @param {function} aFn 이벤트 핸들러
 */
UIController.prototype.on = function(aType, aFn) {
    var self = this;

    if (util.isObject(aType)) {
        util.forEach(aType, function(fn, type) {
            self._addEvent(type, fn);
        });
    } else {
        this._addEvent(aType, aFn);
    }
};

/**
 * 이벤트를 바인드한다.
 * DOM이벤트가 전달되면 jQuery이벤트 처리기를 이용하고
 * DOM이벤트가 아니면 CustomEvent를 이용한다.
 * @param {string} type 이벤트명과 셀렉터 스트링
 * @param {function} fn 이벤트 핸들러
 * @private
 */
UIController.prototype._addEvent = function(type, fn) {
    var parsedType = this._parseEventType(type),
        event = parsedType[0],
        selector = parsedType[1];

    if (selector) {
        this.$el.on(event, selector, fn);
    } else {
        this.$el.on(event, fn);
    }
};

/**
 * 이벤트를 지운다.
 * DOM이벤트가 전달되면 jQuery이벤트 처리기를 이용하고
 * DOM이벤트가 아니면 CustomEvent를 이용한다.
 * @param {string} type 이벤트명과 셀렉터 스트링
 * @param {function} fn 이벤트 핸들러
 */
UIController.prototype.off = function(type, fn) {
    var parsedType,
        event,
        selector;

    if (type) {
        parsedType = this._parseEventType(type);
        event = parsedType[0];
        selector = parsedType[1];

        if (selector) {
            this.$el.off(event, selector, fn);
        } else {
            this.$el.off(event, fn);
        }
    } else {
        this.$el.off();
    }
};

/**
 * 이벤트 바안딩 텍스트를 전달받아 이벤트 명과 셀렉터로 분리해준다.
 * 'click td' => ['click', 'td]
 * @param {string} type 이벤트쿼리 스트링
 * @returns {array} Event, Selector
 */
UIController.prototype._parseEventType = function(type) {
    var splitType = type.split(' '),
        event = splitType.shift(),
        selector = splitType.join(' ');

    return [event, selector];
};

/**
 * 파라메터로 넘어오는 이벤트 리스트 혹은 this.events를 토대로 dom 이벤트를 한꺼번에 바인드한다.
 * @param {object} events 이벤트 목록
 */
UIController.prototype.attachEvents = function(events) {
    var self = this,
        handler,
        eventlist = events || this.events;

    if (eventlist) {
        util.forEach(eventlist, function(handlerName, type) {
            if (self[handlerName]) {
                type = self.getEventNameWithNamespace(type);
                handler = util.bind(self[handlerName], self);
                self.on(type, handler);
            } else {
                throw new Error('UIController#attachEvents: ' + handlerName + '란 메서드가 없습니다.');
            }
        });
    }
};

/**
 * attachEvents로 걸린 이벤트핸들러를 한꺼번에 해제한다.
 */
UIController.prototype.detachEvents = function() {
    this.$el.off('.uicEvent' + this.id);
};

/**
 * UIC의 rootElement인 this.$el을 설정한다 인자가 없으면 생성한다.
 * @param {jQuery} $el 설정할 엘리먼트
 */
UIController.prototype.setRootElement = function($el) {
    var className = this.className,
        tagName = this.tagName;

    if (!$el) {
        className = className || ('uic' + this.id);
        tagName = tagName;
        $el = $('<' + tagName + ' class="' + className + '"/>');
    }
    this.$el = $el;
};

/**
 * 커스텀 이벤트를 발생시킨다.
 */
UIController.prototype.trigger = function() {
    this.$el.trigger.apply(this.$el, arguments);
};

/**
 * id를 생성한다.
 * @private
 */
UIController.prototype._initID = function() {
    this.id = _id;
    _id += 1;
};

/**
 * 이벤트종류에 네임스페이스를 더한다.
 * "click" -> "click.uicEvent23"
 * @param {string} event 이벤트 핸들러, 셀릭터 스트링
 * @returns {string} 네임스페이스가 포함된 이벤트스트링
 */
UIController.prototype.getEventNameWithNamespace = function(event) {
    var eventSplited = event.split(' ');
    eventSplited[0] += ('.uicEvent' + this.id);
    return eventSplited.join(' ');
};

/**
 * uic안에 서브uic를 삽입한다.
 * 두번째 인자로 셀렉터를 넘기면 this.$el이 아닌 셀렉터에 해당하는 엘리먼트를 찾아서 그엘리먼트에 서브 UIC의 엘리먼트를 붙인다.
 * @param {UIController} uic UIController instance
 * @param {string} [targetSEL] 셀렉터
 */
UIController.prototype.addUIC = function(uic, targetSEL) {
    if (targetSEL) {
        this.$el.find(targetSEL).append(uic.$el);
    } else {
        this.$el.append(uic.$el);
    }
};

/**
 * 엘리먼트의 이벤트를 해제 후 제거한다.
 */
UIController.prototype.remove = function() {
    this.detachEvents();
    this.$el.remove();
};

/**
 * 소멸자
 */
UIController.prototype.destroy = function() {
    this.remove();
    this.detachEvents();

    util.forEachOwnProperties(this, function(value, key) {
        this[key] = null;
    }, this);
};

/**
 * UIController를 확장해 새 생성자를 만든다.
 * @param {Object} props properties to extend
 * @returns {UIController} 생성자
 */
UIController.extend = function(props) {
    var newUIC = util.defineClass(this, props);
    newUIC.extend = UIController.extend;
    return newUIC;
};

module.exports = UIController;
