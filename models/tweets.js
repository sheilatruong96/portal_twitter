var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
	content: {type: String, required: true},
	date: {type: Date},
	user: {type: Object, required: true},
});

module.exports = mongoose.model('tweet', tweetSchema);
