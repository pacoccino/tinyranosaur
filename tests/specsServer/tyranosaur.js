var expect = require("chai").expect;

var Tyranosaur = require("../../server/models/tyranosaur");


describe('Tyranosaur', function() {
    it('should create', function() {
        var tyranosaur = new Tyranosaur();

        expect(tyranosaur).to.exist;
        expect(tyranosaur.position).to.exist;
        expect(tyranosaur.rotation).to.exist;
        expect(tyranosaur.position[0]).to.equal(0);
        expect(tyranosaur.rotation[0]).to.equal(0);
    });

    it('should move', function() {
        var tyranosaur = new Tyranosaur();

        var newState = {
            position: [0,1,0],
            rotation: [0,1,0,'xyz']
        };

        tyranosaur.move(newState);

        expect(tyranosaur.position[0]).to.equal(0);
        expect(tyranosaur.position[1]).to.equal(1);
        expect(tyranosaur.position[2]).to.equal(0);
        expect(tyranosaur.rotation[0]).to.equal(0);
        expect(tyranosaur.rotation[1]).to.equal(1);
        expect(tyranosaur.rotation[2]).to.equal(0);

    });

    it('get state', function() {
        var tyranosaur = new Tyranosaur();

        var newState = {
            position: [0,1,0],
            rotation: [0,1,0,'xyz']
        };

        tyranosaur.move(newState);

        var state = tyranosaur.getState();

        expect(state.position[0]).to.equal(0);
        expect(state.position[1]).to.equal(1);
        expect(state.position[2]).to.equal(0);
        expect(state.rotation[0]).to.equal(0);
        expect(state.rotation[1]).to.equal(1);
        expect(state.rotation[2]).to.equal(0);
        expect(state.rotation[3]).to.equal('xyz');

    });
});
