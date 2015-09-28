function Game(THREE) {

}


Game.prototype.setAuthentication = function(authentication) {

    this.authentication = authentication;
};
Game.prototype.setContainer = function(container) {

    this.container = container;
};

Game.prototype.onWindowResize = function() {

    this.sceneManager.camera.aspect = window.innerWidth / window.innerHeight;
    this.sceneManager.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
};

Game.prototype.init = function(readyCallback) {

    this.renderer = new THREE.WebGLRenderer();

    // TODO get container size
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

    this.userInput = new UserInput(this.getRendererElement());
    this.userAction = new UserAction(this);

    this.players = new Players(this);

    this.multiplayer = new Multiplayer_Socket(this);

    this.sceneManager = new MainScene(this);

    var self = this;

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

    loadModels(function() {

        self.multiplayer.listen();

        self.myPlayer = self.players.new();
        self.myPlayer._id = self.authentication.info._id;
        self.myPlayer.name = self.authentication.info.name;

        self.sceneManager.populate();

        self.container.append( self.getRendererElement());

        readyCallback && readyCallback();
    });
};

Game.prototype.renderLoop = function() {

    this.sceneManager.step();

    this.renderer.render( this.sceneManager.scene, this.sceneManager.camera );
};

Game.prototype.getRendererElement = function() {

    return this.renderer.domElement;
};

Game.prototype.getSceneManager = function() {
    return this.sceneManager;
};

