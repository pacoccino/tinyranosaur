"use strict";
var express = require('express');
var authenticatorRouter = express.Router({ params: 'inherit' });
var _ = require('lodash');

var Users = require('../models/users');


authenticatorRouter.get('/', function(req, res, next) {
  var result = {};
  if(req.session.userId) {
    result.status = "Connected";
    result.userId = req.session.userId;
  }
  else {
      result.status = "Not connected";
  }
  res.send(result);
});

authenticatorRouter.get('/connect', function(req, res, next) {
  Users.create(function(user) {
      var result = {
        status: 'ok',
        userId: user._id
      };

      if(req.query.name) {
        user.name = req.query.name;
      }

      req.session.userId = user._id;
      res.send(result);
  });

});

authenticatorRouter.get('/all', function(req, res, next) {
  Users.getAllPublic(function(users) {

      res.json(users);
  });

});

authenticatorRouter.get('/disconnect', function(req, res, next) {
  delete req.session.userId;
  res.send('disconnect ok');
});

module.exports = authenticatorRouter;
