var express = require('express');
var router = express.Router();

var io = require('../io');

var tweetModel = require('../models/tweets');
var userModel = require('../models/user');

var auth = require('../utils/auth');
router.use(auth.requireLogin);



router.get('/loadTweet/:username', function(req, res){
  tweetModel.find({"user.username": req.params.username.trim()}, function(err, tweet){
    if (err)
      return console.error(err);
    else
      res.send(JSON.stringify(tweet));
  });
});

router.get('/:username', function(req, res) {
  userModel.findOne(
	{ username: req.params.username.trim()},
		function(err, user) {
			if (err) res.send(err);
			if (user) {
        userModel.findOne(
          {username: req.user.username},
          function(err, currUser) {
            if (err) res.send(err);
            if (currUser) {
              if (currUser.following.includes(req.params.username.trim()) === true) {
                res.render('profile', {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  username: user.username,
                  currentUser: req.user.username,
                  following: true
    						});
              } else {
                res.render('profile', {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  username: user.username,
                  currentUser: req.user.username,
                  following: false
    						});
              }

            }
          }
        );
      } else {
				res.status(404).send('404 - Not found');
			}
		}
	);
});


router.post('/followUser/:username', function(req, res) {
  console.log("got into follow");
  userModel.findOneAndUpdate ({
     "_id": req.user._id,
   },
   {
     $addToSet: {
       following: req.params.username.trim()
     }
   },
   function(err, user) {
     if(err){
       return console.error(err);
     }
   }
 );



 userModel.findOneAndUpdate ({
    "username": req.params.username.trim(),
  },
  {
    $addToSet: {
      followers: req.user.username
    }
  },
  function(err, user) {
    if(err){
      return console.error(err);
    }
  });
  res.end();





});

module.exports = router;
