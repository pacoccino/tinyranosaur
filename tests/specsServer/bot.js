var expect = require("chai").expect;

var Bot = require("../../server/models/bot.js");
var Helpers = require("../../server/modules/helpers.js");
var Map = require("../../server/modules/map.js");

describe('Bot', function() {

    var savedClockDelta;

    beforeEach(function() {
        savedClockDelta = Helpers.clockDelta;
    });

    afterEach(function() {
        Helpers.clockDelta = savedClockDelta;
    });

    it('should create', function() {
        var bot = new Bot();

        expect(bot).to.exist;
        expect(bot._id).to.exist;
        expect(bot.name).to.exist;
        expect(bot.bot).to.be.true;
        expect(bot.speed).to.equal(10);
        expect(bot.direction[0]).to.equal(0);
        expect(bot.direction[1]).to.equal(0);
        expect(bot.direction[2]).to.equal(1);
    });

    it('decide direction', function() {
        var bot = new Bot();

        bot.decideDirection();
    });

    it('stepIa direction', function() {
        var bot = new Bot();
        bot.decideDirection = function() {};

        var direction = bot.direction;
        var position = bot.position;
        var speed = bot.speed;

        Helpers.clockDelta = function() {
            return 1000;
        };

        bot.stepIa();

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

    it('generates Waypoint', function() {
        var waypoint = Bot.generateWaypoint();

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
    });

});
