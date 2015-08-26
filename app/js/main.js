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
        initGame();
    });

    function authenticate(callback) {

      var authentication = new Authentication_Socket();
      authentication.auth(function(success) {
        if(success) {
          _authentication = authentication;
          callback && callback();
        }
      });
    }

    function initGame() {

        game = new Game(THREE);

        //game.multiplayer = new Multiplayer(_authentication);
        game.multiplayer = new Multiplayer_Socket(_authentication);

        gameContainer = $("#game-container");
        gameContainer.append( game.getRendererElement());

        game.init(function() {
            game.multiplayer.listen();
            animate();
        });
    }

    function animate() {
        requestAnimationFrame( animate );


        game.renderLoop();
    }

});
