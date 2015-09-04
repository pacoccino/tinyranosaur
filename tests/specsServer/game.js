var Game = require("../../server/modules/game");
var Users = require("../../server/models/users");

var expect = require("chai").expect;

var SocketMock = require('socket-io-mock');

var socket, game;

describe('Game', function() {
    beforeEach(function() {
        socket = new SocketMock();
        game = new Game();
        game.listen(socket);
    });

    it('construct and listen', function() {

        expect(game.io).to.equal(socket);
        expect(game.users instanceof Users).to.be.true;
    });

    it('creates new player', function() {

        socket.connectClient();

        expect(game.users.getAllSync().length).to.be.equal(1);

    });

    it('welcomes player', function(done) {

        socket.on('welcome', function(data) {
            expect(data._id).to.be.defined;
            expect(data.name).to.be.defined;
            expect(data.name.length).to.gt(0);

            expect(game.users.getAllSync()[0]._id).to.be.equal(data._id);
            done();
        });


        socket.connectClient();

    });

    it('send game state', function(done) {

        var myId;
        socket.on('welcome', function(data) {
            myId = data._id;
        });

        socket.on('game state', function(state) {
            expect(state.users).to.be.defined;
            expect(state.users.length).to.equal(1);
            expect(state.users[0]._id).to.equal(myId);
            done();
        });

        socket.connectClient();
    });

    it('disconnect', function(done) {

        var myId;
        socket.on('welcome', function(data) {
            myId = data._id;
        });

        socket.socketClient.on('player leave', function(data) {
            if(data === myId)  {
                expect(game.users.getAllSync().length).to.be.equal(0);
                done();
            }
        });

        // TODO detect broadcast

        socket.connectClient();
        socket.emit('disconnect');
    });

    it('starts game', function() {
        expect(game.gameUpdater).to.be.null;
        game.launchGame();
        expect(game.gameUpdater).not.to.be.null;
    });

    it('starts game when player connects', function() {
        socket.connectClient();

        expect(game.gameUpdater).not.to.be.null;
    });

    it('stops game', function() {
        game.launchGame();
        game.stopGame();
        expect(game.gameUpdater).to.be.null;
    });

    it('stops game when no players', function(done) {
        socket.connectClient();

        socket.emit('disconnect');

        setTimeout(function() {
            expect(game.gameUpdater).to.be.null;

            done();
        }, 100);
    });

    it('no bots when no players', function(done) {

        socket.connectClient();

        socket.emit('disconnect');

        setTimeout(function() {
            expect(game.bots.length).to.be.equal(0);
            done();
        }, 200);
    });

    it('bots when player', function(done) {

        socket.connectClient();

        setTimeout(function() {
            expect(game.bots.length).to.be.gt(0);
            done();
        }, 200);
    });

    it('bot sent to player', function(done) {

        var assBots = [];
        var assCount = 0;

        socket.socketClient.on('player new', function(player) {

            expect(player.bot).to.be.true;
            assBots[player._id] = true;
            assCount++;
            if(assCount === game.bots.length)  {
                var ass = true;
                for (var i = 0; i < game.bots.length; i++) {
                    var bot = game.bots[i];
                    ass = ass && assBots[bot._id];
                }
                expect(ass).to.be.true;
                done();

                // deregistration ghetto
                socket.socketClient.on('player new', function() {});
            }
        });

        socket.connectClient();
    });

    it('bot updated to player', function(done) {

        socket.connectClient();


        socket.socketClient.on('player update', function(player) {

            expect(player._id).to.equal(game.bots[0]._id);
            done();
        });

    });

    it('receives heartbeat', function() {

        socket.connectClient();

        var t1 = new Date().getMilliseconds();
        socket.emit('heartbeat');
        var t2 = new Date().getMilliseconds();

        var user = game.users.getAllSync()[0];

        expect(user.heartTime).to.be.gte(t1);
        expect(user.heartTime).to.be.lte(t2);
        expect(user.isInactive()).to.be.false;
    });

    it('does not disconnect active players', function() {

        socket.connectClient();

        socket.emit('heartbeat');

        expect(game.users.getAllSync().length).to.be.equal(1);
    });

    it('disconnect inactive players', function() {

        socket.connectClient();
        socket.emit('heartbeat');

        setTimeout(function() {
            expect(game.users.getAllSync().length).to.be.equal(0);
            done();
        }, 1500);

    });

});
