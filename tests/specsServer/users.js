var expect = require("chai").expect;

var Helpers = require("../../server/modules/helpers");
var Users = require("../../server/modules/users");
var Game = require("../../server/modules/game.js");
var User = require("../../server/models/user");

var users, game;
describe('Users', function () {

    beforeEach(function() {
        game = new Game();
        users = new Users(game);
    });

    it('should create', function (done) {
        users.create(function (user) {
            expect(user).to.exist;
            expect(user instanceof User).to.be.true;
            expect(users.users.length).to.equal(1);
            expect(game.room.length).to.equal(1);
            expect(users.users[0]._id).to.equal(user._id);
            expect(game.room[0]._id).to.equal(user._id);
            done();
        });
    });

    it('getById', function (done) {
        users.create(function (user) {
            expect(users.getById(user._id)).to.equal(user);

            users.create(function (user) {
                expect(users.getById(user._id)).to.equal(user);
                done();
            });
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
                    expect(game.room.length).to.equal(0);
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
