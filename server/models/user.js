var Tyranosaur = require('./tyranosaur');
var Helpers = require('../modules/helpers');
var _ = require('lodash');

var inactiveDelay = 1000; // ms

function User( name ) {

    this._id = Helpers.idGenerator();
    this.name = name || Helpers.randomName();

    this.socket = null;

    this.tyranosaur = new Tyranosaur();
    this.tyranosaur.position[1] = 30;

    this.heartTime = null;

    this.bot = false;

    this.speed = 10;
}

User.prototype.toPublic = function() {
    var publicUser = {};
    publicUser._id = this._id;
    publicUser.name = this.name;
    publicUser.bot = this.bot;
    publicUser.tyranosaur = this.tyranosaur.getState();

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

    if(!this.isCorrectMove(newState.position)) return;

    this.tyranosaur.move(newState);
};

User.prototype.isCorrectMove = function(newPos) {
    var distance = Helpers.distanceBetween(this.tyranosaur.position, newPos);

    return (distance < this.speed);
};

module.exports = User;
