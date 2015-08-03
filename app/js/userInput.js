function UserInput (game, domElement) {
    this.game = game;
    this.domElement = domElement;

    var id = this.game.inputDispatcher;

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
                id.dispatchEvent( {type:'advance_start'} );
                break;
            case KEYS.DOWN:
                break;
            case KEYS.LEFT:
                id.dispatchEvent( {type:'left_start'} );
                break;
            case KEYS.RIGHT:
                id.dispatchEvent( {type:'right_start'} );
                break;
        }
    }

    function onKeyUp( event ) {

        switch(event.keyCode) {
            case KEYS.UP:
                id.dispatchEvent( {type:'advance_stop'} );
                break;
            case KEYS.DOWN:
                break;
            case KEYS.LEFT:
                id.dispatchEvent( {type:'left_stop'} );
                break;
            case KEYS.RIGHT:
                id.dispatchEvent( {type:'right_stop'} );
                break;
        }
    }

    this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.domElement.addEventListener( 'mousedown', onMouseDown, false );
    this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
    this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    window.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'keyup', onKeyUp, false );

}
