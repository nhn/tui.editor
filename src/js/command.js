'use strict';

function Command(name, type) {
    this.name = name;
    this.type = type;
    this.keyMap = [];
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

Command.prototype.setKeyMap = function(win, mac) {
    this.keyMap[0] = win;
    this.keyMap[1] = mac;
};

Command.prototype.responder = function() {
    console.log(this);
    this.setup.apply(this, arguments);
    return this.exec();
};

Command.TYPE = {
    MD: 0,
    WW: 1
};

module.exports = Command;
