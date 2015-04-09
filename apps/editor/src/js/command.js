'use strict';

function Command(name, type) {
    this.name = name;
    this.type = type;
    this.keyMap = [];

    this.initResponder();
}

Command.prototype.getName = function() {
    return this.name;
};

Command.prototype.getType = function() {
    return this.type;
};

Command.prototype.isMDType = function() {
    return this.type === Command.TYPE.MD;
};

Command.prototype.isGlobalType = function() {
    return this.type === Command.TYPE.GB;
};

Command.prototype.setKeyMap = function(win, mac) {
    this.keyMap[0] = win;
    this.keyMap[1] = mac;
};

Command.prototype._responder = function() {
    if (this.setup) {
        this.setup.apply(this, arguments);
    }

    return this.exec();
};

Command.prototype.initResponder = function() {
    var self = this;

    this.responder = function() {
        return self._responder.apply(self, arguments);
    };
};

Command.TYPE = {
    MD: 0,
    WW: 1,
    GB: 2
};

module.exports = Command;
