// Interface to firebase

function Multiplayer(authentication) {

    var _ed = new THREE.EventDispatcher();
    var _firebase = authentication.getFirebase();

    _ed.addEventListener('me.update', function(event) {
        var ref = _firebase.me;

        var object = event.params;

        ref.update({
            "position": object.position.toArray(),
            "rotation": object.rotation.toArray()
        });
    });

    this.emit = function(event) {
        _ed.dispatchEvent.call(_ed, event);
    };

    this.on = function( type, callback ) {
        _ed.addEventListener(type, callback);
    };

    _firebase.others.on("child_added", function(snapshot) {
        if(snapshot.key() !== _firebase.authId) {
            _ed.dispatchEvent( {
                type: 'player.new',
                key: snapshot.key(),
                data: snapshot.val()
            });
        }
    });

    _firebase.others.on("child_changed", function(snapshot) {
        if(snapshot.key() !== _firebase.authId) {
            _ed.dispatchEvent( {
                type: 'player.update',
                key: snapshot.key(),
                data: snapshot.val()
            });
        }
    });

    _firebase.others.on("child_removed", function(snapshot) {
        if(snapshot.key() !== _firebase.authId) {
            _ed.dispatchEvent( {
                type: 'player.leave',
                key: snapshot.key(),
                data: snapshot.val()
            });
        }
    });
}
