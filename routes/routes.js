var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;

router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/listings', (req,res) => {

})
module.exports = router;
