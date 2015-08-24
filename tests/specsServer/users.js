var expect = require("chai").expect;

var Users = require("../../server/models/users");
var User = require("../../server/models/user");
var Tyranosaur = require("../../server/models/tyranosaur");

describe('User management', function() {
    describe('User', function () {
        it('should create', function () {
            var user = new User();

            expect(user).to.exist;
            expect(user._id).to.exist;
            expect(user._id.length).to.be.equal(10);
            expect(user.name).to.exist;
            expect(user.tyranosaur).to.exist;
            expect(user.tyranosaur instanceof Tyranosaur).to.be.true;
        });

        it('should transform to public', function () {
            var user = new User();
            var pUser = user.toPublic();

            expect(pUser).to.exist;
            expect(pUser._id).to.be.equal(user._id);
            expect(pUser.name).to.be.equal(user.name);
            expect(user.tyranosaur).to.exist;
            expect(user.tyranosaur.position).to.exist;
            expect(user.tyranosaur.position.length).to.be.equal(3);
            expect(user.tyranosaur.rotation).to.exist;
            expect(user.tyranosaur.rotation.length).to.be.equal(4);
        });
    });

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
});
