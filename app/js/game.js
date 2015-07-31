function Game(THREE) {

    var scene, camera, renderer;
    var geometry, material, mesh;

    this.init = function() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
    };

    this.renderLoop = function() {

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;


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
