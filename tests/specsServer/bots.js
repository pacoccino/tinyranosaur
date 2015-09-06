var expect = require("chai").expect;

var Bots = require("../../server/modules/bots.js");
var Constants = require("../../server/modules/constants.js");
var Game = require("../../server/modules/game.js");
var SocketMock = require("socket-io-mock");

var bots, game, socket;
describe('Bots', function() {

    beforeEach(function() {
        socket = new SocketMock();
        game = new Game();
        bots = new Bots(game);
        game.listen(socket);
    });

    it('should create', function() {

        expect(bots).to.exist;
        expect(bots.game).to.exist;
        expect(bots.bots).to.exist;
        expect(bots.bots.length).to.equal(0);
    });

    it('creates bots', function() {

        expect(bots.bots.length).to.equal(0);

        bots.createBots();

        expect(bots.bots.length).to.equal(Constants.nbBots);;
    });

    it('kill bots', function() {

        expect(bots.bots.length).to.equal(0);

        bots.createBots();
        bots.killBots();

        expect(bots.bots.length).to.equal(0);

    });


    it('bot sent to player', function(done) {

        var assBots = [];
        var assCount = 0;

        socket.socketClient.on('player new', function(player) {

            expect(player.bot).to.be.true;
            assBots[player._id] = true;
            assCount++;
            if(assCount === bots.bots.length)  {
                var ass = true;
                for (var i = 0; i < bots.length; i++) {
                    var bot = bots.bots[i];
                    ass = ass && assBots[bot._id];
                }
                expect(ass).to.be.true;
                done();

                // deregistration ghetto
                socket.socketClient.on('player new', function() {});
            }
        });

        bots.createBots();
    });

    it('bot updated to player', function(done) {

        var assBots = [];
        var assCount = 0;

        socket.socketClient.on('player update', function(player) {

            expect(player.bot).to.be.true;
            assBots[player._id] = true;
            assCount++;
            if(assCount === bots.bots.length)  {
                var ass = true;
                for (var i = 0; i < bots.length; i++) {
                    var bot = bots.bots[i];
                    ass = ass && assBots[bot._id];
                }
                expect(ass).to.be.true;
                done();

                // deregistration ghetto
                socket.socketClient.on('player update', function() {});
            }
        });

        bots.createBots();
        bots.liveBots();

    });

});
