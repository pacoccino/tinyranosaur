var game;
var _authentication, _gameContainer;


// TODO waterfallize
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


    _gameContainer = $("#game-container");
    game.setContainer(_gameContainer);

    // TODO Rename
    game.setAuthentication(_authentication);

    game.init(function() {

        animate();
    });
}

function animate() {
    requestAnimationFrame( animate );

    game.renderLoop();
}

