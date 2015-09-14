
describe('Tyranosaur class', function() {

    it('create', function() {
        var tyra = new Tyranosaur(game);

        // Public
        expect(tyra.hasMoved).toBe(true);
        expect(tyra.object instanceof  THREE.Object3D).toBeTruthy();
        expect(tyra.boundingBlock instanceof THREE.Object3D).toBeTruthy();

        // Private
        expect(tyra._game).toBe(game);
        expect(tyra._maxCollideDistance).toBe(40);
        expect(tyra._rayCaster instanceof THREE.Raycaster).toBeTruthy();
        expect(tyra._actualVelocity instanceof THREE.Object3D).toBeTruthy();
        expect(tyra._targetVelocity instanceof THREE.Object3D).toBeTruthy();
        expect(tyra._poos instanceof Array).toBeTruthy();
        expect(tyra._poos.length).toBe(0);

        var object = tyra.object;
        var modelObject = object.children[0];
        expect(modelObject).toBeDefined();
        expect(modelObject.scale.x).toBe(0.5);
        //expect(modelObject.rotation.y).toBe(-Math.PI/2);
    });

    it('moveFrame', function() {
        var tyra = new Tyranosaur(game);

        tyra.moveFrame();

    });

    it('getDirection', function() {
        var tyra = new Tyranosaur(game), direction;

        direction = tyra.fromRotationToDirection();
        expect(direction.x).toBeCloseTo(0);
        expect(direction.y).toBeCloseTo(0);
        expect(direction.z).toBeCloseTo(1);

        tyra.object.rotation.y = Math.PI/2;
        direction = tyra.fromRotationToDirection();
        expect(direction.x).toBeCloseTo(1);
        expect(direction.y).toBeCloseTo(0);
        expect(direction.z).toBeCloseTo(0);

        tyra.object.rotation.y = Math.PI;
        direction = tyra.fromRotationToDirection();
        expect(direction.x).toBeCloseTo(0);
        expect(direction.y).toBeCloseTo(0);
        expect(direction.z).toBeCloseTo(-1);

        tyra.object.rotation.y = 3*Math.PI/2;
        direction = tyra.fromRotationToDirection();
        expect(direction.x).toBeCloseTo(-1);
        expect(direction.y).toBeCloseTo(0);
        expect(direction.z).toBeCloseTo(0);

    });

    it('raycasts without rendering', function() {
        var scene = new THREE.Scene();

        var globGeom = new THREE.BoxGeometry(10, 10, 10);
        var globMaterial = new THREE.MeshBasicMaterial({
            color: '0xFF0000'
        });
        var block = new THREE.Mesh(globGeom, globMaterial);

        var object1 = block.clone();
        object1.position.z = 20;

        scene.add(object1);

        scene.updateMatrixWorld(true);

        var raycaster = new THREE.Raycaster();
        var direction = new THREE.Vector3(0,0,1);
        var from = new THREE.Vector3(0,0,0);

        raycaster.set(from, direction);
        var collisions = raycaster.intersectObject(object1);
        expect(collisions.length).toBeGreaterThan(0);
    });

    xit('collideWith', function() {
        var ghostScene = new THREE.Scene();

        var tyra1 = new Tyranosaur(game);
        var tyra2 = new Tyranosaur(game);
        tyra2.object.position.z = 40;
        tyra2.object.rotation.y = Math.PI;

        ghostScene.add(tyra1.object);
        ghostScene.add(tyra2.object);
        ghostScene.updateMatrixWorld();

        expect(tyra1.collideWith(tyra2)).toBeTruthy();
    });

});
