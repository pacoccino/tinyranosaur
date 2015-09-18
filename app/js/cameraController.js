function CameraController(camera, tyranosaur) {
    this.camera = camera;
    this.tyra = tyranosaur;

    this.distance = CameraController._DMAX_;
    this.theta = 3*Math.PI/2;

    this.moveTimer = new Helpers.deltaTimer();
}

// Constants

CameraController._DMAX_ = 150;
CameraController._THETAMAX_ = 1;
CameraController._HIGH_ = 50;

// Class Method

CameraController.prototype.statsCamera = function() {
    console.log(this.camera.position);
    console.log(this.camera.rotation);
};

CameraController.prototype.placeCamera = function() {

    this.camera.position.copy(this.findPositionFromTyra());
    this.camera.position.y = CameraController._HIGH_;

    //this.camera.lookAt(this.tyra.object.position);

    this.camera.rotation.x = 0;
    this.camera.rotation.y = this.theta; //- Math.PI;
    this.camera.rotation.z = 0;
};

CameraController.prototype.findPositionFromTyra = function() {
    var distance = this.computeNewDistance();
    this.theta = CameraController.getPositiveAngle(this.computeNewTheta());
    //this.theta = this.destinationTheta();
    var addVect = CameraController.getVectorFromPolar(distance, this.theta);

    var newPosition = new THREE.Vector3();
    newPosition.addVectors(this.tyra.object.position, addVect);

    return newPosition;
};

CameraController.prototype.computeNewDistance = function() {
    return CameraController._DMAX_;
};

CameraController.prototype.computeNewTheta = function() {

    var deltaTheta = this.deltaTheta();

    var deltaThetaTimed = deltaTheta * this.moveTimer.getDelta();

    return CameraController.angleAdd(deltaThetaTimed, this.theta);
};

CameraController.prototype.destinationTheta = function() {

    var polarTyraDest = CameraController.getPolarFromVector(this.tyra.direction);
    var thetaTyra = polarTyraDest.theta;

    return CameraController.angleAdd(thetaTyra, Math.PI);
};

CameraController.prototype.deltaTheta = function() {

    var distanceTheta = this.destinationTheta() - this.theta;

    var raccourci = 0;
    if(Math.abs(distanceTheta) > Math.PI) {
        if(distanceTheta > 0)
            raccourci = -2*Math.PI;
        else
            raccourci = 2*Math.PI;
    }
    var deltaTheta = CameraController.angleAdd(distanceTheta, raccourci);

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

    polar.theta = CameraController.getPositiveAngle(polar.theta);

    return polar;
};

CameraController.getPositiveAngle = function(angle) {
    return CameraController.angleAdd(angle, 2*Math.PI);
};

CameraController.angleAdd = function(angle1, angle2) {
    return (angle1 + angle2) % (2*Math.PI);
};

