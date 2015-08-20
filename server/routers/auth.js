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
  Users.getAll(function(users) {

      var result = [];
      for(var i=0; i<users.length; i++) {
          var user = users[i];
          result.push(_.pluck(user, ['_id', 'name']));
      }

      res.send(users);
  });

});

authenticatorRouter.get('/disconnect', function(req, res, next) {
  delete req.session.userId;
  res.send('disconnect ok');
});

module.exports = authenticatorRouter;
