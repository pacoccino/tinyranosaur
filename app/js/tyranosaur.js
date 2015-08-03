function Tyranosaur() {

    var self = this;
    var geometry, material, mesh;
    var object;

    var rotationStep = 0.02;

    function constructor() {

        var model = _.find(models, {name: 'dino'});

        if(!model) {
            console.error("Cannot load tyranosaur");
            return;
        }

        model.object.rotation.y = -Math.PI/2;
        object = new THREE.Object3D();
        object.add(model.object);

        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        mesh = new THREE.Mesh( geometry, material );
    };

    self.getObject = function() {
        return object;
    };

    self.rotate = function() {
        object.rotation.x += 0.01;
        object.rotation.y += 0.02;
    };

    self.idleAnimation = function() {
      var angle_max = Math.PI/5;
      if(object.rotation.y + rotationStep > angle_max || object.rotation.y + rotationStep < -angle_max) {
        rotationStep *= -1;
      }
      object.rotation.y += rotationStep;

    };

    constructor();
}
