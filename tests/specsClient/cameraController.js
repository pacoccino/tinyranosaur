var cameraController;

var fakeCamera = new THREE.Object3D();
var fakePlayer = new Player();
var deltaT = 0.5;

describe('CameraController', function() {

    beforeEach(function() {
        cameraController = new CameraController(fakeCamera, fakePlayer);
        cameraController.moveTimer = {
            getDelta:function()
            {
                return deltaT;
            }
        };
    });

    it('create', function() {
        expect(cameraController.camera).toBe(fakeCamera);
        expect(cameraController.player).toBe(fakePlayer);
    });

    it('getVectorFromPolar 1', function() {
        var distance = 10;
        var theta = Math.PI/2;

        var vector = CameraController.getVectorFromPolar(distance, theta);
        expect(vector instanceof THREE.Vector3).toBeTruthy();
        expect(vector.x).toBe(10);
        expect(vector.y).toBeCloseTo(0);
        expect(vector.z).toBeCloseTo(0);
    });

    it('getVectorFromPolar 2', function() {
        var distance = 10;
        var theta = Math.PI;

        var vector = CameraController.getVectorFromPolar(distance, theta);
        expect(vector instanceof THREE.Vector3).toBeTruthy();
        expect(vector.x).toBeCloseTo(0);
        expect(vector.y).toBeCloseTo(0);
        expect(vector.z).toBe(-10);
    });

    it('getVectorFromPolar 3', function() {
        var distance = 10;
        var theta = 3*Math.PI/2;

        var vector = CameraController.getVectorFromPolar(distance, theta);
        expect(vector instanceof THREE.Vector3).toBeTruthy();
        expect(vector.x).toBe(-10);
        expect(vector.y).toBeCloseTo(0);
        expect(vector.z).toBeCloseTo(0);
    });

    it('getVectorFromPolar 4', function() {
        var distance = 10;
        var theta = 0;

        var vector = CameraController.getVectorFromPolar(distance, theta);
        expect(vector instanceof THREE.Vector3).toBeTruthy();
        expect(vector.x).toBe(0);
        expect(vector.y).toBeCloseTo(0);
        expect(vector.z).toBeCloseTo(10);
    });

    it('getPolarFromVector 1', function() {
        var vector = new THREE.Vector3(0,0,1);

        var polar = CameraController.getPolarFromVector(vector);
        expect(polar.d).toBe(1);
        expect(polar.theta).toBeCloseTo(0);
    });

    it('getPolarFromVector 2', function() {
        var vector = new THREE.Vector3(0,0,-1);

        var polar = CameraController.getPolarFromVector(vector);
        expect(polar.d).toBe(1);
        expect(polar.theta).toBeCloseTo(Math.PI);
    });

    it('getPolarFromVector 3', function() {
        var vector = new THREE.Vector3(1,0,0);

        var polar = CameraController.getPolarFromVector(vector);
        expect(polar.d).toBe(1);
        expect(polar.theta).toBeCloseTo(Math.PI/2);
    });

    it('getPolarFromVector 4', function() {
        var vector = new THREE.Vector3(-1,0,0);

        var polar = CameraController.getPolarFromVector(vector);
        expect(polar.d).toBe(1);
        expect(polar.theta).toBeCloseTo(3*Math.PI/2);
    });

    it('destinationTheta 1', function() {
        fakePlayer.tyranosaur.direction = new THREE.Vector3(0,0,1);

        expect(cameraController.destinationTheta()).toBeCloseTo(Math.PI);
    });

    it('destinationTheta 2', function() {
        fakePlayer.tyranosaur.direction = new THREE.Vector3(1,0,0);

        expect(cameraController.destinationTheta()).toBeCloseTo(3*Math.PI/2);
    });

    it('destinationTheta 3', function() {
        fakePlayer.tyranosaur.direction = new THREE.Vector3(-1,0,0);

        expect(cameraController.destinationTheta()).toBeCloseTo(Math.PI/2);
    });

    it('destinationTheta 4', function() {
        fakePlayer.tyranosaur.direction = new THREE.Vector3(0,0,-1);

        expect(cameraController.destinationTheta()).toBeCloseTo(0);
    });

    it('deltaTheta 1', function() {
        fakePlayer.tyranosaur.direction = new THREE.Vector3(0,0,1);
        cameraController.theta = Math.PI/2;

        expect(cameraController.deltaTheta()).toBeCloseTo(Math.PI/2);
    });

    it('deltaTheta 2', function() {
        fakePlayer.tyranosaur.direction = new THREE.Vector3(1,0,0);
        cameraController.theta = 0;

        expect(cameraController.deltaTheta()).toBeCloseTo(-Math.PI/2);
    });

    xit('computeNewDistance', function() {
        deltaT = 0.5;
        // TODO
        expect(cameraController.computeNewDistance(deltaT)).toBe(CameraController._PROP_DIST_SIZE_);
    });

    it('computeNewTheta', function() {
        fakePlayer.tyranosaur.direction = new THREE.Vector3(1,0,0);
        cameraController.theta = 0;
        deltaT = 0.5;
        expect(cameraController.computeNewTheta(deltaT)).toBe(-Math.PI/4);
    });

    it('findPositionFromTyra 1', function() {
        fakePlayer.tyranosaur.object.position = new THREE.Vector3(0,0,0);
        fakePlayer.tyranosaur.direction.copy(new THREE.Vector3(1,0,0));
        cameraController.theta = 0;
        deltaT = 0.5;
        var newPosition = cameraController.findPositionFromTyra();

        expect(newPosition instanceof THREE.Vector3).toBeTruthy();

        expect(newPosition.z).toBeCloseTo(Math.sqrt(2)/2 * CameraController._PROP_DIST_SIZE_);
        expect(newPosition.x).toBeCloseTo(-Math.sqrt(2)/2 * CameraController._PROP_DIST_SIZE_);

        expect(newPosition.y).toBe(0);
    });

    it('findPositionFromTyra 2', function() {
        fakePlayer.tyranosaur.object.position.z = 1;
        fakePlayer.tyranosaur.direction.x = 0;
        fakePlayer.tyranosaur.direction.z = -1;
        cameraController.theta = Math.PI/2;
        deltaT = 0.5;
        var newPosition = cameraController.findPositionFromTyra();

        expect(newPosition instanceof THREE.Vector3).toBeTruthy();

        expect(newPosition.z).toBeCloseTo(1 + Math.sqrt(2)/2 * CameraController._PROP_DIST_SIZE_);
        expect(newPosition.x).toBeCloseTo(Math.sqrt(2)/2 * CameraController._PROP_DIST_SIZE_);

        expect(newPosition.y).toBe(0);
    });

});
