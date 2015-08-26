function MainScene(game) {

    var self = this;
    var _game = game;

    var _sceneReady = false;

    // Construction initiale de la scene
    var constructor = function() {

        self.scene = new THREE.Scene();

        // Camera

        self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        self.camera.position.y = 100;
        self.camera.position.z = 500;

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

        addEvents();
    };

    function addEvents() {
        _game.inputDispatcher.addEventListener('advance_start', playerAdvance);
        _game.inputDispatcher.addEventListener('advance_stop', playerStop);
        _game.inputDispatcher.addEventListener('left_start', playerLeft);
        _game.inputDispatcher.addEventListener('left_stop', playerStopRotate);
        _game.inputDispatcher.addEventListener('right_start', playerRight);
        _game.inputDispatcher.addEventListener('right_stop', playerStopRotate);
    }

    function cameraFollow(object) {

        self.camera.position.copy(object.position);
        self.camera.rotation.copy(object.rotation);

        self.camera.translateZ(-80);
        self.camera.translateY(60);

        //self.camera.translateZ(-1);
        //self.camera.translateY(70);
        //self.camera.translateX(50);

        self.camera.lookAt(object.position);
    }

    var playerAdvance = function() {
        if(_sceneReady) {
            game.myPlayer.tyranosaur.moveForward();
        }
    };

    var playerStop = function() {
        if(_sceneReady) {
            game.myPlayer.tyranosaur.stopForward();
        }
    };

    var playerLeft = function() {
        if(_sceneReady) {
            game.myPlayer.tyranosaur.moveLeft();
        }
    };
    var playerRight = function() {
        if(_sceneReady) {
            game.myPlayer.tyranosaur.moveRight();
        }
    };
    var playerStopRotate = function() {
        if(_sceneReady) {
            game.myPlayer.tyranosaur.stopRotate();
        }
    };

    // Remplissage de la scene avec les modèles
    self.populate = function() {

        game.myPlayer.tyranosaur.getObject().position.y = 30;
        self.scene.add(game.myPlayer.tyranosaur.getObject());
        updateMultiplayerState(game.myPlayer.tyranosaur);

        _game.multiplayer.on('player new', addPlayer);
        _game.multiplayer.on('player update', updatePlayer);
        _game.multiplayer.on('player leave', removePlayer);

        _sceneReady = true;
    };


    var updateThrottler = _.throttle(updateMultiplayerState, GameConfig.updateInterval);
    // Callback a chaque render
    self.step = function() {

        if(!_sceneReady) return;

        game.myPlayer.tyranosaur.moveFrame();
        cameraFollow(game.myPlayer.tyranosaur.getObject());
        checkIfICollide();

        updateThrottler(game.myPlayer.tyranosaur);
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

        self.scene.add(player.tyranosaur.getObject());
    }

    function updatePlayer(event) {
        var userId = event.player._id;
        var player = _game.players.getById(userId);
        player.updateFromServer(event.player);
    }

    function removePlayer(event) {
        var userId = event._id;
        var player = _game.players.getById(userId);

        self.scene.remove(player.tyranosaur.getObject());

        _game.players.delete(player);

    }

    function updateMultiplayerState(tyranosaur) {
        if(tyranosaur.hasMoved()) {

            var object = tyranosaur.getObject();

            _game.multiplayer.emit( {
                type:'player update',
                params: {
                    "position": object.position.toArray(),
                    "rotation": object.rotation.toArray()
                }
            });
            tyranosaur.resetMoved();
        }
    }

    constructor();
}
