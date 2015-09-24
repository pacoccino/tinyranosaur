var _ = require('lodash');

var Bot = require('../models/bot');
var Constants = require('../modules/constants');

var Bots = function(game) {
    this.game = game;
    this.bots = [];
};


// creates bot and add it to main game room
Bots.prototype.create = function() {

    var bot = new Bot();
    this.bots.push(bot);
    this.game.room.push(bot);

    return bot;
};

Bots.prototype.delete = function(botId) {
    if(!botId) return;

    var botsIndex = _.findIndex(this.bots, {_id: botId});
    this.bots.splice(botsIndex, 1);

    var roomIndex = _.findIndex(this.game.room, {_id: botId});
    this.game.room.splice(roomIndex, 1);
};

Bots.prototype.getById = function(botId) {
    if(!botId) return;

    return _.find(this.bots, {_id: botId});
};

// Add all bots
Bots.prototype.populateBots = function() {
    var nbBots = Constants.nbBots;

    for (var i = 0; i < nbBots; i++) {
        var newBot = this.create();
        this.game.io.emit('player new', newBot.toPublic());
    }
};

Bots.prototype.killBots = function() {
    var nbBots = this.bots.length;

    for (var p = 0; p < nbBots; p++) {
        this.game.io.emit('player leave', this.bots[0]._id);
        this.delete(this.bots[0]);
    }
};

// Make bot do actions
Bots.prototype.liveBots = function() {

    for (var i = 0; i < this.bots.length; i++) {
        var bot = this.bots[i];
        bot.stepIa();

        var botPublic = bot.toPublic();
        this.game.io.emit('player update', botPublic);
    }

};


module.exports = Bots;
