var Tyranosaur = require('./tyranosaur');

var users = [];

var idGenerator = function() {
    var length = 10;
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var randomName = function() {
    var length = 6;
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxyz';

    text += possible.charAt(Math.floor(Math.random() * possible.length)).toUpperCase();
    for (var i = 1; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var _userList = [];

function User( name ) {
    var self = this;

    self._id = idGenerator();
    self.name = name || randomName();
    self.position = 0;

}

User.prototype.toPublic = function() {
    var publicUser = {};
    publicUser._id = this._id;
    publicUser.name = this.name;
    publicUser.tyranosaur = this.tyranosaur.getState();

    return publicUser;
};

var Users = {};

Users.create = function(cb) {
    var user = new User();
    user.tyranosaur = new Tyranosaur();
    _userList.push(user);
    cb(user);
};

Users.delete = function(id, cb) {
    var userIndex = _.findIndex(_userList, {_id: id});
    _userList.splice(userIndex, 1);
    cb && cb();
};

Users.getAll = function(cb) {
    cb(_userList);
};


Users.getBySocket = function(socket) {
    return _.find(_userList, {socket: socket});
};

Users.getAllPublic = function(cb) {
    var publicList = [];

    for(var i=0; i<_userList.length; i++) {
        var user = _userList[i];
        var publicUser = user.toPublic();

        publicList.push(publicUser);
    }

    cb(publicList);
};


module.exports = Users;
