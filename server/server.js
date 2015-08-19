var express = require('express'); // Express web server framework
var cookieParser = require('cookie-parser');


var app = express();

console.log(__dirname)
app.use(express.static('app'))
   .use(cookieParser());

app.get('/route', function(req, res) {
  res.send('route');
})


console.log('Listening on 8888');
app.listen(8888);
