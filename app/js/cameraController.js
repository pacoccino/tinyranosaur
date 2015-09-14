function CameraController(camera, tyranosaur) {
    this.camera = camera;
    this.tyra = tyranosaur;

    this.distance = CameraController._DMAX_;
    this.theta = 0;
    this.deltaT = 0;
}

// Constants

CameraController._DMAX_ = 150;
CameraController._THETAMAX_ = 1;
CameraController._HIGH_ = 50;

// Class Method

CameraController.prototype.placeCamera = function() {
    this.computeDeltaT();

    this.camera.position.copy(this.findPositionFromTyra());
    this.camera.position.y = CameraController._HIGH_;
    //this.camera.lookAt(this.tyra.object.position);
    this.camera.rotation.x = 0;
    this.camera.rotation.y = this.theta;
    this.camera.rotation.z = 0;
    console.log(this.camera.rotation);
};

CameraController.prototype.findPositionFromTyra = function() {
    var distance = this.computeNewDistance();
    this.theta = this.computeNewTheta();
    var addVect = CameraController.getVectorFromPolar(distance, this.theta);

    var newPosition = new THREE.Vector3();
    newPosition.addVectors(this.tyra.object.position, addVect);

    return newPosition;
};

CameraController.prototype.computeDeltaT = function() {
    if(!this.timestamp) {
        this.timestamp = Date.now();
    }

    var now = Date.now();
    this.deltaT = (Date.now() - this.timestamp)/1000;
    this.timestamp = now;
};

CameraController.prototype.computeNewDistance = function() {
    return CameraController._DMAX_;
};

CameraController.prototype.computeNewTheta = function() {

    var deltaTheta = this.deltaTheta();

    var newTheta = deltaTheta * this.deltaT + this.theta;

    return newTheta;
};

CameraController.prototype.destinationTheta = function() {

    var polarTyraDest = CameraController.getPolarFromVector(this.tyra.direction);

    return (polarTyraDest.theta + Math.PI) % (2*Math.PI);
};

CameraController.prototype.deltaTheta = function() {

    var distanceTheta = this.destinationTheta() - this.theta;

    var deltaTheta = distanceTheta;
    //var deltaTheta = CameraController._THETAMAX_  * Math.exp(-1/distanceTheta);

    return deltaTheta;
};

// Static methods

CameraController.getVectorFromPolar = function(distance, theta) {
    var vector = new THREE.Vector3(0,0,1);
    var rotVect = new THREE.Vector3(0,1,0);

    vector.applyAxisAngle(rotVect, theta);

    vector.setLength(distance);
    return vector;
};

CameraController.getPolarFromVector = function(vector) {
    var polar = {
        d:0,
        theta: 0
    };
    polar.d = vector.length();

    var ZVect = new THREE.Vector3(0,0,1);
    polar.theta = ZVect.angleTo(vector);
    polar.theta = Math.atan2(vector.x, vector.z);

    return polar;
};
