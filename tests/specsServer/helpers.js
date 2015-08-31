var expect = require("chai").expect;

var Helpers = require("../../server/modules/helpers.js");


describe('Helpers', function() {

    it('scaleVect null', function() {
        var a = null, b = null;
        Helpers.scaleVect(0.1, a, b);

        expect(b).to.be.null;
    });

    it('scaleVect', function() {
        var a = [0,1,2], b;
        b = Helpers.scaleVect(2, a);

        expect(b).not.to.be.null;
        expect(b.length).to.equal(3);
        expect(b[0]).to.equal(0);
        expect(b[1]).to.equal(2);
        expect(b[2]).to.equal(4);
    });

    it('scaleVect errs', function() {
        var a, b;

        a = [];
        b = Helpers.scaleVect(2, a);
        expect(b).to.be.null;
        a = 2;
        b = Helpers.scaleVect(2, a);
        expect(b).to.be.null;
    });

    it('addVect 1', function() {
        var a = [0,1,2], b = [1,2,3], c;
        c = Helpers.addVect(a, b);

        expect(c).not.to.be.null;
        expect(c.length).to.equal(3);
        expect(c[0]).to.equal(1);
        expect(c[1]).to.equal(3);
        expect(c[2]).to.equal(5);
    });

    it('addVect errs', function() {
        var a, b, c;

        a = [];
        b = [];
        c = Helpers.addVect(a,b);
        expect(c).to.be.null;

        a = [2,3];
        b = 2;
        c = Helpers.addVect(a,b);
        expect(c).to.be.null;

        a = 2;
        b = [2,3];
        c = Helpers.addVect(a,b);
        expect(c).to.be.null;

        a = [2];
        b = [2,3];
        c = Helpers.addVect(a,b);
        expect(c).to.be.null;

        a = 2;
        b = null;
        c = Helpers.addVect(a,b);
        expect(c).to.be.null;
    });
});
