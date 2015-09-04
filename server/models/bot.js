var Helpers =  require('../modules/helpers');
var User =  require('./user');
var Map =  require('../modules/map');

function Bot() {

    User.call(this);

    this.bot = true;

    this.direction = [0,0,1];
}

Bot.prototype = Object.create(User.prototype);
Bot.prototype.constructor = Bot;

// Class functions

Bot.prototype.stepIa = function() {
    this.decideDirection();

    var move;
    var step = Helpers.clockDelta() / 1000;

    move = Helpers.scaleVect(this.speed * step, this.direction);
    this.position = Helpers.addVect(this.position, move);
};

Bot.prototype.decideDirection = function() {

    var chanceToChange = 0.05;
    if(Math.random() < chanceToChange) {
        var destination = Bot.generateWaypoint();
        this.setDirectionTo(destination);
    }
};

Bot.prototype.setDirectionTo = function(destination) {
    var position = this.position;

    var direction = [];
    direction.push(destination[0] - position[0]);
    direction.push(0);
    direction.push(destination[2] - position[2]);

    this.direction = Helpers.normalize(direction);

    this.rotation[1] = Math.atan2(direction[2], direction[0]);
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
