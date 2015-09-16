var Helpers =  require('../modules/helpers');
var User =  require('./user');
var Map =  require('../modules/map');
var Constants = require('../modules/constants');

var chanceToChange = 0.02;

function Bot() {

    User.call(this);

    this.bot = true;

    this.position = Bot.randomPosition();
    this.position[1] = 30;
    this.direction = [0,0,1];

    this.speed = 50;

    this.moveTimer = new Helpers.deltaTimer();
}

Bot.prototype = Object.create(User.prototype);
Bot.prototype.constructor = Bot;

// Class functions

Bot.prototype.stepIa = function() {
    var deltaTime = this.moveTimer.getDelta();

    this.decideDirection();

    this.moveBot(deltaTime);
};

Bot.prototype.moveBot = function(deltaTime) {

    var move;
    var step = deltaTime / 1000;

    move = Helpers.scaleVect(this.speed * step, this.direction);
    var newPosition = Helpers.addVect(this.position, move);

    if(Math.abs(newPosition[0]) > Constants.mapSize.x || Math.abs(newPosition[2]) > Constants.mapSize.z) {
        move = Helpers.scaleVect(-1, this.direction);
        newPosition = Helpers.addVect(this.position, move);
    }

    this.position = newPosition;
};

Bot.prototype.decideDirection = function() {

    if(Math.random() < chanceToChange) {
        var destination = Bot.randomPosition();
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

    this.rotation[1] = -Math.atan2(direction[2], direction[0]);
};

// Static functions
Bot.randomPosition = function() {
    var waypoint = [];

    var sign;
    sign = Helpers.generateSign();
    waypoint[0] = sign * Helpers.generateInteger(Constants.mapSize.x);

    waypoint[1] = 0;

    sign = Helpers.generateSign();
    waypoint[2] = sign * Helpers.generateInteger(Constants.mapSize.y);

    return waypoint;
};


module.exports = Bot;
