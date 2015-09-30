var expect = require("chai").expect;

var Bot = require("../../server/models/bot.js");
var Helpers = require("../../server/modules/helpers.js");
var Map = require("../../server/modules/map.js");
var Constants = require("../../server/modules/constants.js");

describe('Bot', function() {

    it('should create', function() {
        var bot = new Bot();

        expect(bot).to.exist;
        expect(bot._id).to.exist;
        expect(bot.name).to.exist;
        expect(bot.bot).to.be.true;
        expect(bot.speed).to.equal(50);
        expect(bot.direction[0]).to.equal(0);
        expect(bot.direction[1]).to.equal(0);
        expect(bot.direction[2]).to.equal(1);

        expect(Math.abs(bot.position[0])).to.be.lte(Constants.mapSize.x);
        expect(bot.position[1]).to.be.equal(0);
        expect(Math.abs(bot.position[2])).to.be.lte(Constants.mapSize.y);
    });

    it('decide direction', function() {
        var bot = new Bot();

        bot.decideDirection();
        // TODO
    });

    it('moves bot', function() {
        var bot = new Bot();

        var direction = bot.direction;
        var position = bot.position;
        var speed = bot.speed;

        bot.moveBot(1);

        var expPosition = [
            position[0] + speed * direction[0],
            position[1] + speed * direction[1],
            position[2] + speed * direction[2]
        ];

        position = bot.position;

        expect(position[0]).to.equal(expPosition[0]);
        expect(position[1]).to.equal(expPosition[1]);
        expect(position[2]).to.equal(expPosition[2]);
    });

    it('stepIa direction w/ 2 instances', function() {
        var bot = new Bot();
        var bot2 = new Bot();

        bot.position = [15,30,15];
        bot2.position = [35,30,35];
        bot.direction = [1,0,0];
        bot2.direction = [0,0,1];

        var direction = bot.direction;
        var position = bot.position;
        var speed = bot.speed;

        var direction2 = bot2.direction;
        var position2 = bot2.position;
        var speed2 = bot2.speed;

        bot.moveBot(1);
        bot2.moveBot(1);

        var expPosition = [
            position[0] + speed * direction[0],
            position[1] + speed * direction[1],
            position[2] + speed * direction[2]
        ];

        position = bot.position;

        expect(position[0]).to.equal(expPosition[0]);
        expect(position[1]).to.equal(expPosition[1]);
        expect(position[2]).to.equal(expPosition[2]);

        var expPosition2 = [
            position2[0] + speed * direction2[0],
            position2[1] + speed * direction2[1],
            position2[2] + speed * direction2[2]
        ];

        position2 = bot2.position;

        expect(position2[0]).to.equal(expPosition2[0]);
        expect(position2[1]).to.equal(expPosition2[1]);
        expect(position2[2]).to.equal(expPosition2[2]);
    });

    it('generates Waypoint', function() {
        var waypoint = Bot.randomPosition();

        expect(waypoint).to.be.defined;
        expect(waypoint.length).to.be.defined;
        expect(waypoint.length).to.be.equal(3);
        expect(Math.abs(waypoint[0])).to.be.lte(Map.sizeX);
        expect(Math.abs(waypoint[2])).to.be.lte(Map.sizeZ);
        expect(Math.abs(waypoint[1])).to.be.equal(0);
    });

    it('sets direction z', function() {
        var bot = new Bot();
        bot.position = [0,0,0];
        var waypoint = [0,0,5];

        bot.setDirectionTo(waypoint);

        var direction = bot.direction;
        var expDirection = [0,0,1];

        expect(direction[0]).to.equal(expDirection[0]);
        expect(direction[1]).to.equal(expDirection[1]);
        expect(direction[2]).to.equal(expDirection[2]);

        var rotationY = bot.rotation[1];
        expect(rotationY).to.equal(-Math.PI/2);
    });

    it('sets direction x', function() {
        var bot = new Bot();
        bot.position = [0,0,0];
        var waypoint = [5,0,0];

        bot.setDirectionTo(waypoint);

        var direction = bot.direction;
        var expDirection = [1,0,0];

        expect(direction[0]).to.equal(expDirection[0]);
        expect(direction[1]).to.equal(expDirection[1]);
        expect(direction[2]).to.equal(expDirection[2]);

        var rotationY = bot.rotation[1];
        expect(rotationY).to.equal(0);
    });


    it('sets direction -x', function() {
        var bot = new Bot();
        bot.position = [0,0,0];
        var waypoint = [-5,0,0];

        bot.setDirectionTo(waypoint);

        var direction = bot.direction;
        var expDirection = [-1,0,0];

        expect(direction[0]).to.equal(expDirection[0]);
        expect(direction[1]).to.equal(expDirection[1]);
        expect(direction[2]).to.equal(expDirection[2]);

        var rotationY = bot.rotation[1];
        expect(rotationY).to.equal(-Math.PI);
    });

    it('sets direction x-z', function() {
        var bot = new Bot();
        bot.position = [0,0,0];
        var waypoint = [5,0,-5];

        bot.setDirectionTo(waypoint);

        var direction = bot.direction;
        var expDirection = [Math.sqrt(1/2),0,-Math.sqrt(1/2)];

        expect(direction[0]).to.closeTo(expDirection[0], 0.01);
        expect(direction[1]).to.closeTo(expDirection[1], 0.01);
        expect(direction[2]).to.closeTo(expDirection[2], 0.01);

        var rotationY = bot.rotation[1];
        expect(rotationY).to.equal(Math.PI/4);
    });

    it('sets direction x-z offset', function() {
        var bot = new Bot();
        bot.position = [10,0,-10];
        var waypoint = [5,0,-5];

        bot.setDirectionTo(waypoint);

        var direction = bot.direction;
        var expDirection = [-Math.sqrt(1/2),0,Math.sqrt(1/2)];

        expect(direction[0]).to.closeTo(expDirection[0], 0.01);
        expect(direction[1]).to.closeTo(expDirection[1], 0.01);
        expect(direction[2]).to.closeTo(expDirection[2], 0.01);

        var rotationY = bot.rotation[1];
        expect(rotationY).to.equal(-3*Math.PI/4);
    });

});
