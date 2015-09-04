var expect = require("chai").expect;

var Helpers = require("../../server/modules/helpers.js");


describe('Helpers', function() {

    it('scaleVect null', function() {
        var a = null, b = null;
        Helpers.scaleVect(0.1, a, b);

        expect(b).to.be.null;
    });

    it('scale vect', function() {
        var a = [0,1,2], b;
        b = Helpers.scaleVect(2, a);

        expect(b).not.to.be.null;
        expect(b.length).to.equal(3);
        expect(b[0]).to.equal(0);
        expect(b[1]).to.equal(2);
        expect(b[2]).to.equal(4);
    });

    it('scale vect negative', function() {
        var a = [0,2], b;
        b = Helpers.scaleVect(-3, a);

        expect(b).not.to.be.null;
        expect(b.length).to.equal(2);
        expect(b[0]).to.equal(0);
        expect(b[1]).to.equal(-6);
    });
    it('scale vect float', function() {
        var a = [0,1,2], b;
        b = Helpers.scaleVect(0.5, a);

        expect(b).not.to.be.null;
        expect(b.length).to.equal(3);
        expect(b[0]).to.equal(0);
        expect(b[1]).to.equal(0.5);
        expect(b[2]).to.equal(1);
    });

    it('scale vect errs', function() {
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

    it('addVect errors', function() {
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

    it('generates integers', function() {
        var integer = Helpers.generateInteger(200);
        var decimal = integer - Math.round(integer);
        expect(decimal).to.equal(0);

        for(var i=0; i<500; i++) {
            integer = Helpers.generateInteger(200);

            expect(integer).to.be.lte(200);
            expect(integer).to.be.gte(0);
        }
    });

    it('generates sign', function() {

        var roger = false;
        for(var i=0; i<20; i++) {
            roger = roger || (Helpers.generateSign() === 1);
        }
        expect(roger).to.be.true;

        roger = false;
        for(var i=0; i<20; i++) {
            roger = roger || (Helpers.generateSign() === -1);
        }
        expect(roger).to.be.true;
    });

    it('computes norm', function() {
        var vector = [3,4,5];
        var exp = Math.sqrt(3*3 + 4*4 + 5*5);

        expect(Helpers.vectorNorm(vector)).to.be.closeTo(exp, 0.001);
    });
    it('normalizes 1', function() {
        var vector = [0,0,10];
        var normalized = Helpers.normalize(vector);

        expect(normalized.length).to.equal(3);
        expect(normalized[0]).to.closeTo(0, 0.01);
        expect(normalized[1]).to.closeTo(0, 0.01);
        expect(normalized[2]).to.closeTo(1, 0.01);
    });

    it('normalizes 2', function() {
        var vector = [10,0,0];
        var normalized = Helpers.normalize(vector);

        expect(normalized.length).to.equal(3);
        expect(normalized[0]).to.closeTo(1, 0.01);
        expect(normalized[1]).to.closeTo(0, 0.01);
        expect(normalized[2]).to.closeTo(0, 0.01);
    });

    it('normalizes 3', function() {
        var vector = [10,0,-10];
        var normalized = Helpers.normalize(vector);

        expect(normalized.length).to.equal(3);
        expect(normalized[0]).to.closeTo(Math.sqrt(1/2), 0.01);
        expect(normalized[1]).to.closeTo(0, 0.01);
        expect(normalized[2]).to.closeTo(-Math.sqrt(1/2), 0.01);
    });

    it('compute distance between two point', function() {
        var point1 = [10,0,10];
        var point2 = [20,0,20];

        expect(Helpers.distanceBetween(point1, point2)).to.be.closeTo(Math.sqrt(200), 0.001);
        expect(Helpers.distanceBetween(point2, point1)).to.be.closeTo(Math.sqrt(200), 0.001);
    });
    it('compute distance between two point b', function() {
        var point1 = [0,0,0];
        var point2 = [10,0,10];

        expect(Helpers.distanceBetween(point1, point2)).to.be.closeTo(Math.sqrt(200), 0.001);
        expect(Helpers.distanceBetween(point2, point1)).to.be.closeTo(Math.sqrt(200), 0.001);
    });


    it('compute distance between two point c', function() {
        var point1 = [0,0,0];
        var point2 = [10,0,0];

        expect(Helpers.distanceBetween(point1, point2)).to.be.closeTo(10, 0.001);
        expect(Helpers.distanceBetween(point2, point1)).to.be.closeTo(10, 0.001);
    });


});
