var GameListener = function(game) {
    this.game = game;

};

GameListener.prototype.register = function(user) {

    var self = this;

    self.welcomePlayer(user, function() {
        self.diffuseGameState(user);
        self.announcePlayer(user);

        user.socket.on('player update', self.listenUpdatePosition(user).bind(self));
        user.socket.on('player eat', self.listenEat(user).bind(self));
        user.socket.on('heartbeat', user.heartBeat.bind(user));
    });
};

GameListener.prototype.deregister = function(user) {
    this.game.io.emit('player leave', user._id);

};

GameListener.prototype.listenEat = function(user) {

    var self = this;

    return function(userToEat) {
        if (user.canEat.apply(user, [self.game.users.getById(userToEat._id)])) {
            self.game.io.emit('player die', userToEat._id);
        }
        else {
            user.socket.emit('wrong eat');
        }
    }
};

GameListener.prototype.listenUpdatePosition = function(user) {

    var self = this;

    return function(position) {
        user.move(position);

        var options = user.toPublic();
        for (var i = 0; i < self.game.users.users.length; i++) {
            var userTo = self.game.users.users[i];
            userTo.socket.volatile.emit('player update', options);
        }
    };
};

GameListener.prototype.diffuseGameState = function(user) {
    var self = this;
    self.game.users.getAllPublic(function(users) {
        var state = {
            users: users
        };
        for (var i = 0; i < self.game.bots.bots.length; i++) {
            var bot = self.game.bots.bots[i];
            state.users.push(bot.toPublic());
        }
        user.socket.emit('game state', state);
    });
};

GameListener.prototype.welcomePlayer = function(user, welcomed) {
    var welcomeMessage = {};
    welcomeMessage._id = user._id;
    welcomeMessage.name = user.name;
    user.socket.emit('welcome', welcomeMessage, welcomed);
};


GameListener.prototype.announcePlayer = function(user) {
    user.socket.broadcast.emit('player new', user.toPublic());
};

module.exports = GameListener;
