var Tyranosaur =  require('./tyranosaur');
var Helpers =  require('../modules/helpers');
var Map =  require('../modules/map');

function Bot() {

    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0, 'xyz'];
    this.direction = [0, 0, 1];

    this._speed = 0.1;
}

// Inheritance

Bot.prototype.move = Tyranosaur.prototype.move;
Bot.prototype.getState = Tyranosaur.prototype.getState;

// Class functions

Bot.prototype.decideDirection = function() {

    var chanceToChange = 0.05;
    if(Math.random() < chanceToChange) {
        generateWayPoint();
        setDirectionTo();
    }
};

Bot.prototype.stepIa = function() {
    this.decideDirection();

    var move;
    var step = Helpers.clockDelta() / 1000;

    move = Helpers.scaleVect(this._speed * step, this.direction);
    this.position = Helpers.addVect(this.position, move);
};

Bot.prototype.setDirectionTo = function(destination) {
    var position = this.position;

    var direction = [];
    direction.push(destination[0] - position[0]);
    direction.push(destination[1] - position[1]);
    direction.push(destination[2] - position[2]);

    this.direction = Helpers.normalize(direction);
};

// Static functions
Bot.generateWaypoint = function() {
    var waypoint = [];

    var sign;
    sign = Helpers.generateSign();
    waypoint[0] = sign * Helpers.generateInteger(Map.sizeX);

    waypoint[1] = 0;

    sign = Helpers.generateSign();
    waypoint[2] = sign * Helpers.generateInteger(Map.sizeZ);

    return waypoint;
};

module.exports = Bot;
