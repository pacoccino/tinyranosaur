
describe('Tyranosaur class', function() {

    it('create', function() {
        var tyra = new Tyranosaur(game);
        expect(tyra.hasMoved()).toBe(true);

        var object = tyra.getObject();
        expect(object).toBeDefined();
        var modelObject = object.children[0];
        expect(modelObject).toBeDefined();
        expect(modelObject.scale.x).toBe(0.5);
        expect(modelObject.rotation.y).toBe(-Math.PI/2);
    });

});
