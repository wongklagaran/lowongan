var LocalStrategy = require('passport-local').Strategy;
var UserPencariKerja = require('../database/userpencarikerja');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    UserPencariKerja.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('pencarikerja-daftar', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, username, password, done) {
    process.nextTick(function() {
      UserPencariKerja.findOne({ 'login.username':  username }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupPesan', 'Username ini Telah di gunakan.'));
        } else {
          var daftar = new UserPencariKerja();
          daftar.login.username = username;
          daftar.login.password = daftar.generateHash(password);
          daftar.save(function(err) {
            if (err)
              throw err;
            return done(null, daftar);
          });
        }
      });
    });
  }));

  passport.use('pencarikerja-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, username, password, done) {
    UserPencariKerja.findOne({ 'login.username':  username }, function(err, user) {
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
