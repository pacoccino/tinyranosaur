for(var i=0; i<GameModels.length; i++) {
    GameModels[i].object = new THREE.Object3D();
}

var game = {};
game.inputDispatcher = new THREE.EventDispatcher();
game.clock = new THREE.Clock();
