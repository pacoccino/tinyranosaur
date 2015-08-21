var expect = require("chai").expect;

var Users = require("../../server/models/users");


describe('Users', function() {
    describe('list', function() {
        it('should create', function(done) {
            Users.create(function(user) {

                expect(user).to.exist;
                expect(user._id).to.exist;
                expect(user.name).to.exist;
                expect(user.position).to.be.equal(0);
                done();
            });
        });
    });
});
