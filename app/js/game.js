function Game(THREE) {

    var self = this;
    var _renderer;

    self.init = function(readyCallback) {

        _scene = new MainScene(this);

        _renderer = new THREE.WebGLRenderer();
        _renderer.setSize( window.innerWidth, window.innerHeight );

        loadModels(function() {
            _scene.populate();
        });

        this.events = {};

        var userInput = new UserInput(this, self.getRendererElement());

        readyCallback && readyCallback();
    };

    self.renderLoop = function() {

        _scene.step();

        _renderer.render( _scene.scene, _scene.camera );
    };

    self.getRendererElement = function() {

        return _renderer.domElement;
    };

    function loadModels(callback) {

        var manager = new THREE.LoadingManager();
        var loaderObj = new THREE.ObjectLoader(manager);

        manager.onProgress = function ( item, loaded, total ) {

            console.log( item, loaded, total );
        };

        var loadModel = function(index) {
            if(index >= models.length) {
                callback && callback();
                return;
            }

            var model = models[index];
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
