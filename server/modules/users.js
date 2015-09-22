var User = require('./../models/user');
var _ = require('lodash');

function Users(game) {
    this.game = game;
    this.users = [];
}

Users.prototype.create = function(cb) {
    var user = new User();

    this.users.push(user);
    this.game.room.push(user);

    cb && cb(user);


};


Users.prototype.delete = function(id, cb) {

    var userIndex = _.findIndex(this.users, {_id: id});
    this.users.splice(userIndex, 1);

    var roomIndex = _.findIndex(this.game.room, {_id: id});
    this.game.room.splice(roomIndex, 1);

    cb && cb();
};

Users.prototype.getAll = function(cb) {
    cb(this.users);
};

Users.prototype.getById = function(id) {
    var user = _.find(this.users, {_id: id});

    return user;
};

Users.prototype.getAllPublic = function(cb) {
    var publicList = [];

    for(var i=0; i<this.users.length; i++) {
        var user = this.users[i];
        var publicUser = user.toPublic();

        publicList.push(publicUser);
    }

    cb(publicList);
};

Users.prototype.getAllSync = function() {
    return this.users;
};


module.exports = Users;
