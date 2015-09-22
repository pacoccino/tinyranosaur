var _ = require('lodash');
var Users = require('./users');
var Bots = require('../modules/bots');
var Debug = require('../modules/debug');
var Helpers = require('../modules/helpers');
var GameListener = require('../modules/gamelistener');

function Game() {
    this.io = null;

    this.gameUpdater = null;
    this.gameListener = new GameListener(this);

    this.users = new Users(this);
    this.bots = new Bots(this);

    this.room = [];
}

Game.prototype.listen = function(io) {
    this.io = io.of('/game');
    var self = this;

    this.io.on('connect', function(socket) {
        self.users.create(function(user) {
            user.socket = socket;

            self.gameListener.register(user);

            socket.on('disconnect', function() {
                self.users.delete(user._id);

                self.gameListener.deregister.apply(self.gameListener, [user]);
            });

            self.launchGame();
        });

        socket.on('error', function(e) {
           console.log("Socket error: ", e)
        });
    });
};

Game.prototype.launchGame = function() {
    if(this.gameUpdater) return;

    var updateInterval = 50;
    var self = this;
    var updater = function() {
        self.updateGame.call(self);
    };

    this.gameUpdater = setInterval(updater, updateInterval);
    this.bots.populateBots();
    Debug.log("Game started with " + this.bots.bots.length + " bots");
};

Game.prototype.stopGame = function() {
    clearInterval(this.gameUpdater);
    this.gameUpdater = null;

    Debug.log("Game stopped");
};

Game.prototype.updateGame = function() {
    this.disconnectInactivePlayers();
    this.bots.liveBots();
};

Game.prototype.disconnectInactivePlayers = function() {

    var disconnect = [];
    var list = this.users.getAllSync();
    for (var i = 0; i < list.length; i++) {
        var user = list[i];

        if(user.isInactive()) {
            disconnect.push(user);
        }
    }

    for (var j = 0; j < disconnect.length; j++) {
        var userToDelete = disconnect[j];
        this.users.delete(userToDelete._id);
    }

    if(list.length === 0) {
        this.bots.killBots();
        this.stopGame();
    }
};

Game.prototype.getPublicRoom = function(cb) {
    var publicList = [];

    for(var i=0; i<this.room.length; i++) {
        var character = this.room[i];
        var publicCharacter = character.toPublic();

        publicList.push(publicCharacter);
    }

    cb(publicList);
};

module.exports = Game;
