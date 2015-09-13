function UserInput (domElement) {
    if (!domElement) return;

    var self = this;

    self.domElement = domElement;

    self.ed = new THREE.EventDispatcher();

    self.KEYS = {
        UP: {
            active: false,
            codes: ['Z', 113]
        },
        DOWN: {
            active: false,
            codes: ['S', 114]
        },
        POO: {
            active: false,
            codes: ['P', 21]
        },
        MOUSE: {
            active: false,
            deltaX: 0,
            deltaY: 0
        }
    };

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

    self.domElement.addEventListener('contextmenu', ignore, false);

    self.domElement.addEventListener('mousedown', onMouseDown, false);
    self.domElement.addEventListener('mouseup', onMouseUp, false);
    self.domElement.addEventListener('mousemove', onMouseMove, false);
    self.domElement.addEventListener('mousewheel', onMouseWheel, false);
    self.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
    window.addEventListener('blur', dropKeys, false);

}


UserInput.prototype.dropKeys = function() {

    for (var keyName in this.KEYS) {
        if (this.KEYS.hasOwnProperty(keyName))
            var key = this.KEYS[keyName];
        key.active = false;
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
                                key.active = true;
                                break;
                            case 'DOWN':
                                key.active = false;
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
