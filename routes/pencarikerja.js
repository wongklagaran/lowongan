var express = require('express');
var moment = require('moment');
var passport = require('passport');
var User = require('../database/userpencarikerja');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('express-flash');
//var Auth_mdw= require('../middleware/authpencarikerja');
//var Auth_mdw = require('../middlewares/auth');
var router = express.Router();

var session_store;

//Register
router.get ('/register', function (req, res , next){
  res.render('pencarikerja/register.ejs');

});
/*
router.post('/register', function(req, res){

  var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('pencarikerja/register.ejs',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('msg_reg_berhasil', 'You are registered and can now login');



		res.redirect('pencarikerja/login');
	}

*/
router.post ('/register', function (req, res, next){

  // Register User

  router.post('/register', function(req, res){
  	var nama = req.body.nama;
    var alamat=req.body.alamat;
    var tanggal_lahir=req.body.tanggal_lahir;
    var notelepon=req.body.notelepon;
  	var email = req.body.email;
  	var username = req.body.username;
  	var password = req.body.password;
  	var password2 = req.body.password2;

  	// Validation
  	req.checkBody('nama', 'Nama is required').notEmpty();
    req.checkBody('alamat', 'alamat is required').notEmpty();
    req.checkBody('tanggal_lahir', 'tanggal_lahir is required').notEmpty();
    req.checkBody('notelepon', 'notelepon is required').notEmpty();
  	req.checkBody('email', 'Email is required').notEmpty();
  	req.checkBody('email', 'Email is not valid').isEmail();
  	req.checkBody('username', 'Username is required').notEmpty();
  	req.checkBody('password', 'Password is required').notEmpty();
  	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  	var errors = req.validationErrors();

  	if(errors){
      req.flash('msg_error','');
  		res.render('register',{
  			errors:errors
  		});
  	} else {
  		var newUser = new User({
  			nama: nama,
        alamat:alamat,
        tanggal_lahir,
        tanggal_lahir,
        notelepon:notelepon,
  			email:email,
  			username: username,
  			password: password
  		});

  		User.createUser(newUser, function(err, user){
  			if(err) throw err;
  			console.log(user);
  		});

  		req.flash('success_msg', 'You are registered and can now login');

  		res.redirect('/users/login');
  	}
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
     User.getUserByUsername(username, function(err, user){
     	if(err) throw err;
     	if(!user){
     		return done(null, false, {message: 'Unknown User'});
     	}

     	User.comparePassword(password, user.password, function(err, isMatch){
     		if(err) throw err;
     		if(isMatch){
     			return done(null, user);
     		} else {
     			return done(null, false, {message: 'Invalid password'});
     		}
     	});
     });
    }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

  /*
      session_store = req.session;

      req.assert('username', 'username').notEmpty();
      req.assert('nama', 'Nama').notEmpty();
      req.assert('alamat', 'alamat').notEmpty();
      req.assert('notelepon', 'notelepon').notEmpty();
      req.assert('email', 'email').isEmail();
      req.assert('password', 'password').notEmpty();
    //  req.assert('password2', 'Tanggal sekarang ').notEmpty();
      req.assert('tanggal_lahir', 'tanggal_lahir').notEmpty();


      var errors = req.validationErrors();
      console.log(errors);

      if (!errors)
      {
          i_username = req.sanitize( 'username' ).escape().trim();
          i_nama = req.sanitize( 'nama' ).escape().trim();
          i_alamat = req.sanitize( 'alamat' ).escape().trim();
          i_notelepon = req.sanitize( 'notelepon' ).escape().trim();
          i_email = req.sanitize( 'email' ).escape().trim();
          i_password = req.sanitize( 'password' ).escape().trim();
      //    i_password2 = req.sanitize( 'password2' ).escape().trim();
          i_tanggal_lahir = req.sanitize( 'tanggal_lahir' ).escape().trim();


          User.find({ 'nama': req.param('nama') }, function (err, row){
              if (row.length == 0)
              {
                  var p = new User({
                      'username':i_username,
                      'nama':i_nama,
                      'alamat':i_alamat,
                      'notelepon':i_notelepon,
                      'email':i_email,
                      'password':i_password,
                    //  'password2':i_TanggalInput,
                      'tanggal_lahir':i_tanggal_lahir,

                  });

                  p.save(function(err) {
                      if (err)
                      {
                          console.log(err);

                          req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem / Programkami...');
                          res.redirect('/pencarikerja/register.ejs');

                      }
                      else
                      {

                          res.redirect('/pencarikerja/login.ejs');
                      }
                  });
              }
              else
              {
                  req.flash('msg_info', 'Maaf User sudah ada');
                  res.render('pencarikerja/register.ejs', {
                      session_store:session_store,
                      nama: req.param('nama'),
                      alamat: req.param('alamat'),
                      notelepon: req.param('notelepon'),
                      email: req.param('email'),

                  });
              }
          });
      }
      else
      {
          // menampilkan pesan error
          errors_detail = "<p> ada salah pengisian check lagi formnyah!</p><ul>";

          for (i in errors)
          {
              error = errors[i];
              errors_detail += '<li>'+error.msg+'</li>';
          }

          errors_detail += "</ul>";

          req.flash('msg_error', errors_detail);
          res.render('pencarikerja/register.ejs', {
              session_store: session_store,
              nama: req.param('nama'),
              alamat: req.param('alamat'),
              notelepon: req.param('notelepon'),
              email: req.param('email'),
          });
      }

*/
});

//login
router.get('/login' , function (req, res ,next){
  res.render('login')
});

//Ahir Register
router.get('/', function(req, res, next) {
  res.render('pencarikerja/index');
});
router.post('/', function(req, res, next) {
  res.render('pencarikerja/index');
});
// new user daftar pencari kerja

router.get('/login', function(req, res, next) {
  res.render('pencarikerja/login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('pencarikerja/signup.ejs', { message: req.flash('signupPesan') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('pencarikerja/profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res){
    req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else
    {
      res.redirect('/pemberikerja');
    }
  });
});



router.post('/signup', passport.authenticate('pencarikerja-daftar', {
  successRedirect: '/pencarikerja/index',
  failureRedirect: '/pencarikerja/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('login-pencarikerja', {
  successRedirect: '/pencarikerja/addlowker',
  failureRedirect: '/pencarikerja/login',
  failureFlash: true,
}));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}





module.exports = router;
