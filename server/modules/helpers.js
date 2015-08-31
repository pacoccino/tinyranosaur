var Helpers = {};

var deltaTimestamp = null;

Helpers.scaleVect = function(coef, src) {
    if(!src || !src.length || src.length <= 0) return null;
    var dest = [];

    for(var i=0; i<src.length; i++) {
        dest[i] = src[i] * coef;
    }

    return dest;
};

Helpers.addVect = function(vect1, vect2) {
    if(!vect1 || !vect1.length || vect1.length <= 0) return null;
    if(!vect2 || !vect2.length || vect2.length <= 0) return null;
    if(vect1.length !== vect2.length) return null;

    var dest = [];

    for(var i=0; i<vect1.length; i++) {
        dest[i] = vect1[i] + vect2[i];
    }

    return dest;
};

Helpers.clockDelta = function() {

    var now = new Date(), delta;

    if(deltaTimestamp) {
        delta = now - deltaTimestamp;
    }
    else {
        delta = 0;
    }

    deltaTimestamp = now;

    return delta;
};

module.exports = Helpers;
