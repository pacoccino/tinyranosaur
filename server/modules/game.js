var _ = require('lodash');
var Users = require('../models/users');

var Game = {};

var listenUpdatePosition = function(io, user) {

    return function(position) {
        user.tyranosaur.move(position);

        var options = user.toPublic();
        Users.getAll(function(users) {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                user.socket.volatile.emit('player update', options);
            }
        });

        //io.emit('player update', options);
    };
};

var diffuseGameState = function(user) {
    Users.getAllPublic(function(users) {
        var state = {
            users: users
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
        Users.create(function(user) {
            user.socket = socket;

            welcomePlayer(user, function() {
                diffuseGameState(user);
                announcePlayer(gameIo, user);

                socket.on('player update', listenUpdatePosition(gameIo, user));
            });
       })
    });
/*
    gameIo.on('disconnect', function(socket) {
        var user = Users.getBySocket(socket);

        if(user) {
            Users.delete(user._id);
        }
        else {
            console.error('Unable to Users.getBySocket');
        }
    });*/
};

module.exports = Game;
