var Tyranosaur = require('./tyranosaur');
var Helpers = require('../modules/helpers');
var _ = require('lodash');

function User( name ) {

    this._id = Helpers.idGenerator();
    this.name = name || Helpers.randomName();

    this.socket = null;

    this.tyranosaur = new Tyranosaur();

    this.bot = false;
}

User.prototype.toPublic = function() {
    var publicUser = {};
    publicUser._id = this._id;
    publicUser.name = this.name;
    publicUser.bot = this.bot;
    publicUser.tyranosaur = this.tyranosaur.getState();

    return publicUser;
};

module.exports = User;
