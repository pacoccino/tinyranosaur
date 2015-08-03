function UserInput (game, domElement) {
  this.domElement = domElement;

  function onMouseDown( event ) {

  }

  function onMouseMove( event ) {

  }

  function onMouseUp( event ) {

  }

  function onMouseWheel( event ) {

  }

  function onKeyDown( event ) {

  }

  function onKeyUp( event ) {

  }

  this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
  this.domElement.addEventListener( 'mousedown', onMouseDown, false );
  this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
  this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener( 'keyup', onKeyUp, false );

}
