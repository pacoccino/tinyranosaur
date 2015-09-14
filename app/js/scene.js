function MainScene(game) {

    var self = this;
    var _game = game;

    var _sceneReady = false;

    var _userAction = _game.userAction;
    var _cameraController;

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

        var axes = new THREE.AxisHelper(100);
        self.scene.add( axes );

        // Sol

        var floorMaterial = new THREE.MeshBasicMaterial( { color: 0x125612, side: THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        self.scene.add(floor);


        // Skybox

        var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
        var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
        var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        self.scene.add(skyBox);

    };

    // Callback a chaque render
    self.step = function() {

        if(!_sceneReady) return;

        _userAction.updateActions();
        _userAction.doActions();

        game.myPlayer.tyranosaur.moveFrame();

        //cameraFollow(game.myPlayer.tyranosaur.object);
        _cameraController.placeCamera();

        checkIfICollide();

        updateMultiplayerState_Throttler(game.myPlayer.tyranosaur);
    };

    // Remplissage de la scene avec les modèles
    self.populate = function() {

        game.myPlayer.tyranosaur.object.position.y = 30;
        self.scene.add(game.myPlayer.tyranosaur.object);
        updateMultiplayerState(game.myPlayer.tyranosaur);

        _game.multiplayer.on('player new', addPlayer);
        _game.multiplayer.on('player update', updatePlayer);
        _game.multiplayer.on('player leave', removePlayer);

        _sceneReady = true;
        _userAction.addListeners();

        _cameraController = new CameraController(self.camera, game.myPlayer.tyranosaur);
    };



    function checkIfICollide() {
        var players = game.players.getAll();

        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if(game.myPlayer.tyranosaur.collideWith(player.tyranosaur)) {
                eatPlayer(player);
            }
        }
    }

    function eatPlayer(player) {
        console.log("I ate" + player._id);

        _game.multiplayer.emit( {
            type:'player eat',
            params: {
                "_id": player._id
            }
        });
    }

    function addPlayer(event) {

        var player = _game.players.new();
        player.updateFromServer(event.player);

        self.scene.add(player.tyranosaur.object);
    }

    function updatePlayer(event) {
        var userId = event.player._id;
        var player = _game.players.getById(userId);
        if(!player) {
            console.error("Update without knowing player");
            return;
        }
        player.updateFromServer(event.player);
    }

    function removePlayer(event) {
        var userId = event._id;
        var player = _game.players.getById(userId);
        if(!player) {
            console.error("Remove without knowing player");
            return;
        }

        self.scene.remove(player.tyranosaur.object);

        _game.players.delete(player);

    }

    var updateMultiplayerState_Throttler = _.throttle(updateMultiplayerState, GameConfig.updateInterval);
    function updateMultiplayerState(tyranosaur) {
        if(tyranosaur.hasMoved) {

            var object = tyranosaur.object;

            _game.multiplayer.emit( {
                type:'player update',
                params: {
                    "position": object.position.toArray(),
                    "rotation": object.rotation.toArray()
                }
            });
            tyranosaur.hasMoved = false;
        }
    }

    constructor();
}
