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


Helpers.generateInteger = function(max) {

    var rand = Math.random();

    var integer = Math.floor(rand * max);

    return integer;
};

Helpers.generateSign = function() {

    return (Math.random() < 0.5) ? -1 : 1;
};

Helpers.normalize = function(vector) {

    if (!vector || !vector.length) return;

    var normalized = [];
    var sum = 0;

    for(var i=0; i<vector.length; i++) {
        sum += Math.pow(vector[i], 2);
    }

    sum = Math.sqrt(sum);

    for(var i=0; i<vector.length; i++) {
        normalized.push(vector[i] / sum);
    }

    return normalized;
};

module.exports = Helpers;
