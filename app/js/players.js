function Player(game) {
    this.game = game;
    this._id = "";
    this.name = "";
    this.tyranosaur = null;
}

Player.prototype.initFromServer = function(serverPlayer);


function Players(game) {
    this.game = game;

    var _playerList = [];
}

Players.prototype.new = function() {
    var player = new Player(this.game);

    this._playerList.push(player);
}
