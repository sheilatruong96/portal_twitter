var mongoose = require('mongoose');

var schema = mongoose.Schema({
	email: {type: String, unique: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	following: {type: Array},
	followers: {type: Array}
});

module.exports = mongoose.model('users', schema);
