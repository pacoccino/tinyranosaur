function Tyranosaur() {
    this.position = [0,0,0];
    this.rotation = [0,0,0,'xyz'];
}

Tyranosaur.prototype.move = function(newState) {
    this.position = newState.position;
    this.rotation = newState.rotation;

};

Tyranosaur.prototype.getState = function() {
    return {
        position: this.position,
        rotation: this.rotation
    };
};

module.exports = Tyranosaur;
