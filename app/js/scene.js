function MainScene() {

    var self = this;

    var _tyranosaur;

    var _sceneReady = false;

    var constructor = function() {

        self.scene = new THREE.Scene();

        self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        self.camera.position.y = 100;
        self.camera.position.z = 500;

        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        self.scene.add( light );

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 0, 1, 0 );
        self.scene.add( directionalLight );

      	var axes = new THREE.AxisHelper(100);
      	self.scene.add( axes );

        var floorMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
      	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
      	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      	floor.position.y = -0.5;
      	floor.rotation.x = Math.PI / 2;
      	self.scene.add(floor);


      	// make sure the camera's "far" value is large enough so that it will render the skyBox!
      	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
      	// BackSide: render faces from inside of the cube, instead of from outside (default).
      	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
      	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
      	self.scene.add(skyBox);
    };

    self.populate = function() {

        _tyranosaur = new Tyranosaur();
        _tyranosaur.getObject().position.y = 30;

        self.scene.add(_tyranosaur.getObject());

        _sceneReady = true;

    };

    self.step = function() {

        if(!_sceneReady) return;

        _tyranosaur.idleAnimation();
    };


    constructor();
}
