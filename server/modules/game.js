var _ = require('lodash');
var Users = require('../models/users');

function Game() {
    this.users = new Users();
    this.io = null;
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
    this.users.getAllPublic(function(users) {
        var state = {
            users: users
        };
        user.socket.emit('game state', state);
    });
};

Game.prototype.welcomePlayer = function(user, welcomed) {
    var welcomeMessage = {};
    welcomeMessage._id = user._id;
    welcomeMessage.name = user.name;
    user.socket.emit('welcome', welcomeMessage, welcomed);
};


Game.prototype.announcePlayer = function(io, user) {
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
                self.announcePlayer(self.io, user);

                socket.on('player update', self.listenUpdatePosition(self.io, user));
            });

            socket.on('disconnect', function() {

                self.users.delete(user._id);
                self.io.emit('player leave', user._id);
            });
        });
    });
};

module.exports = Game;
