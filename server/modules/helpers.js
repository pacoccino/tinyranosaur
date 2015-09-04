var _ = require('lodash');

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

Helpers.stopClock = function() {

    deltaTimestamp = null;
};


Helpers.generateInteger = function(max) {

    var rand = Math.random();

    return Math.floor(rand * max);
};

Helpers.generateSign = function() {

    return (Math.random() < 0.5) ? -1 : 1;
};

Helpers.vectorNorm = function(vector) {
    if (!vector || !vector.length) return;

    var sum = 0;

    for(var i=0; i<vector.length; i++) {
        sum += Math.pow(vector[i], 2);
    }

    return Math.sqrt(sum);
};
Helpers.normalize = function(vector) {

    if (!vector || !vector.length) return;

    var normalized = [];
    var norm = Helpers.vectorNorm(vector);
    for(var j=0; j<vector.length; j++) {
        normalized.push(vector[j] / norm);
    }

    return normalized;
};

Helpers.idGenerator = function() {
    /*var length = 10;
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;*/

    return _.uniqueId();
};

Helpers.randomName = function() {
    var length = 6;
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxyz';

    text += possible.charAt(Math.floor(Math.random() * possible.length)).toUpperCase();
    for (var i = 1; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

Helpers.distanceBetween = function(point1, point2) {

    var minus2 = Helpers.scaleVect(-1, point2);

    var vector = Helpers.addVect(point1, minus2);

    return Helpers.vectorNorm(vector);
};

module.exports = Helpers;
