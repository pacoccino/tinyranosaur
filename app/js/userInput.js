function UserInput (domElement) {
    if (!domElement) return;

    var self = this;

    self.domElement = domElement;

    self.KEYS = {
        UP: {
            active: false,
            codes: ['Z', 38]
        },
        DOWN: {
            active: false,
            codes: ['S', 40]
        },
        LEFT: {
            active: false,
            codes: ['Q', 37]
        },
        RIGHT: {
            active: false,
            codes: ['D', 39]
        },
        POO: {
            active: false,
            codes: ['P', 32]
        },
        MOUSE: {
            active: false,
            deltaX: 0,
            deltaY: 0
        }
    };

    self.touchData = null;

    function onMouseDown(event) {
        self.KEYS.MOUSE.active = true;
    }

    function onMouseMove(event) {

        self.KEYS.MOUSE.deltaX += 1;
        self.KEYS.MOUSE.deltaY += 1;
    }

    function onMouseUp(event) {

        self.KEYS.MOUSE.active = false;
    }

    function onMouseWheel(event) {

    }

    function onKeyDown(event) {

        self.parseEventCode(event.keyCode, 'DOWN');
    }

    function onKeyUp(event) {

        self.parseEventCode(event.keyCode, 'UP');
    }

    function dropKeys() {

        self.dropKeys.call(self);
    }

    function ignore(event) {
        if(event)
            event.preventDefault();
    }

    function onTouchStart(event) {

        var touch = event.touches[0];

        if(touch)
            self.touch('start', touch.pageX, touch.pageY);

        event.preventDefault();
    };

    function onTouchEnd(event) {

        var touch = event.touches[0];

        self.touch('end');

        event.preventDefault();
    };

    function onTouchMove(event) {

        var touch = event.touches[0];

        if(touch)
            self.touch('move', touch.pageX, touch.pageY);

        event.preventDefault();
    };

    // Ignore right click
    self.domElement.addEventListener('contextmenu', ignore, false);

    // Mouse
    self.domElement.addEventListener('mousedown', onMouseDown, false);
    self.domElement.addEventListener('mouseup', onMouseUp, false);
    self.domElement.addEventListener('mousemove', onMouseMove, false);
    self.domElement.addEventListener('mousewheel', onMouseWheel, false);
    self.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox

    // Touch
    self.domElement.addEventListener('touchstart', onTouchStart, false);
    self.domElement.addEventListener('touchmove', onTouchMove, false);
    self.domElement.addEventListener('touchend', onTouchMove, false);

    // Keyboard
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
    window.addEventListener('blur', dropKeys, false);

}


UserInput.prototype.dropKeys = function() {

    for (var keyName in this.KEYS) {
        if (this.KEYS.hasOwnProperty(keyName)) {
            var key = this.KEYS[keyName];
            key.active = false;
        }
    }

    this.touchData = null;
};

UserInput.prototype.touch = function(action, x, y) {

    var self = this;

    function wrapDistance(distance) {

        var max = 100;

        return Math.min(distance, max)/max;
    }

    function initTouch(x,y) {
        self.touchData = {};
        self.touchData.initX = x;
        self.touchData.initY = y;
    }
    function updateTouch(x,y) {
        self.touchData.x = x;
        self.touchData.y = y;
        self.touchData.devX = wrapDistance(  x - self.touchData.initX );
        self.touchData.devY = wrapDistance(-(y - self.touchData.initY));
        console.log(self.touchData.initX)
        console.log(self.touchData.x)
    }
    function deleteTouch() {
        self.touchData = null;
    }

    if(action === 'start') {
        initTouch(x,y);
        updateTouch(x,y);
    }
    else if(action === 'move') {
        updateTouch(x,y);
    }
    else if(action === 'end') {
        deleteTouch();
    }
};

UserInput.prototype.parseEventCode = function(eventCode, action) {

    keys:
        for(var keyName in this.KEYS) {

            if(this.KEYS.hasOwnProperty(keyName)) {

                var key = this.KEYS[keyName];

                if(!key.codes) {
                    continue;
                }

                for(var i=0; i<key.codes.length; i++) {
                    var code = key.codes[i];

                    if(UserInput.isSameCode(eventCode, code)) {

                        key.eventTimestamp = Date.now();

                        switch (action) {
                            case 'UP':
                                key.active = false;
                                break;
                            case 'DOWN':
                                key.active = true;
                                break;
                        }

                        break keys;
                    }
                }
            }
        }
};

Number.isInteger = Number.isInteger || function(value) {
        return typeof value === "number" &&
            isFinite(value) &&
            Math.floor(value) === value;
};

UserInput.isSameCode = function(eventCode, keyCode) {
    var keyCharCode = 0;
    if(Number.isInteger(keyCode)) {
        keyCharCode = keyCode;
    }
    else if (typeof keyCode === 'string'){
        keyCharCode = UserInput.convertKeyToCharCode(keyCode);
    }

    return eventCode === keyCharCode;
};

UserInput.convertKeyToCharCode = function(key) {
    return key.charCodeAt(0);
};
