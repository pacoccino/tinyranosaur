var Bot = require('../models/bot');
var Constants = require('../modules/constants');

var Bots = function(game) {
    this.game = game;
    this.bots = [];
};


Bots.prototype.createBots = function() {
    var nbBots = Constants.nbBots;

    for (var i = 0; i < nbBots; i++) {
        var bot = new Bot();
        this.bots.push(bot);
        this.game.io.emit('player new', bot.toPublic());
    }
};

Bots.prototype.killBots = function() {
    for (var i = 0; i < this.bots.length; i++) {
        var bot = this.bots[i];
        this.game.io.emit('player leave', bot._id);
    }
    this.bots.splice(0, this.bots.length);

    tmpTime = null;
};

var tmpTime = null;
Bots.prototype.liveBots = function() {

    var now = new Date(), delta;

    if(tmpTime) {
        delta = now - tmpTime;
    }
    else {
        delta = 0;
    }

    tmpTime = now;

    for (var i = 0; i < this.bots.length; i++) {
        var bot = this.bots[i];
        bot.stepIa(delta);

        var botPublic = bot.toPublic();
        this.game.io.emit('player update', botPublic);
    }

};


module.exports = Bots;
