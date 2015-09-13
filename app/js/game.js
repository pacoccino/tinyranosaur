function Game(THREE) {

    var self = this;
    var _renderer, _scene;

    self.init = function(readyCallback) {

        self.clock = new THREE.Clock(true);

        _renderer = new THREE.WebGLRenderer();
        _renderer.setSize( window.innerWidth, window.innerHeight );

        var userInput = new UserInput(self.getRendererElement());

        self.inputDispatcher = userInput.ed;

        self.players = new Players(this);

        self.multiplayer = new Multiplayer_Socket(this);

        _scene = new MainScene(this);

        loadModels(function() {

            self.myPlayer = new Player(self);
            self.myPlayer._id = self.authentication.info._id;
            self.myPlayer.name = self.authentication.info.name;


            _scene.populate();

            readyCallback && readyCallback();
        });

    };

    self.renderLoop = function() {

        _scene.step();

        _renderer.render( _scene.scene, _scene.camera );
    };

    self.getRendererElement = function() {

        return _renderer.domElement;
    };

    self.getScene = function() {
        return _scene;
    };

    function loadModels(callback) {

        var manager = new THREE.LoadingManager();
        var loaderObj = new THREE.ObjectLoader(manager);

        manager.onProgress = function ( item, loaded, total ) {

            console.log( item, loaded, total );
        };

        var loadModel = function(index) {
            if(index >= GameModels.length) {
                callback && callback();
                return;
            }

            var model = GameModels[index];
            loaderObj.load( model.url, function ( object ) {
                model.object = object;

                index++;
                loadModel(index);
            });
        };

        loadModel(0);
    }

    function onWindowResize(){

        _scene.camera.aspect = window.innerWidth / window.innerHeight;
        _scene.camera.updateProjectionMatrix();

        _renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener( 'resize', onWindowResize, false );
}
