var Tyranosaur =  require('./tyranosaur');
var Helpers =  require('../modules/helpers');

function Bot() {

    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0, 'xyz'];
    this.direction = [0, 0, 1];

    this._speed = 0.1;
}

Bot.prototype.move = Tyranosaur.prototype.move;
Bot.prototype.getState = Tyranosaur.prototype.getState;

Bot.prototype.decideDirection = function() {

};

Bot.prototype.stepIa = function() {
    this.decideDirection();

    var move;
    var step = Helpers.clockDelta() / 1000;

    move = Helpers.scaleVect(this._speed * step, this.direction);
    this.position = Helpers.addVect(this.position, move);
};

module.exports = Bot;
