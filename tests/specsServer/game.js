var Game = require("../../server/modules/game");

var expect = require("chai").expect;
var should = require('chai').should();

var SocketMock = require('socket-io-mock');

var socket = new SocketMock();

describe('Game', function() {
    /*it('should listen', function(done) {
        var sock = new SocketMock();
        Game.listen(sock);
        sock.emit('connect');
        expect(Game.users.length).to.be.equal(1);

    });*/
    it('should test', function() {

        Game.listen(socket);
        socket.socketClient.emit('atest');
        Game.test.should.be.true;
    });

    it('Sockets should be able to talk to each other without a server', function(done) {
        var socket = new SocketMock()

        socket.on('message', function (message) {
            message.should.be.equal('Hello World!')
            done()
        })
        socket.socketClient.emit('message', 'Hello World!')
    })

});
