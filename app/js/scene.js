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

        /*
        self.camera.position.x = -200;
        self.camera.position.y = 100;
        self.camera.rotation.y = -Math.PI/2;
         */

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

    // Callback a chaque render
    self.step = function() {

        if(!_sceneReady) return;

        _userAction.updateActions();
        _userAction.doActions();

        game.myPlayer.tyranosaur.moveFrame();

        _cameraController.placeCamera();

        checkIfICollide();

        updateMultiplayerState_Throttler(game.myPlayer.tyranosaur);
    };

    // Remplissage de la scene avec les modèles
    self.populate = function() {

        self.scene.add(game.myPlayer.tyranosaur.object);

        _cameraController = new CameraController(self.camera, game.myPlayer.tyranosaur);

        updateMultiplayerState(game.myPlayer.tyranosaur);

        _game.multiplayer.on('player new', addPlayer);
        _game.multiplayer.on('player update', updatePlayer);
        _game.multiplayer.on('player leave', removePlayer);

        _sceneReady = true;
        _userAction.addListeners();
    };



    function checkIfICollide() {
        var players = game.players.getAll();

        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if(player._id != game.myPlayer._id && game.myPlayer.tyranosaur.collideWith(player.tyranosaur)) {
                eatPlayer(player);
            }
        }
    }

    function eatPlayer(player) {
        console.log("I ate" + player._id);

    _game.multiplayer.emit( {
            type:'player eat',
            params: player._id
        });
    }

    function addPlayer(event) {

        var player = _game.players.new();
        player.createFromServer(event.player);
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
