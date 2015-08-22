function Tyranosaur(game) {

    var self = this;
    var _game = game;

    var _object, _hasMoved;

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

        _hasMoved = true;

        addEvents();
    }

    self.getObject = function() {
        return _object;
    };

    self.idleAnimation = function() {
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

        var zTrans = _actualVelocity.position.z * delta;
        var yRot = _actualVelocity.rotation.y * delta;

        if(zTrans > 0 || yRot > 0) {
            _hasMoved = true;
            _object.translateZ(zTrans);
            _object.rotateOnAxis(new THREE.Vector3(0,1,0), _actualVelocity.rotation.y * delta);
        }
    };

    self.hasMoved = function() {
        return _hasMoved;
    };

    self.resetMoved = function() {
        _hasMoved = false;
    };

    var _poos = false;
    function poo() {
        if(_poos.length > 0) return;

        var pooGeometry = new THREE.SphereGeometry(8, 8, 8);
        var pooMaterial = new THREE.MeshBasicMaterial({ // TODO Switch to lambert
            color: '0xFF0000'
        });

        var pooMesh = new THREE.Mesh(pooGeometry, pooMaterial);
        var poo = new THREE.Object3D();
        poo.add(pooMesh);

        poo.position.copy(_object.position);

        _game.getScene().scene.add(poo);

        _poos.push(poo);
    }

    function addEvents() {
        _game.inputDispatcher.addEventListener('poo', poo);
    }

    self.collideWith = function(ennemyTyra) {
        return false;
    };

    constructor();
}
