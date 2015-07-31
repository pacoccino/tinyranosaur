function MainScene() {

    var self = this;

    var _tyranosaur;

    var _sceneReady = false;

    var constructor = function() {

        self.scene = new THREE.Scene();

        self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        self.camera.position.z = 1000;

        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        self.scene.add( light );

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 0, 1, 0 );
        self.scene.add( directionalLight );
    }

    self.populate = function() {

        _tyranosaur = new Tyranosaur();

        self.scene.add(_tyranosaur.getObject());

        _sceneReady = true;
    }

    self.step = function() {

        if(!_sceneReady) return;

        _tyranosaur.rotate();
    }


    constructor();
}
