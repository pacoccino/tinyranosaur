var Tyranosaur = require('./tyranosaur');
var _ = require('lodash');

function User( name ) {

    this._id = idGenerator();
    this.name = name || randomName();

    this.socket = null;

    this.tyranosaur = new Tyranosaur();

    function idGenerator() {
        var length = 10;
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    function randomName() {
        var length = 6;
        var text = '';
        var possible = 'abcdefghijklmnopqrstuvwxyz';

        text += possible.charAt(Math.floor(Math.random() * possible.length)).toUpperCase();
        for (var i = 1; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

}

User.prototype.toPublic = function() {
    var publicUser = {};
    publicUser._id = this._id;
    publicUser.name = this.name;
    publicUser.tyranosaur = this.tyranosaur.getState();

    return publicUser;
};

module.exports = User;
