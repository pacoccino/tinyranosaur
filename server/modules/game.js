var _ = require('lodash');
var Users = require('../models/users');
var Bot = require('../models/bot');

function Game() {
    this.users = new Users();
    this.io = null;
    this.gameUpdater = null;
    this.bots = [];
}

Game.prototype.listenUpdatePosition = function(io, user) {

    var self = this;
    return function(position) {
        user.tyranosaur.move(position);

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
        for (var i = 0; i < self.bots.length; i++) {
            var bot = self.bots[i];
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
            });

            socket.on('disconnect', function() {

                self.users.delete(user._id);
                self.io.emit('player leave', user._id);
            });
        });
    });
};

Game.prototype.launchGame = function() {
    var updateInterval = 50;
    var self = this;
    var updater = function() {
        self.updateGame.call(self);
    };

    this.gameUpdater = setInterval(updater, updateInterval);
};

Game.prototype.stopGame = function() {
    clearInterval(this.gameUpdater);
    this.gameUpdater = null;
};

Game.prototype.updateGame = function() {
    this.disconnectInactivePlayers();
    this.liveBots();
};

Game.prototype.disconnectInactivePlayers = function() {

};

Game.prototype.liveBots = function() {

    if (this.users.getAllSync().length === 0 && this.bots.length > 0) {
        for (var i = 0; i < this.bots.length; i++) {
            var bot = this.bots[i];
            this.io.emit('player leave', bot[0]._id);
        }
        this.bots.splice(0, this.bots.length);
    }
    else if (this.users.getAllSync().length !== 0 && this.bots.length === 0) {
        var bot = new Bot()
        this.bots.push(bot);
        this.io.emit('player new', bot.toPublic());
    }

    for (var i = 0; i < this.bots.length; i++) {
        var bot = this.bots[i];
        bot.stepIa();

        var botPublic = bot.toPublic();
        this.io.emit('player update', botPublic);
    }

};

module.exports = Game;
