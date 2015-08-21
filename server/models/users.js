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
    publicUser.position = this.position;

    return publicUser;
};

var Users = {};

Users.create = function(cb) {
    var user = new User();
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

Users.toPublic = function(user) {
    var publicUser = {};
    publicUser._id = user._id;
    publicUser.name = user.name;
    publicUser.position = user.position;

    return publicUser;
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
