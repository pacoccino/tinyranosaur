function Tyranosaur(game) {

    var self = this;
    var _game = game;

    var _object, _hasMoved, _boundingBlock, _maxCollideDistance;

    var rayCaster;

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

        var globGeom = new THREE.BoxGeometry(20, 50, 70);
        var globMaterial = new THREE.MeshBasicMaterial({ // TODO Switch to lambert
            color: '0xFF0000'
        });
        _boundingBlock = new THREE.Mesh(globGeom, globMaterial);
        _boundingBlock.position.z = 5;
        _maxCollideDistance = 40;

        _object = new THREE.Object3D();
        _object.add(modelObject);
        //_object.add(_boundingBlock);
        _boundingBlock = modelObject;

        _hasMoved = true;

        rayCaster = new THREE.Raycaster();
        //rayCaster.far = 100;

        addEvents();
    }

    self.getObject = function() {
        return _object;
    };
    self.getBoundingBlock = function() {
        return _boundingBlock;
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

    function getDirection() {

        var direction = new THREE.Vector3(0,0,1);
        direction.applyEuler(_object.rotation);

        return direction;
    }

    var arrowHelper;

    self.collideWith = function(ennemyTyra) {
        var direction = getDirection();

        rayCaster.set(_object.position, direction);
        var collisions = rayCaster.intersectObject(ennemyTyra.getBoundingBlock());

        if(arrowHelper) {
            _game.getScene().scene.remove(arrowHelper);
        }
        arrowHelper = new THREE.ArrowHelper( direction, _object.position, 100, 0x00FF00 );
        _game.getScene().scene.add( arrowHelper );

        for (var i = 0; i < collisions.length; i++) {
            var collider = collisions[i];
            if(collider.distance < _maxCollideDistance) {
                return true;
            }
        }
        return false;
    };

    constructor();
}
