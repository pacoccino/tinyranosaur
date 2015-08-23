function Player(game) {
    this.game = game;
    this._id = Helpers.idGenerator();
    this.name = "";
    this.tyranosaur = null;
}

Player.prototype.init = function(serverPlayer) {
    this.tyranosaur = new Tyranosaur(this.game);
};

Player.prototype.updateFromServer = function(serverPlayer) {
    this._id = serverPlayer._id;
    this.name = serverPlayer.name;

    var object = this.tyranosaur.getObject();
    var serverTyra = serverPlayer.tyranosaur;

    if(serverTyra.position.length !== 3 || serverTyra.rotation.length !== 4) {
        console.error("Invalid server data for player");
    }
    object.position.fromArray(serverTyra.position);
    object.rotation.fromArray(serverTyra.rotation);
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
