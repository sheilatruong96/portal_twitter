var mongoose = require('mongoose');
var salt = 10;
var bcrypt = require('bcrypt');

var schema = mongoose.Schema({
	email: {type: String, unique: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	following: {type: Array},
	followers: {type: Array}
});

// schema.methods.checkPassword = function(password) {
// 	return bcrypt.compare( password,this.password);

// }


schema.methods.checkPassword = function(password) {
	var that = this;
	return new Promise(function(resolve, reject) {
	bcrypt.compare(password, that.password, function(err, res) {
		if(err) {
			return reject (err);
		}
		return resolve(res);
	});
	});
}

schema.statics.hashPassword = function(password) {
	return bcrypt.hashSync(password, salt);
}

module.exports = mongoose.model('users', schema);
