var express = require('express'); // Express web server framework
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var socketio = require('socket.io');

var Game = require('./modules/game');
var authRouter = require('./routers/auth');

var app = express();

var PORT = process.env.PORT || 8888;

app.use(cookieParser());
app.use(expressSession({
  secret:'somesecrettokenhere',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('app'));

app.get('/route', function(req, res) {
 res.send('route');
});

app.use('/auth', authRouter);
console.log('Listening on '+ PORT);

var server = app.listen(PORT);
var io = socketio(server);
var game = new Game();
game.listen(io);
