function Tyranosaur(game) {

    var self = this;
    var _game = game;

    var _object;

    var rotationStep = 0.02;

    function constructor() {

        var model = _.find(models, {name: 'dino'});

        if(!model) {
            console.error("Cannot load tyranosaur");
            return;
        }

        var modelObject = model.object.clone();

        modelObject.rotation.y = -Math.PI/2;
        modelObject.scale.set(0.5, 0.5, 0.5);
        modelObject.updateMatrix();
        _object = new THREE.Object3D();
        _object.add(modelObject);

        addEvents();
    }

    function addEvents() {
    }

    self.getObject = function() {
        return _object;
    };

    self.rotate = function() {
        _object.rotation.x += 0.01;
        _object.rotation.y += 0.02;
    };

    self.idleAnimation = function() {
      var angle_max = Math.PI/5;
      if(_object.rotation.y + rotationStep > angle_max || _object.rotation.y + rotationStep < -angle_max) {
        rotationStep *= -1;
      }
      //_object.rotation.y += rotationStep;
    };

    var maxVelocity = 60;
    var rotateVelocity = 1;

    var _actualVelocity = new THREE.Object3D;
    var _targetVelocity = new THREE.Object3D;

    self.moveForward = function() {
        _game.clock.getDelta();
        _targetVelocity.position.z = maxVelocity;
    };
    self.stopForward = function() {
        _targetVelocity.position.z = 0;
    };
    self.moveLeft = function() {
        _game.clock.getDelta();
        _targetVelocity.rotation.y = rotateVelocity;
    };
    self.moveRight = function() {
        _game.clock.getDelta();
        _targetVelocity.rotation.y = -rotateVelocity;
    };
    self.stopRotate = function() {
        _targetVelocity.rotation.y = 0;
    };

    self.moveFrame = function() {

        var acceleration = 0.1;

        var delta = _game.clock.getDelta();

        _actualVelocity.position.z += acceleration * (_targetVelocity.position.z - _actualVelocity.position.z);
        _actualVelocity.rotation.y += acceleration * (_targetVelocity.rotation.y - _actualVelocity.rotation.y);

        if(_actualVelocity.position.z < _targetVelocity.z) {
            _actualVelocity.position.z = Math.min(_actualVelocity.position.z, _targetVelocity.position.z);
        }
        else if(_actualVelocity.rotation.y > _targetVelocity.rotation.y) {
            _actualVelocity.rotation.y = Math.max(_actualVelocity.rotation.y, _targetVelocity.rotation.y);
        }

        if(Math.abs(_actualVelocity.position.z) < 0.5) {
            _actualVelocity.position.z = 0;
        }
        else if(Math.abs(_actualVelocity.rotation.y) < 0.1) {
            _actualVelocity.rotation.y = 0;
        }

        _object.translateZ(_actualVelocity.position.z * delta);
        _object.rotateOnAxis(new THREE.Vector3(0,1,0), _actualVelocity.rotation.y * delta);
    };

    constructor();
}
