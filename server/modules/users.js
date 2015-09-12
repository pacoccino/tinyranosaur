var User = require('./../models/user');
var _ = require('lodash');

function Users() {
    this.users = [];
    this.bots = [];
}

Users.prototype.create = function(cb) {
    var user = new User();
    this.users.push(user);
    cb(user);
};

Users.prototype.addBot = function(bot) {
    this.bots.push(bot);
};

Users.prototype.delete = function(id, cb) {
    var userIndex = _.findIndex(this.users, {_id: id});
    this.users.splice(userIndex, 1);
    cb && cb();
};

Users.prototype.getAll = function(cb) {
    cb(this.users);
};

Users.prototype.getById = function(id) {
    var user = _.find(this.users, {_id: id});
    var bot = _.find(this.bots, {_id: id});

    return user || bot;
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
