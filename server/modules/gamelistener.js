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

    return function(userIdToEat) {
        var userToEat;
        userToEat = self.game.users.getById(userIdToEat);
        userToEat = userToEat || self.game.bots.getById(userIdToEat);

        if (userToEat && user.canEat.apply(user, [userToEat])) {

            self.game.io.emit('player leave', userIdToEat);

            if(userToEat.bot) {
                self.game.bots.removeBot(userIdToEat);
                if(self.game.bots.bots.length === 0) {
                    self.game.bots.populateBots();
                }
            }
            else {
                self.game.users.delete(userIdToEat);
            }
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

    this.game.getPublicRoom(function(room) {
        var state = {
            users: room
        };

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
