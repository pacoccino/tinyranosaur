require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: { 'vendor/three': { exports: 'THREE' } }
}, [
    'vendor/three'
], function(THREE) {

    var game, gameContainer;
    var _authentication;

    authenticate(function() {
      init();
    });

    function authenticate(callback) {

      var authentication = new Authentication();
      authentication.auth(function(success) {
        if(success) {
          _authentication = authentication;
          callback && callback();
        }
      });
    }

    function init() {

        game = new Game(THREE);

        game.multiplayer = new Multiplayer(_authentication);

        game.init(function() {
            animate();
            game.multiplayer.listen();
        });

        gameContainer = $("#game-container");
        gameContainer.append( game.getRendererElement());

    }

    function animate() {
        requestAnimationFrame( animate );


        game.renderLoop();
    }

});
