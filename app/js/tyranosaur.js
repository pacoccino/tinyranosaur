var Tyranosaur = (function() {

    var maxVelocity = 60;
    var rotateVelocity = 1;


    function Tyranosaur(game) {
        // Private members

        this._game = game;
        this._maxCollideDistance = 40;
        this._rayCaster = null;
        this._poos = [];

        // Public members

        this.hasMoved = false;
        this.object = null;
        this.boundingBlock = null;

        this.direction = new THREE.Vector3(1,0,0);

        this.moveTimer = new Helpers.deltaTimer();

        // Constructor

        var model = _.find(GameModels, {name: 'dino'});

        if (!model) {
            console.error("Cannot load tyranosaur");
            return;
        }

        this.modelObject = model.object.clone();
        this.setType();

        this.modelObject.rotation.y = 0;
        this.modelObject.scale.set(0.5, 0.5, 0.5);
        this.modelObject.updateMatrix();

        this.object = new THREE.Object3D();
        this.object.add(this.modelObject);

        this.hasMoved = true;

        this._rayCaster = new THREE.Raycaster();
        this._rayCaster.far = 200;

    }


    Tyranosaur.prototype.resetMoveTime = function() {
        this.moveTimer = new Helpers.deltaTimer();
    };

    Tyranosaur.prototype.setType = function(type) {
        var color;
        switch(type) {
            case 'bot':
                color = 0xBB0033;
                break;
            case 'player':
            default:
                color = 0x11AA11;

        }
        var material = new THREE.MeshLambertMaterial({color: color});
        this.modelObject.material = material;
    };

    Tyranosaur.prototype.moveAsKeyboard = function(keys) {

        var keyboardVector = new THREE.Vector3(0,0,0);

        if(!keys.length) {
            keys = [keys];
        }
        if(keys.length !== 0)
            this.hasMoved = true;

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            switch (key) {
                case 'UP':
                    keyboardVector.x += 1;
                    break;
                case 'DOWN':
                    keyboardVector.x += -1;
                    break;
                case 'LEFT':
                    keyboardVector.z += -1;
                    break;
                case 'RIGHT':
                    keyboardVector.z += 1;
                    break;
            }
        }

        if(keyboardVector.z !== 0) {
            this.lastStrafe = keyboardVector.z;
        }
        else if(keyboardVector.x === -1) {
            this.lastStrafe = this.lastStrafe || 1;
            keyboardVector.z = this.lastStrafe * 0.1;
        }

        var camera = this._game.getScene().camera;
        keyboardVector.applyAxisAngle(new THREE.Vector3(0,1,0), (camera.rotation.y - 3*Math.PI/2));

        this.direction = keyboardVector;

        var delta = this.moveTimer.getDelta();

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

        rotation.y = -Math.atan2(this.direction.z, this.direction.x);

        return rotation;
    };

    Tyranosaur.prototype.collideWith = function(ennemyTyra) {
        var direction = this.fromRotationToDirection();

        this._rayCaster.set(this.object.position, direction);
        var collisions = this._rayCaster.intersectObject(ennemyTyra.modelObject);

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

