function Tyranosaur() {

    var geometry, material, mesh;
    var object;

    function constructor() {

        var model = _.find(models, {name: 'dino'});

        if(!model) {
            console.error("Cannot load tyranosaur");
            return;
        }

        object = model.object;

        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        mesh = new THREE.Mesh( geometry, material );
    };

    this.getObject = function() {
        return object;
    };

    this.rotate = function() {
        object.rotation.x += 0.01;
        object.rotation.y += 0.02;
    };

    constructor();
}
