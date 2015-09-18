Tinyranosaur
===================
[![https://travis-ci.org/pakokrew/tinyranosaur](https://travis-ci.org/pakokrew/tinyranosaur.svg)](https://travis-ci.org/pakokrew/tinyranosaur) ![David dependencies](https://david-dm.org/pakokrew/tinyranosaur.svg/) 
[https://tinyranosaur.herokuapp.com/](https://tinyranosaur.herokuapp.com/)

Your are a tyranosaur. But you are so small. Run for your life !

### Libraries used
* ThreeJS
* NodeJs w/ Express
* Firebase (old)
* SocketIO
* Lodash
* jQuery
* Karma
* Mocha w/ Chai

### Installation

```sh
$ npm install -g grunt bower
$ npm install
```

### Running

```sh
$ npm start
```

### TODO

**GAME**
* Environnement
* Gameplay
* Intro scene
* Bundling
* Poo to slow down ennemies
* Eat ennemies
* Move players with animations

**SERVER**
* Store users and session in mongo
* Re-implement firebase api w/o storage w/ socket.io (ok)

**Next**
* Mouth/2nd finger on mobile controlling camera
* Camera smoothly following player
* Fix socket errors, disconnection, multiple connections
* Forget time without keypress
