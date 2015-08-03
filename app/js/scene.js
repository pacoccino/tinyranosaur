function MainScene(game) {

    var self = this;
    var _game = game;

    var _tyranosaur;

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
        self.camera.lookAt(object.position);
    }

    var playerAdvance = function() {
        if(_sceneReady) {
            _tyranosaur.moveForward();
        }
    };

    var playerStop = function() {
        if(_sceneReady) {
            _tyranosaur.stopForward();
        }
    };

    var playerLeft = function() {
        if(_sceneReady) {
            _tyranosaur.moveLeft();
        }
    };
    var playerRight = function() {
        if(_sceneReady) {
            _tyranosaur.moveRight();
        }
    };
    var playerStopRotate = function() {
        if(_sceneReady) {
            _tyranosaur.stopRotate();
        }
    };

    // Remplissage de la scene avec les modèles
    self.populate = function() {

        _tyranosaur = new Tyranosaur(_game);
        _tyranosaur.getObject().position.y = 30;

        self.scene.add(_tyranosaur.getObject());

        _sceneReady = true;

    };

    // Callback a chaque render
    self.step = function() {

        if(!_sceneReady) return;

        _tyranosaur.moveFrame();
        cameraFollow(_tyranosaur.getObject());
    };


    constructor();
}
