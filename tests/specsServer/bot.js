var expect = require("chai").expect;

var Bot = require("../../server/models/bot.js");
var Helpers = require("../../server/modules/helpers.js");

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
        expect(bot.position).to.exist;
        expect(bot.rotation).to.exist;
        expect(bot._speed).to.exist;
        expect(bot.position[0]).to.equal(0);
        expect(bot.rotation[0]).to.equal(0);
        expect(bot._speed).to.equal(0.1);
    });

    it('decide direction', function() {
        var bot = new Bot();

        var direction = bot.direction;

        bot.decideDirection();

        expect(bot.direction).to.equal(direction);
    });

    it('stepIa direction', function() {
        var bot = new Bot();
        bot.decideDirection = function() {};

        var direction = bot.direction;
        var position = bot.position;
        var speed = bot._speed;

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

});
