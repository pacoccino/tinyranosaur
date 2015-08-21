var _ = require('lodash');
var Users = require('../models/users');

var Game = {};

var listenUpdatePosition = function(io, user) {

    return function(position) {
        console.log('Updating position of '+user._id + ":" + position);
        user.position = position;

        var options = user.toPublic();
        //user.socket.broadcast.emit('update position', options);
        io.emit('update position', options);
    };
};

var diffuseGameState = function(user) {
    Users.getAllPublic(function(users) {
        //users = _.reject(users, {_id: user._id});
        var state = {
            me: user.toPublic(),
            users: users
        };
        user.socket.emit('game state', state);
    });
};


var announcePlayer = function(io, user) {
    user.socket.broadcast.emit('new player', user.toPublic());
};

Game.listen = function(io) {
    var gameIo = io.of('/game');

    gameIo.on('connect', function(socket) {
        Users.create(function(user) {
            user.socket = socket;

            diffuseGameState(user);
            announcePlayer(gameIo, user);

            socket.on('update position', listenUpdatePosition(gameIo, user));
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
