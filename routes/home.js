var express = require('express');
var router = express.Router();

var io = require('../io');

var tweetModel = require('../models/tweets');
var userModel = require('../models/user');

var auth = require('../utils/auth');
router.use(auth.requireLogin);

router.get('/', function(req, res, next) {
  userModel.findOne({"email": req.user.email}, function(err, user){
    if (err)
      return console.error(err);
    else
      res.render('home', {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        followers: user.followers,
      });
  });
});


router.get('/loadTweet', function(req, res){
  userModel.findOne({"_id": req.user._id}, function(err, user){
    if (err) return res.send(err);
    if (user) {
      tweetModel.find({"user.username": {$in: user.following}}, function(err, tweets){
        if (err) {
          return console.error(err);
        }
        res.send(JSON.stringify(tweets));
      });
    }
    else {
      req.session.reset();
      res.redirect('/login');
    }
  });


  // tweetModel.find({}, function(err, tweet){
  //   if (err)
  //     return console.error(err);
  //   else
  //     res.send(JSON.stringify(tweet));
  // });
});

router.post('/addTweet', function(req, res){
  var newTweet = new tweetModel ({
    content: req.body.content,
  	date: new Date(),
  	user: req.user,
  });


  // // now, it's easy to send a message to just the clients in a given room
  // room = req.user.username;
  // io.instance().sockets.in(room).emit('message', req.body.content.trim());

  newTweet.save(function(err, tweet) {
      if(err)
         res.status(500).send(err);
      else {
        // now, it's easy to send a message to just the clients in a given room
        room = req.user.username;
        io.instance().sockets.in(room).emit('message', tweet);

        res.status(201).json(tweet);

      }
  });
});


router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/login');
});

module.exports = router;
