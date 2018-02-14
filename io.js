var io = null;
var cookie = require('cookie');
var config = require('./config');
var session = require('client-sessions');
var userModel = require('./models/user');



module.exports = {
  init: function(server){
          io = require('socket.io')(server);
          io.on('connection', function(socket){
            var cookies =  cookie.parse(socket.request.headers.cookie);
            var users = session.util.decode(config, cookies.session);

            userModel.findOne({_id: users.content.user._id}, function(err, user){
              if (err)
                return console.error(err);

              if (user){
                for (i = 0; i < user.followers.length; ++i){
                  socket.join(user.followers[i]);
                }
              }
              else {
                res.status(404).send('404 - User Not found');
              }
          })});
  },
  instance: function(){
    return io;
  }

};
