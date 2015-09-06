var _ = require('lodash');
var Users = require('../models/users');
var Bots = require('../modules/bots');
var Debug = require('../modules/debug');
var Helpers = require('../modules/helpers');

function Game() {
    this.users = new Users();
    this.io = null;
    this.gameUpdater = null;
    this.bots = new Bots(this);
}

Game.prototype.listenUpdatePosition = function(io, user) {

    var self = this;
    return function(position) {
        user.move(position);

        var options = user.toPublic();
        self.users.getAll(function(userList) {
            for (var i = 0; i < userList.length; i++) {
                var user = userList[i];
                user.socket.volatile.emit('player update', options);
            }
        });
    };
};

Game.prototype.diffuseGameState = function(user) {
    var self = this;
    self.users.getAllPublic(function(users) {
        var state = {
            users: users
        };
        for (var i = 0; i < self.bots.bots.length; i++) {
            var bot = self.bots.bots[i];
            state.users.push(bot.toPublic());
        }
        user.socket.emit('game state', state);
    });
};

Game.prototype.welcomePlayer = function(user, welcomed) {
    var welcomeMessage = {};
    welcomeMessage._id = user._id;
    welcomeMessage.name = user.name;
    user.socket.emit('welcome', welcomeMessage, welcomed);
};


Game.prototype.announcePlayer = function(user) {
    user.socket.broadcast.emit('player new', user.toPublic());
};

Game.prototype.listen = function(io) {
    this.io = io.of('/game');
    var self = this;

    this.io.on('connect', function(socket) {
        self.users.create(function(user) {
            user.socket = socket;

            self.welcomePlayer(user, function() {
                self.diffuseGameState(user);
                self.announcePlayer(user);

                socket.on('player update', self.listenUpdatePosition(self.io, user));
                socket.on('heartbeat', function() {
                    user.heartBeat.call(user);
                });
            });

            socket.on('disconnect', function() {

                self.users.delete(user._id);
                self.io.emit('player leave', user._id);
                delete user;
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

    var users = this.users.getAllSync();
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
