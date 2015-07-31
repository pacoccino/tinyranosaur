function Game(THREE) {

    var scene, camera, renderer;
    var geometry, material, mesh;

    var tyranosaur;

    this.init = function() {

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

        camera.position.z = 1000;

        tyranosaur = new Tyranosaur();
        scene.add( tyranosaur.getMesh() );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
    };

    this.renderLoop = function() {

        tyranosaur.rotate();


        renderer.render( scene, camera );
    };

    this.getRendererElement = function() {
        return renderer.domElement;
    };


    function onWindowResize(){

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    window.addEventListener( 'resize', onWindowResize, false );
}
