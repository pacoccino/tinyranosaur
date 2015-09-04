var expect = require("chai").expect;

var Helpers = require("../../server/modules/helpers");
var Users = require("../../server/models/users");
var User = require("../../server/models/user");

describe('Users', function () {

    var users;
    beforeEach(function() {
        users = new Users();
    });

    it('should create', function (done) {
        users.create(function (user) {
            expect(user).to.exist;
            expect(user instanceof User).to.be.true;
            done();
        });
    });

    it('should getAll', function (done) {
        users.create(function (user) {
            expect(user).to.exist;

            users.getAll(function (users) {
                expect(users.length).to.be.equal(1);
                expect(users[0]).to.be.equal(user);
                done();
            });
        });
    });

    it('should getAll synchronously', function (done) {
        users.create(function (user) {
            var list = users.getAllSync();
            expect(list.length).to.equal(1);
            expect(list[0]).to.equal(user);
            done();
        });
    });

    it('should delete', function (done) {
        users.create(function (user) {
            users.delete(user._id, function() {
                users.getAll(function(users) {
                    expect(users.length).to.be.equal(0);
                    done();
                });
            });
        });
    });

    it('should getAllPublic', function (done) {
        users.create(function (user) {
            expect(user).to.exist;

            users.getAllPublic(function (users) {
                expect(users.length).to.be.equal(1);
                done();
            });
        });
    });

});
