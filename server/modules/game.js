var _ = require('lodash');
var Users = require('../models/users');

var Game = {};

Game.users = new Users();

var listenUpdatePosition = function(io, user) {

    return function(position) {
        user.tyranosaur.move(position);

        var options = user.toPublic();
        Game.users.getAll(function(userList) {
            for (var i = 0; i < userList.length; i++) {
                var user = userList[i];
                user.socket.volatile.emit('player update', options);
            }
        });
    };
};

var diffuseGameState = function(user) {
    Game.users.getAllPublic(function(users) {
        var state = {
            users: Game.users
        };
        user.socket.emit('game state', state);
    });
};

var welcomePlayer = function(user, welcomed) {
    var welcomeMessage = {};
    welcomeMessage._id = user._id;
    welcomeMessage.name = user.name;
    user.socket.emit('welcome', welcomeMessage, welcomed);
};


var announcePlayer = function(io, user) {
    user.socket.broadcast.emit('player new', user.toPublic());
};

Game.listen = function(io) {
    var gameIo = io.of('/game');

    gameIo.on('connect', function(socket) {
        Game.users.create(function(user) {
            user.socket = socket;

            welcomePlayer(user, function() {
                diffuseGameState(user);
                announcePlayer(gameIo, user);

                socket.on('player update', listenUpdatePosition(gameIo, user));
            });

            socket.on('disconnect', function(socket) {

                Game.users.delete(user._id);
                gameIo.emit('player leave', user._id);
            });
        });
    });

    gameIo.on('atest', function(socket) {
        console.log('test' + socket)
        Game.test = true
    });
};

module.exports = Game;
