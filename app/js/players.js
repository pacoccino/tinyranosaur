function Player(game) {
    this.game = game;
    this._id = Helpers.idGenerator();
    this.name = "";
    this.tyranosaur = null;
}

Player.prototype.initFromServer = function(serverPlayer) {
    this._id = serverPlayer._id;
    this.name = serverPlayer.name;

    this.tyranosaur = new Tyranosaur(this.game);
};


function Players(game) {
    this.game = game;

    this._playerList = [];
}

Players.prototype.new = function() {
    var player = new Player(this.game);

    this._playerList.push(player);

    return player;
};

Players.prototype.delete = function(player) {
    var id;
    if(player instanceof Player) {
        id = player._id;
    }
    else {
        id = player;
    }

    var index  = _.findIndex(this._playerList, {_id: id});
    this._playerList.splice(index, 1);
};

Players.prototype.getById = function(id) {
    return _.find(this._playerList, {_id: id});
};


Players.prototype.getAll = function() {
    return this._playerList;
};
