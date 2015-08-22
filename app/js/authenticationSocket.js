function Authentication_Socket() {
    var self = this;
    this.socket = io(GameConfig.SocketUrl + GameConfig.SocketNsp);
    this.info = null;

    var _ack = null;

    this.auth = function(callback) {
        this.socket.on('welcome', function(authInfo, ack) {
            self.info = {};
            self.info._id = authInfo._id;
            self.info.name = authInfo.name;

            _ack = ack;
            callback(true);
        });
    };

    this.unAuth = function() {
        this.socket.emit('disconnect');
    };

    this.listenReady = function() {
        _ack && _ack('thx');
        _ack = null;
    }
}
