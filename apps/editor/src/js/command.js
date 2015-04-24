'use strict';

var util = ne.util;

var Command = util.defineClass({
    init: function Command(name, type) {
        this.name = name;
        this.type = type;

        this.initResponder();
    },
    getName: function() {
        return this.name;
    },
    getType: function() {
        return this.type;
    },
    isMDType: function() {
        return this.type === Command.TYPE.MD;
    },
    isGlobalType: function() {
        return this.type === Command.TYPE.GB;
    },
    setKeyMap: function(win, mac) {
        this.keyMap = [];
        this.keyMap[0] = win;
        this.keyMap[1] = mac;
    },
    _responder: function() {
        if (this.setup) {
            this.setup.apply(this, arguments);
        }

        return this.exec.apply(this, arguments);
    },
    initResponder: function() {
        var self = this;

        this.responder = function() {
            return self._responder.apply(self, arguments);
        };
    }
});

Command.TYPE = {
    MD: 0,
    WW: 1,
    GB: 2
};

Command.extend = function(props) {
    var Child = util.defineClass(this, props);
    Child.extend = Command.extend;
    return Child;
};

module.exports = Command;
