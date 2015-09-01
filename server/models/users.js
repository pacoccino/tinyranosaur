var Tyranosaur = require('./tyranosaur');
var User = require('./user');
var _ = require('lodash');

function Users() {
    this.list = [];
}

Users.prototype.create = function(cb) {
    var user = new User();
    this.list.push(user);
    cb(user);
};

Users.prototype.delete = function(id, cb) {
    var userIndex = _.findIndex(this.list, {_id: id});
    this.list.splice(userIndex, 1);
    cb && cb();
};

Users.prototype.getAll = function(cb) {
    cb(this.list);
};

Users.prototype.getAllPublic = function(cb) {
    var publicList = [];

    for(var i=0; i<this.list.length; i++) {
        var user = this.list[i];
        var publicUser = user.toPublic();

        publicList.push(publicUser);
    }

    cb(publicList);
};

Users.prototype.getAllSync = function() {
    return this.list;
};


module.exports = Users;
