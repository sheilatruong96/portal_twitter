var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('client-sessions');
var userModel = require('./models/user');


var profile = require('./routes/profile');
var users = require('./routes/users');

var home = require('./routes/home');
var loginSignUp = require('./routes/loginSignUp');


var userSession = require('./config');

var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/twitter');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('CONNECTED TO MONGO');
});


// just added
app.use(session(userSession));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {

    // userModel.findOne({ email: req.session.user.email }, function(err, user) {
		userModel.findOne({ _id: req.session.user._id  }, function(err, user) {
      if (user) {
        req.user = user.toObject(); //
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value; updating/refreshing the session
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/home', home);
app.use('/login', loginSignUp);
app.use('/profile', profile);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
