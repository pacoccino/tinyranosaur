// Interface to firebase

function Multiplayer_Socket(game) {

    var _game = game;
    var _ed = new THREE.EventDispatcher();
    var _auth = _game.authentication;
    var _socket = _auth.socket;

    this.emit = function(event) {
        _socket.emit(event.type, event.params);
    };

    this.on = function( type, callback ) {
        _ed.addEventListener(type, callback);
    };

    this.listen = function() {

        _socket.on("game state", function(state) {
            for(var i=0; i<state.users.length; i++) {
                var player = state.users[i];

                if(player._id === _auth.info._id) continue;

                _ed.dispatchEvent( {
                    type: 'player new',
                    player: player
                });
            }
        });

        _socket.on("player new", function(player) {
            _ed.dispatchEvent( {
                type: 'player new',
                player: player
            });
        });

        _socket.on("player update", function(player) {

            _ed.dispatchEvent( {
                type: 'player update',
                player: player
            });
        });

        _socket.on("player leave", function(id) {
            _ed.dispatchEvent( {
                type: 'player leave',
                _id: id

            });
        });

        _auth.listenReady();
    };

}
