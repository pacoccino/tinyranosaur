function Game(THREE) {

    var _scene, _camera, _renderer;

    var _tyranosaur;



    this.init = function(readyCallback) {

        _scene = new THREE.Scene();

        _camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        _camera.position.z = 1000;

        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        _scene.add( light );

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 0, 1, 0 );
        _scene.add( directionalLight );

        _renderer = new THREE.WebGLRenderer();
        _renderer.setSize( window.innerWidth, window.innerHeight );

        loadModels(function() {
            populateScene(_scene);

            readyCallback && readyCallback();
        });
    };

    this.renderLoop = function() {

        _tyranosaur.rotate();

        _renderer.render( _scene, _camera );
    };

    this.getRendererElement = function() {
        return _renderer.domElement;
    };


    function onWindowResize(){

        _camera.aspect = window.innerWidth / window.innerHeight;
        _camera.updateProjectionMatrix();

        _renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function loadModels(callback) {

        var manager = new THREE.LoadingManager();
        var loaderObj = new THREE.ObjectLoader(manager);

        manager.onProgress = function ( item, loaded, total ) {

            console.log( item, loaded, total );

        };

        var loadModel = function(index) {
            if(index >= models.length) {
                callback && callback();
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

    function populateScene(scene) {
        _tyranosaur = new Tyranosaur();

        scene.add(_tyranosaur.getObject());
    }

    window.addEventListener( 'resize', onWindowResize, false );
}
