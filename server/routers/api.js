"use strict";
var express = require('express');
var gameApiRouter = express.Router({ params: 'inherit' });

gameApiRouter.get('/', function(req, res, next) {
  res.send('api ok');
});

module.exports = gameApiRouter;
