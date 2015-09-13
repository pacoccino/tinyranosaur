var Tyranosaur = (function() {

    var maxVelocity = 60;
    var rotateVelocity = 1;


    function Tyranosaur(game) {
        // Private members

        this._game = game;
        this._maxCollideDistance = 40;
        this._rayCaster = null;
        this._actualVelocity = new THREE.Object3D;
        this._targetVelocity = new THREE.Object3D;
        this._poos = [];


        // Public members

        this.hasMoved = false;
        this.object = null;
        this.boundingBlock = null;

        this.direction = new THREE.Vector3(0,0,1);

        // Constructor

        var model = _.find(GameModels, {name: 'dino'});

        if (!model) {
            console.error("Cannot load tyranosaur");
            return;
        }

        var modelObject = model.object.clone();

        modelObject.rotation.y = -Math.PI / 2;
        modelObject.scale.set(0.5, 0.5, 0.5);
        modelObject.updateMatrix();

        var globGeom = new THREE.BoxGeometry(20, 50, 70);
        var globMaterial = new THREE.MeshLambertMaterial({ // TODO Switch to lambert
            color: '0xFF0000'
        });
        this.boundingBlock = new THREE.Mesh(globGeom, globMaterial);
        this.boundingBlock.position.z = 5;

        this.object = new THREE.Object3D();
        this.object.add(modelObject);
        //_object.add(_boundingBlock);
        this.boundingBlock = modelObject;

        this.hasMoved = true;

        this._rayCaster = new THREE.Raycaster();
        this._rayCaster.far = 200;

    }

    Tyranosaur.prototype.moveAsKeyboard = function(keys) {
        var keyboardVector = new THREE.Vector3(0,0,0);

        if(!keys.length) {
            keys = [keys];
        }
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            switch (key) {
                case 'UP':
                    keyboardVector.z += 1;
                    break;
                case 'DOWN':
                    keyboardVector.z += -1;
                    break;
                case 'LEFT':
                    keyboardVector.x += 1;
                    break;
                case 'RIGHT':
                    keyboardVector.x += -1;
                    break;
            }
        }

        var camera = this._game.getScene().camera;
        keyboardVector.applyAxisAngle(new THREE.Vector3(0,1,0), camera.rotation.y + Math.PI);

        this.direction = keyboardVector;

        var delta = this._game.clock.getDelta();

        var movement = new THREE.Vector3();
        movement.copy(this.direction);
        movement.multiplyScalar(delta * maxVelocity);

        this.object.position.add(movement);
        this.object.rotation.copy(this.fromDirectionToRotation());
    };

    Tyranosaur.prototype.moveFrame = function() {

    };

    Tyranosaur.prototype.poo = function () {
        if(this._poos.length > 0) return;

        var pooGeometry = new THREE.SphereGeometry(8, 8, 8);
        var pooMaterial = new THREE.MeshBasicMaterial({ // TODO Switch to lambert
            color: '0xFF0000'
        });

        var pooMesh = new THREE.Mesh(pooGeometry, pooMaterial);
        var poo = new THREE.Object3D();
        poo.add(pooMesh);

        poo.position.copy(this.object.position);

        this._game.getScene().scene.add(poo);

        this._poos.push(poo);
    };

    Tyranosaur.prototype.fromRotationToDirection = function() {

        var direction = new THREE.Vector3(0,0,1);
        direction.applyEuler(this.object.rotation);

        return direction;
    };
    Tyranosaur.prototype.fromDirectionToRotation = function() {

        var rotation = new THREE.Euler();

        rotation.y = -Math.atan2(this.direction.z, this.direction.x) + Math.PI/2;

        return rotation;
    };

    Tyranosaur.prototype.collideWith = function(ennemyTyra) {
        var direction = this.fromRotationToDirection();

        this._rayCaster.set(this.object.position, direction);
        var collisions = this._rayCaster.intersectObject(ennemyTyra.boundingBlock);

        for (var i = 0; i < collisions.length; i++) {
            var collider = collisions[i];
            if(collider.distance < this._maxCollideDistance) {
                return true;
            }
        }
        return false;
    };

    return Tyranosaur;
})();

