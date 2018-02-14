var express = require('express');
var router = express.Router();
var userModel = require('../models/user');

router.get('/', function(req, res, next) {
  res.render('loginSignUp'); //views ejs file
});

router.post('/register', function(req, res) {
  userModel.findOne({
    email: req.body.email,
  }, function(err, user){
    if (err) return console.error(err);
    if (user) {
      res.render('loginSignUp', {emailError: 'Email already in use.'});
    } else {
      userModel.findOne({
        username: req.body.username,
      }, function(err, user){
        if (err) return console.error(err);
        if (user) {
          res.render('loginSignUp', {usernameError: 'Username already in use.'});
        } else{
          var newUser = new userModel({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            following: [],
            followers: []
          });

          newUser.save(function(err, user){
            if (err) return console.error(err);
            req.session.user = user;
            res.redirect('/home');
          });
        }
      })
    }})
});


// login
router.post('/auth', function(req, res) {
	userModel.findOne({email: req.body.email, password: req.body.password}, function(err, user){
    if(err) {
    	console.error(err);
    	res.render('loginSignUp', {authError: 'Something went wrong!'});
    }
    if (user) {
      req.session.user = user;
    	res.redirect('/home');
    } else {
    	res.render('loginSignUp', {authError: 'Invalid Username or Password'});
    }
  });
});


module.exports = router;
