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

        this._game.inputDispatcher.addEventListener('poo', this._poo);
    }

    Tyranosaur.prototype.moveForward = function() {
        this._game.clock.getDelta();
        this._targetVelocity.position.z = maxVelocity;
    };
    Tyranosaur.prototype.stopForward = function() {
        this._targetVelocity.position.z = 0;
    };
    Tyranosaur.prototype.moveLeft = function() {
        this._game.clock.getDelta();
        this._targetVelocity.rotation.y = rotateVelocity;
    };
    Tyranosaur.prototype.moveRight = function() {
        this._game.clock.getDelta();
        this._targetVelocity.rotation.y = -rotateVelocity;
    };
    Tyranosaur.prototype.stopRotate = function() {
        this._targetVelocity.rotation.y = 0;
    };

    Tyranosaur.prototype.moveFrame = function() {

        var acceleration = 0.1;

        var delta = this._game.clock.getDelta();

        this._actualVelocity.position.z += acceleration * (this._targetVelocity.position.z - this._actualVelocity.position.z);
        this._actualVelocity.rotation.y += acceleration * (this._targetVelocity.rotation.y - this._actualVelocity.rotation.y);

        if(this._actualVelocity.position.z < this._targetVelocity.z) {
            this._actualVelocity.position.z = Math.min(this._actualVelocity.position.z, this._targetVelocity.position.z);
        }
        else if(this._actualVelocity.rotation.y > this._targetVelocity.rotation.y) {
            this._actualVelocity.rotation.y = Math.max(this._actualVelocity.rotation.y, this._targetVelocity.rotation.y);
        }

        if(Math.abs(this._actualVelocity.position.z) < 0.5) {
            this._actualVelocity.position.z = 0;
        }
        else if(Math.abs(this._actualVelocity.rotation.y) < 0.1) {
            this._actualVelocity.rotation.y = 0;
        }

        var zTrans = this._actualVelocity.position.z * delta;
        var yRot = this._actualVelocity.rotation.y * delta;

        if(zTrans > 0 || yRot > 0) {
            this.hasMoved = true;
            this.object.translateZ(zTrans);
            this.object.rotateOnAxis(new THREE.Vector3(0,1,0), this._actualVelocity.rotation.y * delta);
        }
    };

    Tyranosaur.prototype._poo = function () {
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

    Tyranosaur.prototype.getDirection = function() {

        var direction = new THREE.Vector3(0,0,1);
        direction.applyEuler(this.object.rotation);

        return direction;
    };

    Tyranosaur.prototype.collideWith = function(ennemyTyra) {
        var direction = this.getDirection();

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

