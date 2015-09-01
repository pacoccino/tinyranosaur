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

    it('welcomes player', function(done) {

        socket.on('welcome', function(data) {
            expect(data._id).to.be.defined;
            expect(data.name).to.be.defined;
            expect(data.name.length).to.gt(0);
            done();
        });
        socket.socketClient.emit('connect', socket.socketClient);

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
        socket.socketClient.emit('connect', socket.socketClient);
    });

    it('disconnect', function(done) {

        var myId;
        socket.on('welcome', function(data) {
            myId = data._id;
        });

        socket.socketClient.on('player leave', function(data) {
            expect(data).to.equal(myId);
            done();
        });

        // TODO detect broadcast and user deletion

        socket.socketClient.emit('connect', socket.socketClient);
        socket.emit('disconnect');
    });

    it('starts game', function() {
        expect(game.gameUpdater).to.be.null;
        game.launchGame();
        expect(game.gameUpdater).not.to.be.null;
    });

    it('stops game', function() {
        game.launchGame();
        game.stopGame();
        expect(game.gameUpdater).to.be.null;
    });

    it('no bots when no players', function(done) {

        game.launchGame();
        setTimeout(function() {
            expect(game.bots.length).to.equal(0);
            done();
        }, 1000);
    });

    it('one bot when player', function(done) {

        socket.socketClient.emit('connect', socket.socketClient);

        game.launchGame();

        setTimeout(function() {
            expect(game.bots.length).to.gt(0);
            done();
        }, 1000);
    });

    it('bot sent to player', function(done) {

        socket.socketClient.emit('connect', socket.socketClient);

        game.launchGame();

        socket.socketClient.on('player new', function(player) {
            expect(player._id).to.equal(game.bots[0]._id);
            expect(player.bot).to.be.true;
            done();
        });

    });

    it('bot updated to player', function(done) {

        socket.socketClient.emit('connect', socket.socketClient);

        game.launchGame();

        socket.socketClient.on('player update', function(player) {

            expect(player._id).to.equal(game.bots[0]._id);
            done();
        });

    });

});
