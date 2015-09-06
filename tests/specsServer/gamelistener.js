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

        expect(gameListener.io).to.equal(socket);
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

        var bot = new Bot();
        gameListener.game.bots.bots.push(bot);
        gameListener.game.users.users.push(user);



        socket.on('game state', function(state) {
            expect(state.users).to.be.defined;
            expect(state.users.length).to.equal(2);
            expect(state.users[0]._id).to.equal(user._id);
            expect(state.users[1]._id).to.equal(bot._id);
            done();
        });

        gameListener.diffuseGameState(user);
    });

    xit('broadcasts player new', function(done) {

        // TODO create new socket for other players
        socket.socketOthers.on('player new', function(aUser) {
            expect(aUser._id).to.equal(user._id);
            done();
        });

        gameListener.announcePlayer(user);

    });

});
