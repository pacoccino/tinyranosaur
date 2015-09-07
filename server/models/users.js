var User = require('./user');
var _ = require('lodash');

function Users() {
    this.users = [];
}

Users.prototype.create = function(cb) {
    var user = new User();
    this.users.push(user);
    cb(user);
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
