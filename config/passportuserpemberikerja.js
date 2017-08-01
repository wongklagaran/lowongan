var LocalStrategy = require('passport-local').Strategy;
var User = require('../database/userpemberilowker');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    namauserField: 'namauser',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, namauser, password, done) {
    process.nextTick(function() {
      User.findOne({ 'user.namauser':  namauser }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'namauser ini telah di gunakan'));
        } else {
          var newUser = new User();
          newUser.user.namauser = namauser;
          newUser.user.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('pemberikerja-login', new LocalStrategy({
    unamauserField: 'namauser',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, username, password, done) {
    User.findOne({ 'user.namauser':  namauser }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      return done(null, user);
    });
  }));
};
