// Interface to firebase

function Multiplayer(authentication) {

  var _ed = new THREE.EventDispatcher();
  var _firebase = authentication.getMultiplayer();

  _ed.addEventListener('me.update', function(event) {
    var ref = _firebase.me;

    var object = event.object;

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

  _firebase.others.on("child_changed", function(snapshot) {
    if(snapshot.key() !== _firebase.authId) {
      _ed.dispatchEvent( {
        type: 'player.update',
        key: snapshot.key(),
        data: snapshot.val()
      });
    }
  });
}
