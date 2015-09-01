var Game = require("../../server/modules/game");
var Users = require("../../server/models/users");

var expect = require("chai").expect;
var should = require('chai').should();

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
            expect(data._id.length).to.equal(10);
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

});
