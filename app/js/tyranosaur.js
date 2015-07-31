function Tyranosaur() {

    var geometry, material, mesh;

    function constructor() {


        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        mesh = new THREE.Mesh( geometry, material );
    };

    this.getMesh = function() {
        return mesh;
    };

    this.rotate = function() {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;
    };

    constructor();
}
