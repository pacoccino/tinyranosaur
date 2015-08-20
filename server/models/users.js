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

var userList = [];

function User( name ) {
  this._id = idGenerator();
  this.name = name || randomName();
}

var Users = {};

Users.create = function(cb) {
  var user = new User();
  userList.push(user);
  cb(user);
};

Users.getAll = function(cb) {
  cb(userList);
};


module.exports = Users;
