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
        bots = game.bots;
        game.listen(socket);
    });

    it('should create', function() {

        expect(bots).to.exist;
        expect(bots.game).to.equal(game);
        expect(bots.users).not.to.exist;
        expect(bots.bots).to.exist;
        expect(bots.bots.length).to.equal(0);
    });

    it('creates bots', function() {

        expect(bots.bots.length).to.equal(0);

        var newBot = bots.create();

        expect(bots.bots.length).to.equal(1);
        expect(game.room.length).to.equal(1);
        expect(bots.bots[0]).to.equal(newBot);
        expect(game.room[0]).to.equal(newBot);
    });

    it('getById', function() {

        bots.create();
        expect(bots.bots.length).to.equal(1);
        expect(bots.getById(bots.bots[0]._id)).to.equal(bots.bots[0]);
    });

    it('getById noid', function() {

        expect(bots.getById()).to.be.undefined;
    });

    it('poputates Bots', function() {

        bots.populateBots();

        expect(bots.bots.length).to.equal(Constants.nbBots);
    });

    it('removes bot', function() {

        expect(bots.bots.length).to.equal(0);
        var newBot = bots.create();
        expect(bots.bots.length).to.equal(1);
        bots.delete(newBot);
        expect(bots.bots.length).to.equal(0);
        expect(game.room.length).to.equal(0);
    });

    it('removes bot not undef', function() {

        expect(bots.bots.length).to.equal(0);
        bots.create();
        expect(bots.bots.length).to.equal(1);
        bots.delete();
        expect(bots.bots.length).to.equal(1);
        expect(game.room.length).to.equal(1);
    });

    it('removes bot from idf', function() {

        expect(bots.bots.length).to.equal(0);
        var newBot = bots.create();
        expect(bots.bots.length).to.equal(1);
        bots.delete({_id: newBot._id});
        expect(bots.bots.length).to.equal(0);
        expect(game.room.length).to.equal(0);
    });

    it('kill bots', function() {

        expect(bots.bots.length).to.equal(0);
        bots.populateBots();
        expect(bots.bots.length).to.equal(Constants.nbBots);
        expect(game.room.length).to.equal(Constants.nbBots);

        bots.killBots();
        expect(bots.bots.length).to.equal(0);
        expect(game.room.length).to.equal(0);
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

        bots.populateBots();
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

        bots.populateBots();
        bots.liveBots();

    });

});
