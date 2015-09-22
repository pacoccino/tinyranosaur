var Game = require("../../server/modules/game");
var Bot = require("../../server/models/bot");
var User = require("../../server/models/user");
var GameListener = require("../../server/modules/gamelistener");
var Bots = require("../../server/modules/bots");

var expect = require("chai").expect;

var SocketMock = require('socket-io-mock');

var socket, game, gameListener, user;

describe('GameListener', function() {
    beforeEach(function() {
        socket = new SocketMock();
        game = new Game();
        game.listen(socket);
        gameListener = new GameListener(game);

        user = new User();
        user.socket = socket.socketClient;
    });

    it('constructs', function() {

        expect(gameListener.game).to.equal(game);
    });

    it('deregisters', function(done) {

        socket.socketClient.on('player leave', function(id) {
            expect(id).to.equal(user._id);
            done();
        });

        gameListener.deregister(user);

    });

    it('welcomes player', function(done) {

        socket.on('welcome', function(data) {
            expect(data._id).to.equal(user._id);
            expect(data.name).to.equal(user.name);

            done();
        });


        gameListener.welcomePlayer(user);
    });


    it('send game state', function(done) {

        gameListener.game.bots.createBot();
        gameListener.game.users.create();

        socket.on('game state', function(state) {
            expect(state.users).to.be.defined;
            expect(state.users.length).to.equal(2);
            expect(state.users[0]._id).to.equal(gameListener.game.bots.bots[0]._id);
            expect(state.users[1]._id).to.equal(gameListener.game.users.users[0]._id);

            done();
        });

        gameListener.diffuseGameState(user);
    });

    /*xit('broadcasts player new', function(done) {

        // TODO create new socket for other players
        socket.socketOthers.on('player new', function(aUser) {
            expect(aUser._id).to.equal(user._id);
            done();
        });

        gameListener.announcePlayer(user);

    });*/

    it('listens player eat', function(done) {
        game.users.create(function(user1) {
            user1.socket = socket.socketClient;
            socket.connectClient();

            socket.socketClient.on('player leave', function(playerId) {
                expect(playerId).to.equal(user1._id);
                done();
            });

            socket.emit('player eat', user1._id);

        });
    });

    it('listens player eat wrong', function(done) {
        game.users.create(function(user1) {
            user1.socket = socket.socketClient;
            socket.connectClient();

            user1.position[0] = 1000;

            socket.socketClient.on('wrong eat', function() {
                done();
            });
            socket.emit('player eat', user1._id);

        });
    });

});
