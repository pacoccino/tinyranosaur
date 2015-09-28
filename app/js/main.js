var _game, _authentication, _gameContainer;

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

    _game = new Game();


    _gameContainer = $("#game-container");
    _game.container = _gameContainer;

    // TODO Rename
    _game.authentication = _authentication;

    _game.init(function() {

        animate();
    });
}

function animate() {
    requestAnimationFrame( animate );

    _game.renderLoop();
}
