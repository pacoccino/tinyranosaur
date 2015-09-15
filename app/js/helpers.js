function Helpers() {

}

Helpers.idGenerator = function() {
    return _.uniqueId();
};

Helpers.deltaTimer = function() {
    this.timestamp = null;
};

Helpers.deltaTimer.prototype.getDelta = function() {
    if(!this.timestamp) {
        this.timestamp = Date.now();
    }

    var now = Date.now();
    var delta = (Date.now() - this.timestamp)/1000;
    this.timestamp = now;

    return delta;
};
