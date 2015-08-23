for(var i=0; i<models.length; i++) {
    models[i].object = new THREE.Object3D();
}

var game = {};
game.inputDispatcher = new THREE.EventDispatcher();
