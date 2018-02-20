var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
var bcrypt = require('bcrypt');


router.get('/', function(req, res, next) {
  res.render('loginSignUp'); //views ejs file
});

router.post('/register', function(req, res) {
  const saltRounds = 10;

  userModel.findOne({
    email: req.body.email,
  }, function(err, users){
    if (err) return console.error(err);
    if (users) {
      res.render('loginSignUp', {emailError: 'Email already in use.'});
    } else {
      userModel.findOne({
        username: req.body.username,
      }, function(err, user){
        if (err) return console.error(err);
        if (user) {
          res.render('loginSignUp', {usernameError: 'Username already in use.'});
        } else{

          // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            var newUser = new userModel({
              email: req.body.email,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              username: req.body.username,
              // password: hash,
              password: userModel.hashPassword(req.body.password, function(err, test) {
                console.log(err);
              }),
              following: [],
              followers: []
            });
            newUser.save(function(err, user){
              if (err) return console.error(err);
              req.session.user = user;
              res.redirect('/home');
            });
          // });
        }
      })
    }})
});

// login
router.post('/auth', function(req, res) {
	userModel.findOne({email: req.body.email}, function(err, user){
    if(err) {
    	console.error(err);
    	res.render('loginSignUp', {authError: 'Something went wrong!'});
    }
    if (user) {
      user.checkPassword(req.body.password)
      .then(function(result){
        if (result) {
          req.session.user = user;
          res.redirect('/home');
        }
        else
          res.render('loginSignUp', {authError: 'Invalid Username or Password'});
      })
      .catch(function(err){
        console.log(err);
        res.render('loginSignUp', {authError: 'Invalid Username or Password'});

        // res.status(500).send(err);
      })
      // bcrypt.compare(req.body.password, user.password, function(err, response) {
      //   if (response) {
      //     req.session.user = user;
      //     res.redirect('/home');
      //   }
      //   else {
      //     res.render('loginSignUp', {authError: 'Invalid Username or Password'});
      //   }
      // });

    } else {
    	res.render('loginSignUp', {authError: 'Invalid Username or Password'});
    }
  });
});


module.exports = router;
