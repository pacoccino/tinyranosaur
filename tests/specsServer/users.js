var expect = require("chai").expect;

var Helpers = require("../../server/modules/helpers");
var Users = require("../../server/models/users");
var User = require("../../server/models/user");
var Tyranosaur = require("../../server/models/tyranosaur");

describe('Users', function() {
    describe('User', function () {
        it('should create', function () {
            var user = new User();

            expect(user).to.exist;
            expect(user._id).to.exist;
            expect(user.name).to.exist;
            expect(user.bot).to.be.false;
            expect(user.speed).to.equal(10);
            expect(user.tyranosaur).to.exist;
            expect(user.tyranosaur instanceof Tyranosaur).to.be.true;
            expect(user.tyranosaur.position[1]).to.equal(30);
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

        it('tells inactivity', function() {
            var user = new User();
            var now = new Date().getMilliseconds();

            expect(user.isInactive()).to.be.false;
            user.heartTime = now - 50;
            expect(user.isInactive()).to.be.false;
            user.heartTime = now - 2000;
            expect(user.isInactive()).to.be.true;
        });

        it('receives heartBeat', function() {

            var user = new User();
            var t1 = new Date().getMilliseconds();
            user.heartBeat();
            var t2 = new Date().getMilliseconds();

            expect(user.heartTime).to.be.gte(t1);
            expect(user.heartTime).to.be.lte(t2);
        });

        it('moves tyranosaur', function() {
            var user = new User();
            var fntmp = User.prototype.isCorrectMove;
            User.prototype.isCorrectMove = function() { return true; };

            var newState = {
                position: [1,0,10],
                rotation: [2,0,20,'xyz']
            };
            user.move(newState);

            expect(user.tyranosaur.position[2]).to.equal(10);
            expect(user.tyranosaur.rotation[2]).to.equal(20);

            User.prototype.isCorrectMove = fntmp;

        });

        it('accepts correct move', function() {

            var user = new User();
            user.tyranosaur.position = [ 0,0,0 ];
            var newPos = [1,0,0];
            user.speed = 2;

            expect(user.isCorrectMove(newPos)).to.be.true;
        });

        it('rejects incorrect move', function() {

            var user = new User();
            user.tyranosaur.position = [ 0,0,0 ];
            var newPos = [5,0,0];
            user.speed = 2;

            expect(user.isCorrectMove(newPos)).to.be.false;
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
});
