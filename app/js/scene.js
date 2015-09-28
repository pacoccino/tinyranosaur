function SceneManager(game) {

    var self = this;

    this._game = game;

    this._sceneReady = false;

    // Construction initiale de la scene
    var constructor = function() {

        self.scene = new THREE.Scene();

        // Camera

        self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

        // Lumières

        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        self.scene.add( light );

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 0, 1, 0 );
        self.scene.add( directionalLight );

        // Axes

        //var axes = new THREE.AxisHelper(100);
        //self.scene.add( axes );

        // Sol

        var floorMaterial = new THREE.MeshBasicMaterial( { color: 0xEEEEEE, side: THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -30;
        floor.rotation.x = Math.PI / 2;
        self.scene.add(floor);


        // Skybox

        var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
        var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x156215, side: THREE.BackSide } );
        var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        self.scene.add(skyBox);
    };

    constructor();

    this._updateMultiplayerState_Throttler = _.throttle(this.updateMultiplayerState, GameConfig.updateInterval);
}

// Callback a chaque render
SceneManager.prototype.step = function() {

    if(!this._sceneReady) return;

    this._cameraController.placeCamera();

    this.checkIfICollide();

    this._updateMultiplayerState_Throttler();
};

// Remplissage de la scene avec les modèles
SceneManager.prototype.populate = function() {

    this.scene.add(this._game.myPlayer.tyranosaur.object);

    this._cameraController = new CameraController(this.camera, this._game.myPlayer);

    this.updateMultiplayerState(this._game.myPlayer.tyranosaur);

    this._game.multiplayer.on('player new', this.addPlayer.bind(this));
    this._game.multiplayer.on('player update', this.updatePlayer.bind(this));
    this._game.multiplayer.on('player leave', this.removePlayer.bind(this));

    this._sceneReady = true;
};



SceneManager.prototype.checkIfICollide = function() {
    var players = this._game.players.getAll();

    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if(player._id != this._game.myPlayer._id && this._game.myPlayer.tyranosaur.collideWith(player.tyranosaur)) {
            this.eatPlayer(player);
        }
    }
};

SceneManager.prototype.eatPlayer = function(player) {
    console.log("I ate" + player._id);

    this._game.multiplayer.emit( {
        type:'player eat',
        params: player._id
    });
};

SceneManager.prototype.addPlayer = function(event) {

    var player = this._game.players.new();
    player.createFromServer(event.player);
    player.updateFromServer(event.player);

    this.scene.add(player.tyranosaur.object);
};

SceneManager.prototype.updatePlayer = function(event) {
    var userId = event.player._id;
    var player = this._game.players.getById(userId);
    if(!player) {
        console.error("Update without knowing player");
        return;
    }
    player.updateFromServer(event.player);
};

SceneManager.prototype.removePlayer = function(event) {
    var userId = event._id;
    var player = this._game.players.getById(userId);
    if(!player) {
        console.error("Remove without knowing player");
        return;
    }

    this.scene.remove(player.tyranosaur.object);

    this._game.players.delete(player);

};

SceneManager.prototype.updateMultiplayerState = function() {
    var tyranosaur = this._game.myPlayer.tyranosaur;

    if(tyranosaur.hasMoved) {

        var object = tyranosaur.object;

        this._game.multiplayer.emit( {
            type:'player update',
            params: {
                "position": object.position.toArray(),
                "rotation": object.rotation.toArray()
            }
        });
        tyranosaur.hasMoved = false;
    }
};
