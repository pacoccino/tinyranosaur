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

    this.users = new Users();
    this.bots = new Bots(this, this.users);
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

                self.gameListener.deregister.apply(self, [user]);
            });

            self.launchGame();
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
    this.bots.createBots();
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

    var users = this.users.users;
    var disconnect = [];
    for (var i = 0; i < users.length; i++) {
        var user = users[i];

        if(user.isInactive()) {
            disconnect.push(i);
        }
    }

    for (var j = 0; j < disconnect.length; j++) {
        var userIndex = disconnect[j];
        users.splice(userIndex, 1);
    }

    if(users.length === 0) {
        this.bots.killBots();
        this.stopGame();
    }
};

module.exports = Game;
