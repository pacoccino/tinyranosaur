var _ = require('lodash');
var Users = require('../models/users');

var Game = {};

var listenUpdatePosition = function(io, user) {

    return function(position) {
        user.tyranosaur.move(position);

        var options = user.toPublic();
        io.emit('player update', options);
    };
};

var diffuseGameState = function(user) {
    Users.getAllPublic(function(users) {
        var state = {
            me: user.toPublic(),
            users: users
        };
        user.socket.emit('game state', state);
    });
};


var announcePlayer = function(io, user) {
    user.socket.broadcast.emit('player new', user.toPublic());
};

Game.listen = function(io) {
    var gameIo = io.of('/game');

    gameIo.on('connect', function(socket) {
        Users.create(function(user) {
            user.socket = socket;

            diffuseGameState(user);
            announcePlayer(gameIo, user);

            socket.on('player update', listenUpdatePosition(gameIo, user));
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
