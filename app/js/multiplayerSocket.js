// Interface to firebase

function Multiplayer(authentication) {

    var self = this;

    var _ed = new THREE.EventDispatcher();
    var _socket = io('http://localhost:8888/game');

    this.me = {};

    this.emit = function(event) {
        _socket.emit(event.type, event.params);
    };

    this.on = function( type, callback ) {
        _ed.addEventListener(type, callback);
    };

    this.listen = function() {

        _socket.on("game state", function(state) {
            self.me._id = state.me._id;

            for(var i=0; i<state.users.length; i++) {
                var player = state.users[i];

                if(player._id === self.me._id) continue;

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
            if(player._id === self.me._id) return;

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
    };

}
