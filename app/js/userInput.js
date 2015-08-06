function UserInput (game, domElement) {
    var _game = game;
    var _domElement = domElement;

    var _ed = new THREE.EventDispatcher();

    var KEYS = {
        UP: 'Z',
        DOWN: 'S',
        LEFT: 'Q',
        RIGHT: 'D'
    };

    function convertKeysToCharCode(keys) {
        var properties = Object.getOwnPropertyNames(keys);
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            keys[property] = keys[property].charCodeAt(0);
        }
    }

    convertKeysToCharCode(KEYS);

    function onMouseDown( event ) {

    }

    function onMouseMove( event ) {

    }

    function onMouseUp( event ) {

    }

    function onMouseWheel( event ) {

    }

    function onKeyDown( event ) {
        switch(event.keyCode) {
            case KEYS.UP:
                _ed.dispatchEvent( {type:'advance_start'} );
                break;
            case KEYS.DOWN:
                break;
            case KEYS.LEFT:
                _ed.dispatchEvent( {type:'left_start'} );
                break;
            case KEYS.RIGHT:
                _ed.dispatchEvent( {type:'right_start'} );
                break;
        }
    }

    function onKeyUp( event ) {

        switch(event.keyCode) {
            case KEYS.UP:
                _ed.dispatchEvent( {type:'advance_stop'} );
                break;
            case KEYS.DOWN:
                break;
            case KEYS.LEFT:
                _ed.dispatchEvent( {type:'left_stop'} );
                break;
            case KEYS.RIGHT:
                _ed.dispatchEvent( {type:'right_stop'} );
                break;
        }
    }

    function dropKeys() {

        _ed.dispatchEvent( {type:'advance_stop'} );
        _ed.dispatchEvent( {type:'left_stop'} );
        _ed.dispatchEvent( {type:'right_stop'} );
    }

    _domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    _domElement.addEventListener( 'mousedown', onMouseDown, false );
    _domElement.addEventListener( 'mousewheel', onMouseWheel, false );
    _domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    window.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'keyup', onKeyUp, false );;
    window.addEventListener( 'blur', dropKeys, false );

    _game.inputDispatcher = _ed;
}
