var Helpers = require('../modules/helpers');
var _ = require('lodash');

var inactiveDelay = 1000; // ms

function User( name ) {

    this._id = Helpers.idGenerator();
    this.name = name || Helpers.randomName();

    this.socket = null;

    this.position = [0,30,0];
    this.rotation = [0,0,0,"XYZ"];

    this.heartTime = null;

    this.bot = false;

    this.speed = 10;
}

User.prototype.toPublic = function() {
    var publicUser = {};
    publicUser._id = this._id;
    publicUser.name = this.name;
    publicUser.bot = this.bot;
    publicUser.position = this.position;
    publicUser.rotation = this.rotation;

    return publicUser;
};

User.prototype.isInactive = function() {
    if(!this.heartTime) return false;

    var now = new Date().getMilliseconds();
    return (now - this.heartTime) > inactiveDelay;
};

User.prototype.heartBeat = function() {
    this.heartTime = new Date().getMilliseconds();
};

User.prototype.move = function(newState) {

    if(!this.isCorrectMove(newState.position)) {
        Debug.log("Incorrect move detected for player " + this._id);
        return;
    }

    this.position = newState.position;
    this.rotation = newState.rotation;
};

User.prototype.isCorrectMove = function(newPos) {
    var distance = Helpers.distanceBetween(this.position, newPos);

    return (distance < this.speed);
};

module.exports = User;
