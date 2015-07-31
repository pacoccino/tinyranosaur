require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: { 'vendor/three': { exports: 'THREE' } }
}, [
    'vendor/three'
], function(THREE) {

    var scene, camera, renderer;
    var geometry, material, mesh;
    var gameContainer;

    var game;

    init();
    animate();

    function init() {

        game = new Game(THREE);

        game.init();

        gameContainer = $("#game-container");
        gameContainer.append( game.getRendererElement());

    }

    function animate() {
        requestAnimationFrame( animate );


        game.renderLoop();



    }

});
