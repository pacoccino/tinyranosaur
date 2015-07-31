require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: { 'vendor/three': { exports: 'THREE' } }
}, [
    'vendor/three'
], function(THREE) {

    var game, gameContainer;

    init();

    function init() {

        game = new Game(THREE);

        game.init(function() {
            animate();
        });

        gameContainer = $("#game-container");
        gameContainer.append( game.getRendererElement());

    }

    function animate() {
        requestAnimationFrame( animate );


        game.renderLoop();
    }

});
