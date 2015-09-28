var GameModels = [
    {
        name: 'dino',
        url: 'assets/dino.json',
        type: 'json'
    },
    {
        name: 'titi1',
        url: 'assets/titi1.obj',
        type: 'obj'
    }
];

var ModelLoader = function() {

    this.loadingManager = new THREE.LoadingManager();

    this.OBJLoader = new THREE.OBJLoader( this.loadingManager );
    this.JSONLoader = new THREE.ObjectLoader( this.loadingManager );

    this.loadingManager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );
    };
};

ModelLoader.prototype.loadModels = function(callback) {

    // TODO Asyncify
    var loader, self = this;

    var loadModel = function(index) {
        if(index >= GameModels.length) {
            callback && callback();
            return;
        }

        var model = GameModels[index];
        switch(model.type) {
            case 'json':
                loader = self.JSONLoader;
                break;
            case 'obj':
                loader = self.OBJLoader;
                break;
            default:
                console.log('Unknown model format');
                index++;
                loadModel(index);
                return;
        }

        loader.load( model.url, function ( object ) {
            model.object = object;

            index++;
            loadModel(index);
        });
    };

    loadModel(0);
};
